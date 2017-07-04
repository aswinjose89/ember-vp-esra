import Ember from 'ember';

export default Ember.Helper.extend({
  esraCommonService: Ember.inject.service(),
  listOptions: [{
    "displayText": "Yes",
    "isVisible": "true",
    "value": true
  },
  {
    "displayText": "No",
    "isVisible": "true",
    "value": false
  }],
  compute([value]) {
    if (value.get('dataType') && Ember.isEqual(value.get('dataType').toUpperCase(), "BOOLEAN")) {
      return this.get('esraCommonService').isDefined(value.get('fieldAttributes.listOptions')) ?
        value.get('fieldAttributes.listOptions') : this.listOptions;
    }
    else {
      return value.get('fieldAttributes.listOptions');
    }
  }
});
