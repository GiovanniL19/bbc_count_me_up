import DS from 'ember-data';
export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    votes: {
      serialize: 'ids',
      deserialize: 'ids'
    }
  }
});
