import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    // esraCommonService: Ember.inject.service(),
    attrs: {
        esraActivity: { embedded: 'always' },
        followupTasks: { embedded: 'always' }
    }
    // ,
    // normalize(model, hash, prop) {
    //     let signoffId = this.get('esraCommonService').getSignoffId();
    //     if (signoffId && Ember.isEqual(signoffId.flag,'edit')) {
    //         hash.id = signoffId.id;
    //     }
    //     return this._super(...arguments);
    // }
});
