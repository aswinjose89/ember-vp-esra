import Ember from 'ember';

export const pickListHelper = {
  esraCommonService: Ember.inject.service(),
  picklistMapping(value, hash) {
    if (hash && Ember.isEqual(hash.type.toUpperCase(), "PRODUCTTYPE")) {
      if (this.get('esraCommonService').isDefined(hash.index)) {
        value = this.get('esraCommonService').pickListDpProductType(value[hash.index].code, "description");
      }
      else if (Ember.isNone(hash.index)) {
        value = value.map(val => {
          return this.get('esraCommonService').pickListDpProductType(val.code, "description");
        });
      }
    }
    else if (hash && Ember.isEqual(hash.type.toUpperCase(), "SUBPRODUCTTYPE")) {
      if (this.get('esraCommonService').isDefined(hash.index)) {
        value = this.get('esraCommonService').pickListSubProductType(value[hash.index].code, "longDescription");
      }
      else if (Ember.isNone(hash.index)) {
        value = value.map(val => {
          return this.get('esraCommonService').pickListSubProductType(val.code, "longDescription");
        });
      }
    }
    else if (hash && Ember.isEqual(hash.type.toUpperCase(), "ACTIONTYPE")) {
      value = (hash.color) ? this.get('esraCommonService').pickListActionType(value, "param1") :
        this.get('esraCommonService').pickListActionType(value, "description");
    }
    else if (hash && Ember.isEqual(hash.type.toUpperCase(), "STATUSTYPE")) {
      value = (hash.color) ? this.get('esraCommonService').pickListStatusType(value, "param1") :
        this.get('esraCommonService').pickListStatusType(value, "description");
    }
    else if (hash && Ember.isEqual(hash.type.toUpperCase(), "DLPLACCESS")) {
      value = this.get('esraCommonService').pickListDlplAccess(value, "description");
    }
    else if (hash && Ember.isEqual(hash.type.toUpperCase(), "DLPLTEAMROLE")) {
      value = this.get('esraCommonService').pickListDlplTeamRole(value, "description");
    }
    else if (hash && Ember.isEqual(hash.type.toUpperCase(), "SIGNOFFSTATUSTYPE")) {
      value = this.get('esraCommonService').pickListSignOffStatusType(value, "description");
    }
    else if (hash && Ember.isEqual(hash.type.toUpperCase(), "SIGNOFFACTIVITYSTATUSTYPE")) {
      value = this.get('esraCommonService').pickListSignOffActivityStatusType(value, "description");
    }
    else if (hash && Ember.isEqual(hash.type.toUpperCase(), "SIGNOFFTYPE")) {
      value = this.get('esraCommonService').pickListSignOffType(value, "description");
    }
    else if (hash && Ember.isEqual(hash.type.toUpperCase(), "SIGNOFFREPEAT")) {
      value = this.get('esraCommonService').pickListSignOffRepeat(value, "description");
    }
    else if (hash && Ember.isEqual(hash.type.toUpperCase(), "DEALSTAGE")) {
      if (hash.businessArea && Ember.isEqual(hash.businessArea.toUpperCase(), "CF")) {
        value = this.get('esraCommonService').pickListDealStageCF(value, "description");
      }
      else if (hash.businessArea && Ember.isEqual(hash.businessArea.toUpperCase(), "CM")) {
        value = this.get('esraCommonService').pickListDealStageCM(value, "description");
      }

    }
    else if (hash && Ember.isEqual(hash.type.toUpperCase(), "ESRAAPPROVERS")) {
      value = value.getEach('name');
    }
    return value;
  },
  compute([value, ...rest], hash) {
    return (this.get('esraCommonService').isDefined(value)) ? this.picklistMapping(value, hash) : null;
  }
};
export default Ember.Helper.extend(pickListHelper);
