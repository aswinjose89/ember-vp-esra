import DS from 'ember-data';

export default DS.RESTAdapter.extend({
    namespace: '/api/esra'
    // urlForCreateRecord(modelName, snapshot) {
    //     if (Ember.isEqual(snapshot.adapterOptions.actionType, "create")) {
    //         return `${this.get('namespace') + '/' + 'signoffDetails' + '/' + snapshot.adapterOptions.paramVal.dealId
    //             + '/' + snapshot.adapterOptions.paramVal.version}`;
    //     }
    // },
    // urlForUpdateRecord(id, modelName, snapshot) {
    //     if (Ember.isEqual(snapshot.adapterOptions.actionType, "edit")) {
    //         return `${this.get('namespace') + '/' + 'signoffDetails' + '/' + snapshot.adapterOptions.paramVal.dealId
    //             + '/' + snapshot.adapterOptions.paramVal.version}`;
    //     }
    //     else if (Ember.isEqual(snapshot.adapterOptions.actionType, "delete")) {
    //         return `${this.get('namespace') + '/' + 'signoffDetails' + '/' + snapshot.adapterOptions.paramVal.dealId
    //             + '/' + snapshot.adapterOptions.paramVal.version}`;
    //     }
    // }
});
