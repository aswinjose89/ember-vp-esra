import Ember from 'ember';
import detailConfig from '../utils/detail-config';

export default Ember.Helper.extend({
  compute([value, ...rest], hash) {
    if (hash.model.get('esraActivity.readOnly')) {
      if (Ember.isEqual(hash.type, 'table')) {
        value['rowActions'] = false;
      }
      if (Ember.isEqual(hash.type, 'button')) {
        return true;
      }
  } else if (Ember.isEqual(hash.tableName, 'attachment')) {
      value.rowActions = detailConfig().get('esraDetailAtmntRowActions')
  }
    return value;
  }
});
