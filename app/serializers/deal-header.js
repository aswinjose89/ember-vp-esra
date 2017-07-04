import DS from 'ember-data';
import Ember from 'ember';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    esraCommonService: Ember.inject.service(),
    actionTypeEvaluation(actionType) {
        return (actionType && Ember.isEqual(actionType, '0009')) ? "0008" : actionType;
    },
    attrs: {
        esraActivity: { embedded: 'always' },
        workflowAction: { embedded: 'always' },
        accessControl: { embedded: 'always' },
        esraApprovers: { embedded: 'always' }
    },
    serializeIntoHash: function (hash, type, snapshot) {
        let paramVal = this.get('esraCommonService').getParam(),
            workflowInput = Ember.Object.create({}),
            esraActivity = Ember.Object.create({
                id: snapshot.record.get('esraActivity').get('id'),
                status: snapshot.record.get('esraActivity').get('status'),
                outcome: snapshot.record.get('esraActivity').get('outcome'),
                version: snapshot.record.get('esraActivity').get('version')
            });
        /*TODO: Input has been hardcoded, It has been removed only started to integrate with API */
        //if (snapshot.adapterOptions.data) {
        workflowInput.setProperties({
            workflowAction: {
                id: paramVal.dealId,
                action: this.actionTypeEvaluation(snapshot.adapterOptions.actionType),
                escalatedBRRRC: Em.getWithDefault(snapshot.adapterOptions.data, 'escalatedBRRRC.value', null),
                approvalRoute: (this.get('esraCommonService').isDefined(snapshot.adapterOptions.data) && this.get('esraCommonService').isDefined(snapshot.adapterOptions.data.selectedItem)) ? Ember.get(snapshot.adapterOptions.data, 'selectedItem.value') : null,
                comments: (this.get('esraCommonService').isDefined(snapshot.adapterOptions.data)) ? Ember.get(snapshot.adapterOptions.data, 'comment') : null,
                assignee: (this.get('esraCommonService').isDefined(snapshot.adapterOptions.data)) ? Ember.get(snapshot.adapterOptions.data, 'assignees').map(val => {
                    return val.get('psId');
                }) : null,
                esraActivity
            }
        });
        // }
        // else {
        //     workflowInput.setProperties({});
        // }

        Ember.merge(hash, workflowInput);
    }
});
