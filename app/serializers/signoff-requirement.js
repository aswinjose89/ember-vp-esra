import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    esraCommonService: Ember.inject.service(),
    attrs: {
        details: { embedded: 'always' },
        signoffActivity: { embedded: 'always' }

    },
    normalizeQueryRecordResponse(store, primaryModelClass, payload) {
        this.get('esraCommonService').peekEsraActivity().set('allSignoffReqCompleted', payload.signoffRequirement.signoffActivity.allSignoffReqCompleted);
        return this._super(...arguments);
    }
});
