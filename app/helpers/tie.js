import Ember from 'ember';

export function tie(getTopVoted) {
  if(getTopVoted.get("firstObject.length") === 1){
    return "All Time Winner";
  }else{
    return "Tie";
  }
}

export default Ember.Helper.helper(tie);
