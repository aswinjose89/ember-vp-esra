import Ember from 'ember';

export default Ember.Helper.extend({
  esraCommonService: Ember.inject.service(),
  compute([value, ...rest], hash) {
    if (Ember.isEqual(hash.flag, 'LABELCONDITION')) {
      if (Em.isEqual(value.get('type'), 'wb-label') && value.get('label') && value.get('label').split('##').length > 2) {
        return true;
      }
    }
    // else if (Ember.isEqual(hash.flag, 'LABELNAME')) {
    //   if (Em.isEqual(value.get('type'), 'wb-label') && value.get('label') && value.get('label').split('##').length > 0) {
    //     return value.get('label').split('##')[1];
    //   }
    // }
    // else if (Ember.isEqual(hash.flag, 'LABELVALUE')) {
    //   if (Em.isEqual(value.get('type'), 'wb-label') && value.get('label') && value.get('label').split('##').length > 0) {
    //     return value.get('label').split('##').get('lastObject');
    //   }
    // }
  }
});
