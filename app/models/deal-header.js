import Ember from 'ember';
import DS from 'ember-data';
import EmberValidations from 'ember-validations';

export default DS.Model.extend(EmberValidations, {
    esraCommonService: Ember.inject.service(),
    dealRefId: DS.attr('string'),
    dealValue: DS.attr('string'),
    clientName: DS.attr('string'),
    productType: DS.attr(),
    dealTeamLeader: DS.attr(),
    dealCloseDate: DS.attr('string'),
    clientId: DS.attr('string'),
    domicileCountry: DS.attr('string'),
    dealExecutionCountry: DS.attr('string'),
    subProductType: DS.attr(),
    pfam: DS.attr('array-transform'),
    submittedBy: DS.attr('string'),
    approvedBy: DS.attr('string'),
    dealStage: DS.attr('string'),
    probability: DS.attr('string'),
    businessArea: DS.attr('string'),
    esraActivity: DS.belongsTo('esraActivity'),
    workflowAction: DS.belongsTo('workflowAction'),
    accessControl: DS.belongsTo('accessControl'),
    esraApprovers: DS.hasMany('searchEsrmapprover'),
    dealName: DS.attr('string'),
    entityTags: DS.attr('string'),
    dealCloseDateFormat: Ember.computed('dealCloseDate', {
        get() {
            return `${this.get('esraCommonService').dateFormat(this.get('dealCloseDate'), 'DD MMM YYYY')}`;
        }
    }),
    escalatedBRRRC: DS.attr('string'),
    approvalRoute: DS.attr('string'),
    escalatedBRRRCFormatted: Ember.computed('escalatedBRRRC', {
        get() {
            let escalatedBRRC = this.get('escalatedBRRRC') ? this.get('escalatedBRRRC').toLowerCase() : '-';
            if (escalatedBRRC === 'y') {
                return 'Yes';
            } else if (escalatedBRRC === 'n') {
                return 'No';
            } else {
                return '-';
            }
        }
    })
});
