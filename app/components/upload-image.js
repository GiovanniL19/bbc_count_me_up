import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'input',
  attributeBindings: ['name', 'type'],
  type: 'file',
  file: null,
  fileSize: 0,
  fileType: null,
  change: function (event) {
    //Get the file selected
    var reader = new FileReader(), controller = this;

    reader.onload = function (event) {
      var fileToUpload = event.target.result;
      Ember.run(function() {
        controller.set('file', fileToUpload);
      });
    };

    controller.set('fileType', event.target.files[0].type);
    controller.set('fileSize', event.target.files[0].size);
    return reader.readAsDataURL(event.target.files[0]);
  }
});
