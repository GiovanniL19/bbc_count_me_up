import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  candidate: null,
  user: null,
  totalVotes: 0,

  //Gets the total votes
  totalObserver: function(){
    let controller = this;

    this.get("store").findAll("vote").then(function(votes){
      controller.set("totalVotes", votes.get("length"));
    });

  }.observes("candidate.votes.length"),

  //Checks if user has already voted for this candidate
  didUserVote: function(){
    let controller = this;
    if(this.get("user")) {
      var returnValue = false;
      this.get("candidate.votes").forEach(function (vote) {
        if (vote.get("user.email") === controller.get("user.email")) {
          returnValue = true;
        }
      });
      return returnValue;
    }
  }.property("candidate.votes.length"),

  actions:{
    //Removes a single vote from the candidate
    removeVote(){
      let controller = this;
      let candidate = this.get("candidate");
      var removedOne = false;

      candidate.get("votes").forEach(function (vote) {
        if(vote) {
          if (controller.get("user.id") === vote.get("user.id") && removedOne === false) {
            controller.get("user.votes").removeObject(vote);
            controller.get("candidate.votes").removeObject(vote);

            vote.deleteRecord();
            vote.save();

            controller.get("candidate").save();
            controller.get("user").save();
            removedOne = true;
          }
        }
      });
    },

    createVote(){
      //Adds a single vote to the candidate
      let candidate = this.get("candidate");
      let user = this.get("user");

      let vote = this.get("store").createRecord("vote", {
        value: 1,
        user: user,
        candidate: candidate,
        timestamp: moment().unix()
      });

      vote.save().then(function(newVote) {
        candidate.get("votes").pushObject(newVote);
        candidate.save().then(function(){
          user.get("votes").pushObject(newVote);
          user.save();
        });
      });
    }
  }
});
