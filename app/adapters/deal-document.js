import DS from 'ember-data';
import Ember from 'ember';

export default DS.RESTAdapter.extend({
    namespace: 'api/dealcentre/workspace',
   	pathForType: function () {
   		let cUrl = Ember.isEmpty(this.get('customUrl')) ? '' : '/' + this.get('customUrl');
        return 'document' + cUrl;
    }
});
