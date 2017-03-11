import Ember from 'ember';

export default Ember.Controller.extend({
  candidates: [],
  winners: [],
  runnerUps:[],
  user: null,
  searchString: "",
  addingCandidate: false,
  candidate: null,
  email: "giovanni16.gl@gmail.com",
  selectedImage: {
    image: "",
    imageSize: 0,
    imageType: ""
  },

  total: 0,
  totalObserver: function(){
    let controller = this;

    this.store.findAll("vote").then(function(votes){
      controller.set("total", votes.get("length"));
    });
  }.observes("candidates@each.votes.length"),

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
    logout(){
      this.set("user", null);
    },
    login(){
      let controller = this;
      if(this.get("email")) {
        let email = this.get("email").toUpperCase();
        this.store.query('user', {
          filter: {
            email: email
          }
        }).then(function (results) {
          if (results.get("length") === 1) {
            controller.set("user", results.get("firstObject"));
          } else {
            let user = controller.store.createRecord("user", {
              email: email
            });
            user.save().then(function (newUser) {
              controller.set("user", newUser);
            });
          }
        });
      }else{
        alert("You need to enter an email");
      }
    },
    selectImage(){
      //Opens file explorer
      Ember.$('#selectImage').click();
    },
    addCandidate(){
      let controller = this;

      //Validate input
      if(this.get("candidate.name") && this.get("candidate.email")) {
        //Saves the candidate object
        this.get("candidate").save().then(function () {
          //Clears the candidate and returns user back to list
          controller.set("candidate", null);
          controller.set("addingCandidate", false);
          controller.clear();
        }, function () {
          alert("Failed, please try again");
        });
      }else{
        alert("Please enter name and email");
      }
    },
    toggleAddCandidate(){
      //Toggles addingCandidate property
      this.set("addingCandidate", !this.get("addingCandidate"));
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
