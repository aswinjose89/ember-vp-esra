import Ember from 'ember';
import detailConfig from '../utils/detail-config';

export default Ember.Helper.extend({
  esraCommonService: Ember.inject.service(),
  compute([value, ...rest], hash) {
    /**
     * [MenuAction Referred it in workflowAction ,signoffRequirement and Signoff Followup Action]
     * @param  {[type]} message  [description]
     * @param  {[type]} position [description]
     * @return {[type]}          [description]
     */
    if (Ember.isEqual(hash.field, "MenuAction")) {
      let actionItem = value.items.map(item => {
        if (Ember.isEqual(hash.controls.get(item.actionControl).toUpperCase(), "E")) {
          return item;
        }
        else if (Ember.isEqual(hash.controls.get(item.actionControl).toUpperCase(), "V")) {
          item.set('isDisabled', true);
          return item;
        }
        return null;
      }).compact();
      value.set('items', actionItem);
    }
    else if (Ember.isEqual(hash.field, "approvalRoute")) {
      return value.map(item => {
        if (Ember.isEqual(item.value, "0001")) {
          item.disabled = hash.controls.get('esrmRouteOnly');
        }
        else if (Em.isEqual(hash.controls.get('outcome'), '0001') && !hash.controls.get('esrmRouteOnly') && Ember.isEqual(item.value, "0002")) {
          item.disabled = true;
        }
        return item;
      });
    }
    else if (Ember.isEqual(hash.flag, "STATUSCONFIG")) {
      let signoffActionStatus = detailConfig().get('signoffActionStatus');
      signoffActionStatus.get("component.config").setProperties({
        label: this.get('esraCommonService').pickListSignOffActivityStatusType(value, "description"),
        color: this.get('esraCommonService').pickListSignOffActivityStatusType(value, "param1")
      });
      return signoffActionStatus;
    }
    return value;
  }
});


