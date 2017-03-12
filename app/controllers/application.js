import Ember from 'ember';

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
    clearFilter(){
      this.set("filter", false);
    },
    filter(){
      this.set("filter", true);

      this.set("results.filteredCandidates", []);
      let controller = this;
      let start = moment(this.get("startDate")).unix();
      let end = moment(this.get("endDate")).unix();

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
