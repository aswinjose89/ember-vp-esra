import Ember from 'ember';

export default Ember.Controller.extend({
    init: function () {
        this._super.apply(this, arguments);
        this.set('name', this.namespace.get('name'));
        this.set('navLinks', []);
    }
});
