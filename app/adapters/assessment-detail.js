import DS from 'ember-data';

export default DS.RESTAdapter.extend({
    namespace: '/api/esra',
    serviceURL: null,

    ajax(url, type, options) {
        if (this.get('serviceURL')) {
            url += this.get('serviceURL');
        }
        return this._super(url, type, options);
    },
    urlForUpdateRecord(id, modelName, snapshot) {
        if (snapshot.adapterOptions && Ember.isEqual(snapshot.adapterOptions.actionType.toUpperCase(), 'REFRESH')) {
            return `${this.get('namespace')}/assessmentDetails/${id}/refresh`;
        }
        else if (snapshot.adapterOptions && Ember.isEqual(snapshot.adapterOptions.actionType.toUpperCase(), 'ASSESSMENTDETAIL')) {
            return `${this.get('namespace')}/assessmentDetails/${id}`;
        }
        else if (snapshot.adapterOptions && Ember.isEqual(snapshot.adapterOptions.actionType.toUpperCase(), 'ADDSECTOR')) {
            return `${this.get('namespace')}/assessmentDetails/${id}/addSector`;
        }
        else if (snapshot.adapterOptions && Ember.isEqual(snapshot.adapterOptions.actionType.toUpperCase(), 'DELETESECTOR')) {
            return `${this.get('namespace')}/assessmentDetails/${id}/deleteSector`;
        }
    }
});
