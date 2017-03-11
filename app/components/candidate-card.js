import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  candidate: null,
  user: null,

  actions:{
    createVote(){
      let candidate = this.get("candidate");
      let user = this.get("user");

      let vote = this.get("store").createRecord("vote", {
        value: 1,
        user: user,
        candidate: candidate
      });
      vote.save().then(function(newVote) {
        candidate.get("votes").pushObject(newVote);
        user.get("votes").pushObject(newVote);
        candidate.save();
        user.save();
      });
    }
  }
});
