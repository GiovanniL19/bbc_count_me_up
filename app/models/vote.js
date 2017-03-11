import Model from 'ember-pouch/model';
import DS from 'ember-data';

const {
  attr,
  belongsTo
} = DS;

export default Model.extend({
  rev: attr("string"),
  type: attr("string", {defaultValue: "Vote"}),
  candidate: belongsTo("candidate", {async:true}),
  user: belongsTo("user", {async:true}),
  value: attr("number", {defaultValue: 1}),
  timestamp: attr("number")
});
