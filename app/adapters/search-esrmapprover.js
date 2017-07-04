import DS from 'ember-data';

export default DS.RESTAdapter.extend({
    namespace: '/api/esra',
    pathForType: function () {
        return 'searchESRMApprovers';
    }
});
