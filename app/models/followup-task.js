import DS from 'ember-data';

export default DS.Model.extend({
    esraCommonService: Em.inject.service(),
    actionRequired: DS.attr('string'),
    dueDate: DS.attr('number'),
    repeat: DS.attr('string'),
    endRepeat: DS.attr('number'),
    assignedBy: DS.attr('string'),
    createdBy: DS.attr('string'),
    assignedDate: DS.attr('number'),
    taskStatus: DS.attr('string'),
    completedDate: DS.attr('string'),
    completedBy: DS.attr('string'),
    completionComments: DS.attr('string'),
    confirmedByEsrm: DS.attr('string'),
    documents: DS.attr('arrayTransform'),
    deleted: DS.attr('boolean', { defaultValue: false }),
    calendarTaskId: DS.attr('string'),
    esraApprovers: DS.attr('arrayTransform'),
    assignees: DS.hasMany('searchDealTeamMember'),

    aoCompletionComments: DS.attr('string'),
    aoCompletedBy: DS.attr('string'),
    referredToEsrmComments: DS.attr('string'),
    referredToEsrmBy: DS.attr('string'),
    referredToEsrmDate: DS.attr('number'),
    esrmApprovedComments: DS.attr('string'),
    esrmApprovedDate: DS.attr('number'),
    esrmApprovedBy: DS.attr('string'),
    emailReminderEnabled:DS.attr('string'),
    emailReminderDate: DS.attr('number'),
    completionDtl: Em.computed('completedDate', 'completedBy', {
        get() {
            return Em.A([`${this.get('esraCommonService').dateFormat(this.get('completedDate'), 'DD MMM YYYY')}`, `${this.get('completedBy')}`]);
        }
    }),

    referToESRM_Dtl: Em.computed('referredToEsrmDate', 'referredToEsrmBy', {
        get() {
            return Em.A([`${this.get('esraCommonService').dateFormat(this.get('referredToEsrmDate'), 'DD MMM YYYY')}`, `${this.get('referredToEsrmBy')}`]);
        }
    }),

    esrmApprovedDtl: Em.computed('esrmApprovedDate', 'esrmApprovedBy', {
        get() {
            return Em.A([`${this.get('esraCommonService').dateFormat(this.get('esrmApprovedDate'), 'DD MMM YYYY')}`, `${this.get('esrmApprovedBy')}`]);
        }
    }),
    disableTaskToggleIcon: Ember.computed('aoCompletionComments', 'referredToEsrmComments', 'esrmApprovedComments', 'documents', {
        get() {
            // the code should be enabled based on the requirement in future
            // if (this.get('aoCompletionComments') || this.get('referredToEsrmComments') || this.get('esrmApprovedComments') || (this.get('documents') && this.get('documents.length'))) {
            //     return false;
            // } else {
            //     return true;
            // }
            return false;
        }
    })
});
