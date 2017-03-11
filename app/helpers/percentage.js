import Ember from 'ember';

export function percentage([vote, total]) {
  if(vote) {
    let result = ((vote / total) * 100).toFixed(2);
    if(result === "Infinity"){
      return 0;
    }else{
      return result;
    }
  }else{
    return 0;
  }
}

export default Ember.Helper.helper(percentage);
