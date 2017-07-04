import Ember from 'ember';

export default Ember.Helper.extend({
  /*TODO: Handle this helper without using simple 'else' case otherwise it will impact*/
  filteredActionList() {
    let [value, esraActivity] = arguments;
    //return value.filter(x => {
      //return (esraActivity.get(x.get('actionControl')) === 'V' || esraActivity.get(x.get('actionControl')) === 'E');
    //});
    return (value)?value.filter(function (x) {
        return esraActivity.get(x.get('actionControl')) === 'V' || esraActivity.get(x.get('actionControl')) === 'E';
      }):[];
  },
  compute([value, ...rest], hash) {
    if (Ember.isEqual(hash.flag, 'headermenu')) {
      return (this.filteredActionList(value, hash.esraActivity).length >= hash.count);
    }
    else if (Ember.isEqual(hash.flag, 'buttonlist')) {
      return (this.filteredActionList(value, hash.esraActivity).length <= hash.count);
    }
    else if (Ember.isEqual(hash.flag, 'signoffReq')) {
      if (value && value.get('content')) {
        return !(value.get('content').length > 0);
      }
      return true;
    }
    else if (Ember.isEqual(hash.flag, 'signoffAtn')) {
      if (value && value.get('content')) {
        return !(value.get('content').length > 0);
      }
      else if (value) {
        return false;
      }
      return true;
    }
    else if (Ember.isEqual(hash.flag, 'signoffAtnAssignees')) {
      if (value && value.get('content')) {
        return (value.get('content').length > 0);
      }
      return (value.length > 0);
    }
    else if (Ember.isEqual(hash.flag, 'ACTIONMENU')) {
      if (value) {
        return (value.length > 0);
      }
    }
  }
});
