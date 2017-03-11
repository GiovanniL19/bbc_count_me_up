import Ember from 'ember';

export default Ember.Controller.extend({
  candidates: [],
  searchString: "",
  addingCandidate: false,
  candidate: null,

  selectedImage: {
    image: "",
    imageSize: 0,
    imageType: ""
  },

  uploadProfileImage: function(){
    //On image select do the following
    var controller = this;
    controller.set('userImage', null);

    //Check if not null
    if(this.get("selectedImage.imageType")) {
      try {
        //Check the image size
        if (this.get('selectedImage.imageSize') > 3000000) {
          alert("Image is too large, (max 30MB)");
        } else {
          let type = this.get('selectedImage.imageType');
          //Check the type
          if (type === 'image/jpeg' || type === 'image/jpg' || type === 'image/png') {
            //Sets the base 64 image to the candidate object
            controller.set('candidate.image', this.get('selectedImage.image'));
          } else {
           alert("Image must be .JPG, .JPEG, or .PNG");
          }
        }
      } catch (err) {
        console.log('No profile picture selected');
        console.log(err);
      }
    }

  }.observes('selectedImage.image'),


  clear: function(){
    //Clears data
    this.set("selectedImage", {
      "image": "",
      "imageSize": "",
      "imageType": "",
    });

    if(!this.get("candidate.id")){
      this.get('candidate').destroyRecord();
    }

    this.set("candidate", null);
  },

  actions:{
    selectImage(){
      //Opens file explorer
      Ember.$('#selectImage').click();
    },
    addCandidate(){
      let controller = this;
      //Saves the candidate object
      this.get("candidate").save().then(function(){
        //Clears the candidate and returns user back to list
        controller.set("candidate", null);
        controller.set("addingCandidate", false);
        controller.clear();
      }, function(){
        alert("Failed, please try again");
      });
    },
    toggleAddCandidate(){
      //Toggles addingCandidate property
      this.set("addingCandidate", !this.get("addingCandidate"))
      //If the candidate is empty then create the record (initialising the object)
      if(this.get("candidate") === null){
        //Add candidate clicked
        this.set("candidate", this.store.createRecord("candidate"));
      }else{
        //Else, clear the data (back button)
        this.clear();
      }
    }
  }
});
