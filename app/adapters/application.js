import PouchDB from 'pouchdb';
import { Adapter } from 'ember-pouch';

//var remote = new PouchDB('http://localhost:5984/count-me-up');
var db = new PouchDB('count-me-up-pouch');
//
// db.sync(remote, {
//   live: true,
//   retry: true
// });

export default Adapter.extend({
  db: db
});
