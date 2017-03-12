import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
  results: Ember.inject.controller("results"),

  candidates: [],
  filter: false,
  user: null,
  searchString: "",
  addingCandidate: false,
  candidate: null,
  email: "",
  selectedImage: {
    image: "",
    imageSize: 0,
    imageType: ""
  },
  startDate: null,
  endDate: null,
  total: 0,

  //Updates total votes made by observing all candidates votes
  totalObserver: function(){
    let controller = this;

    this.store.findAll("vote").then(function(votes){
      controller.set("total", votes.get("length"));
    });
  }.observes("candidates@each.votes.length"),

  //If an image is selected, then set the base 64 to new candidate object
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
    reset(){
      if(confirm("You are about to reset the application to default, clearing all data")) {
        //Deletes local database
        window.indexedDB.deleteDatabase("_pouch_count-me-up-pouch");
        //Reloads application
        location.reload();
      }
    },

    generateCandidates(){
      //Creates 5 new candidates
      for(var i = 0; i < 5; i++){
        let candidate = this.set("candidate", this.store.createRecord("candidate", {
          name: "candidate - " + (i + 1),
          email: "none"
        }));
        candidate.save();
      }
    },

    clearFilter(){
      //Hides filter
      this.set("filter", false);
    },

    filter(){
      let controller = this;
      //Shows filter
      this.set("filter", true);

      //Initialises properties
      this.set("results.filteredCandidates", []);

      //24 hours is added to end date time because it is by default set to 00:00, therefore, adding 24 hours sets the time to the end of the day
      let start = moment(this.get("startDate")).unix();
      let end = moment(this.get("endDate")).add(24, "h").unix();

      var votes = 0;


      //Loop candidates
      this.get("candidates").forEach(function (candidate) {
        //Create new filtered votes array
        candidate.set("filteredVotes", []);

        //Loop through votes to check timestamp
        candidate.get("votes").forEach(function (vote) {
          //Check if vote is within time frame
          if (vote.get("timestamp") >= start && vote.get("timestamp") <= end) {
            //Add 1 to vote count
            votes++;

            //Add vote to filtered array
            candidate.get("filteredVotes").pushObject(vote);

          }
        });

        controller.get("results.filteredCandidates").pushObject(candidate);
      });

      this.set("results.filteredTotalVotes", votes);
    },

    logout(){
      //Removes user
      this.set("user", null);
    },

    login(){
      let controller = this;

      //Finds user by email
      if(this.get("email")) {
        let email = this.get("email").toUpperCase();
        this.store.query('user', {
          filter: {
            email: email
          }
        }).then(function (results) {
          //Checks if user exists, if so logs them in
          if (results.get("length") === 1) {
            //Set the found user
            controller.set("user", results.get("firstObject"));
          } else {

            //Creates new user and sets user
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
