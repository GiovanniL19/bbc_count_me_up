import Ember from 'ember';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),
  filteredCandidates: [],
  sortDesc: ['numberOfVotes:desc'],
  sortedCandidates: Ember.computed.sort('application.candidates', 'sortDesc'),

  filteredSortDesc: ['numberOfFilteredVotes:desc'],
  filteredSortedCandidates: Ember.computed.sort('filteredCandidates', 'filteredSortDesc'),

  filteredTotalVotes: 0,

  getTopVoted: function(){
    var response = [];

    //Gets first candidate from sorted array
    if(this.get("sortedCandidates.length") !== 0) {
      var numberOfVotes = 0;

      this.get("sortedCandidates").forEach(function(candidate, index){
        if(index === 0){
          numberOfVotes = candidate.get("numberOfVotes");
          response.pushObject(candidate);
        }else{
          if(numberOfVotes === candidate.get("numberOfVotes")){
            response.pushObject(candidate);
          }
        }
      });

      return response;
    }else{
      return null;
    }
  }.property("sortedCandidates"),

  getFilteredTopVoted: function(){
    //Gets first candidate from sorted array
    if(this.get("sortedCandidates.firstObject.numberOfFilteredVotes") !== 0) {
      return this.get("filteredSortedCandidates.firstObject");
    }else{
      return null;
    }
  }.property("filteredSortedCandidates", "filteredTotalVotes", "filteredCandidates")
});
