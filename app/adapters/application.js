import PouchDB from 'pouchdb';
import { Adapter } from 'ember-pouch';

var db = new PouchDB('count-me-up-pouch');

export default Adapter.extend({
  db: db
});
