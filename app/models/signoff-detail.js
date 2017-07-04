import DS from 'ember-data';
import Ember from 'ember';

const {
    computed,
    inject,
} = Ember;

export default DS.Model.extend({
    esraCommonService: inject.service(), /*Service to embed the scope in 'this' keyword */
    esraPicklistService: inject.service(),
    requirements: DS.attr('string'),
    dueDate: DS.attr('number'),
    type: DS.attr('string'),
    status: DS.attr('string'),
    repeat: DS.attr('string'),
    signoffVersion: DS.attr('number'),
    signoffId: DS.attr('string',{ defaultValue: null }),
    deleted:DS.attr('boolean',{ defaultValue: false }),
    followupTasks: DS.hasMany('followupTask'),
    esraActivity: DS.belongsTo('esraActivity'),

    selectedStatus: computed('status', {
        get() {
            var esraPicklistService = this.get('esraPicklistService').getSignOffStatusTypes();
            var filteredStatus = (esraPicklistService && this.get('status') ? esraPicklistService : []).filterBy('code', this.get('status'));
            return (filteredStatus.length > 0) ? filteredStatus.get('firstObject') : this.get('status');
        }
    })
});
