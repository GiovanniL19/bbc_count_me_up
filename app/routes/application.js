import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller){
    //Gets and sets candidates
    let candidates = this.store.findAll("candidate");
    controller.set("candidates", candidates);

    if (this.get('router.url') === "/") {
      controller.transitionToRoute("results");
    }
  }
});
