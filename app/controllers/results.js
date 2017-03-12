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
    return this.get("sortedCandidates.firstObject");
  }.property("sortedCandidates"),

  getFilteredTopVoted: function(){
    if(this.get("sortedCandidates.firstObject.numberOfFilteredVotes") !== 0) {
      return this.get("filteredSortedCandidates.firstObject");
    }else{
      return null;
    }
  }.property("filteredSortedCandidates", "filteredTotalVotes", "filteredCandidates")
});
