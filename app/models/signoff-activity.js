import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
    version: DS.attr('string'),
    roleDesc: DS.attr('string'),
    signoffReqReadonly: DS.attr('string'),
    signoffTaskReadonly: DS.attr('string'),
    saveEnabled: DS.attr('string'),
    createSignoffReqEnabled: DS.attr('string'),
    editSignoffReqEnabled: DS.attr('string'),
    deleteSignoffReqEnabled: DS.attr('string'),
    createSignoffTaskEnabled: DS.attr('string'),
    editSignoffTaskEnabled: DS.attr('string'),
    deleteSignoffTaskEnabled: DS.attr('string'),
    requirementStatusEnabled: DS.attr('string'),
    referToESRMEnabled: DS.attr('string'),
    approveEnabled: DS.attr('string'),
    referBackEnabled: DS.attr('string'),
    recallEnabled: DS.attr('string'),
    allSignoffReqCompleted: DS.attr('string'),
    IsDisableCreateSignoff: Ember.computed('createSignoffReqEnabled', {
        get() {
            return Ember.isEqual(this.get('createSignoffReqEnabled'),'V');
        }
    }),
    IsDisablecreateSignoffTask: Ember.computed('createSignoffTaskEnabled', {
        get() {
            return Ember.isEqual(this.get('createSignoffTaskEnabled'),'V');
        }
    }),
    IsDisableRequirementStatus: Ember.computed('requirementStatusEnabled', {
        get() {
            return Ember.isEqual(this.get('requirementStatusEnabled'),'V');
        }
    })

});
