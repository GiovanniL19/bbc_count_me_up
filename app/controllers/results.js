import Ember from 'ember';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),
  runnersUp: [],

  sortDesc: ['numberOfVotes:desc'],
  sortedCandidates: Ember.computed.sort('application.candidates', 'sortDesc'),
  getTopVoted: function(){
    debugger;
    return this.get("sortedCandidates.firstObject");
  }.property("sortedCandidates")
});
