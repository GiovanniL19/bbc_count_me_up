import Model from 'ember-pouch/model';
import DS from 'ember-data';

const {
  attr,
  hasMany,
} = DS;

export default Model.extend({
  votes: hasMany("vote", {defaultValue: [], async:true}),
  name: attr("string"),
  email: attr("string"),
  image: attr("string")
});
