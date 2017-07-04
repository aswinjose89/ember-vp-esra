import Ember from 'ember';

export default Ember.Helper.extend({
  esraCommonService: Ember.inject.service(),
  compute([value, ...rest], hash) {
    if (Ember.isEqual(hash.flag, 'dateformat')) {
      return (value) ? this.get('esraCommonService').dateFormat(value) : value;
    }
    else if (Ember.isEqual(hash.flag, 'ENDREPEAT')) {
      return (value) ? this.get('esraCommonService').dateFormat(value) : '-';
    }
    else if (Ember.isEqual(hash.flag, 'EMAILREMINDER')) {
      return (value) ? this.get('esraCommonService').dateFormat(value) : 'None';
    }
    else if (Ember.isEqual(hash.flag, 'REMINDER_START_DATE')) {
      let result = new Date();
      result.setDate(new Date(value).getDate() + 1);
      return (result) ? result.getTime() : value;
    }
    else if (Ember.isEqual(hash.flag, 'REMINDER_END_DATE')) {
      let currentDate = new Date(value), previousOfDueDate = new Date(currentDate.getTime() - (24 * 60 * 60 * 1000));
      return (value) ? previousOfDueDate.getTime() : value;
    }
  }
});
