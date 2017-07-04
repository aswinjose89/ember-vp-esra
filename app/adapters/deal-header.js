import DS from 'ember-data';
import Ember from 'ember';

export default DS.RESTAdapter.extend({
    namespace: '/api/esra',
    urlForUpdateRecord(id, modelName, snapshot) {
        return (Ember.isEqual(snapshot.adapterOptions.actionName, "workflowAction")) ?
            this.get('namespace') + '/workflowAction' : this.get('namespace');
    }
});
