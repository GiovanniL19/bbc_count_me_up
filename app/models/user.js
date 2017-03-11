import Model from 'ember-pouch/model';
import DS from 'ember-data';

const {
  attr,
  hasMany
} = DS;

export default Model.extend({
  rev: attr("string"),
  type: attr("string", {defaultValue: "User"}),
  totalVotes: attr("number", {defaultValue: 3}),
  votes: hasMany("vote", {defaultValue: [], async: true}),
  email: attr("string"),

  canVote: function(){
    if(this.get("votes.length") < 3){
      return true;
    }else{
      return false;
    }
  }.property("votes"),

  votesLeft: function(){
    return 3 - this.get("votes.length");
  }.property("votes")
});
