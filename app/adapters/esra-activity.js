import DS from 'ember-data';

export default DS.RESTAdapter.extend({
    namespace: '/api/esra',
    ajax (url, type, options) {
        if(this.get('serviceURL')){
            url = this.get('serviceURL');
        }
        return this._super(url, type, options);
    }
});
