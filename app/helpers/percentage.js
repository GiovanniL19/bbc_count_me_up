import Ember from 'ember';

export function percentage([vote, total]) {
  if(vote) {
    return ((vote / total) * 100).toFixed(2);
  }else{
    return 0;
  }
}

export default Ember.Helper.helper(percentage);
