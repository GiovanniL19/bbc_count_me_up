import Model from 'ember-pouch/model';
import DS from 'ember-data';

const {
  attr,
  belongsTo
} = DS;

export default Model.extend({
  vote: belongsTo("candidate", {async:true}),
  user: belongsTo("user", {async:true}),
  value: attr("number", {defaultValue: 1}),
  timestamp: attr("number")
});
