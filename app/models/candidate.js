import Model from 'ember-pouch/model';
import DS from 'ember-data';

const {
  attr,
  hasMany,
} = DS;

export default Model.extend({
  rev: attr("string"),
  type: attr("string", {defaultValue: "Candidate"}),
  votes: hasMany("vote", {defaultValue: [], async:true}),
  name: attr("string"),
  email: attr("string"),
  image: attr("string"),

  numberOfVotes: function(){
    return this.get("votes.length");
  }.property("votes")
});
