import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller){
    //Gets and sets candidates
    let candidates = this.store.findAll("candidate");
    controller.set("candidates", candidates);

    if (this.get('router.url') === "/") {
      controller.transitionToRoute("results");
    }
  },
  beforeModel: function(){
    //Does lookup for controller
    let controller = this.controllerFor("application");

    //Gets all votes, and sets the total length of array to total property
    controller.store.findAll("vote").then(function(votes){
      controller.set("total", votes.get("length"));
    });
  }
});
