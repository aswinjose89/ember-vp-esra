import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    tagName:'',
    workflowHistoryDtls: Ember.computed('workflowHistoryDts.workflowDetail', {
        get() {
            let workflowHistoryDtls = this.get('workflowHistoryDts.workflowDetail');
            return workflowHistoryDtls;
        }
    })
});
