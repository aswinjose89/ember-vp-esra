import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',
    store: Ember.inject.service('store'),
    esraService: Ember.inject.service('esra-common-service'),
    allSections: Ember.computed('model.fsSections.[]',function(){
        return this.get('model.fsSections');
        //return this.get('store').peekAll('fsSection');
    }),
    fsSections: Ember.computed('allSections.length', 'sections', 'model.fsFields.@each.opaObject.entityInstances.@each', function(){
        var instanceField, label;
        if(this.get('allSections')){
            this.set('tabs', Ember.A([]));
            this.get('allSections').forEach(section => {
                if(section.get('visible')){
                    if(section.get('layout') === 'tabs'){
                        instanceField = section.get('fsFields.firstObject');
                    }
                }
            });
            //instanceField = this.get('allSections').filterBy('layout', 'tabs');
            if(instanceField){
                instanceField.get('opaObject.entityInstances').forEach(item=>{
                    this.get('allSections').forEach(section => {
                        if(section.get('visible') && section.get('layout') === 'tab'){
                            label = (section.get('label').indexOf('|')> -1) ? section.get('label').split("|")[0] : section.get('label');
                            if(label === (item.instanceId.indexOf('|')> -1 ? item.instanceId.split("|")[0] : item.instanceId)){
                                this.get('tabs').pushObject(section);
                            }
                        }
                    });
                });
            }
        }
        return true;
    }),
    didRender(){
        this._super(...arguments);
        this.get('fsSections');
    },
    assessmentDraftSaveDisable: Ember.computed('esraService.dealAssessmentDetailsModel.assessmentDirtyCheck', 'esraService.dealAssessmentDetailsModel.fsData.fsFields.@each.hasDirtyAttributes', {
        get() {
            if (this.get('model.fsFields').filterBy('hasDirtyAttributes', true).length || !this.get('esraService').getProperty('dealAssessmentDetailsModel.assessmentDirtyCheck')) {
                this.get('esraService').set('disableSaveDraft', false);
                this.get('esraService').getProperty('dealAssessmentDetailsModel').set('saveDraftDisable', false);
            } else {
                this.get('esraService').set('disableSaveDraft', true);
                this.get('esraService').getProperty('dealAssessmentDetailsModel').set('saveDraftDisable', true);
            }
        }
    }),
    assessmentConsumerPayload: Ember.computed('esraService.dealAssessmentDetailsModel.fsData.fsForm.fsHeader.consumerPayload', {
        get() {
            this.get('esraService').setProperty('consumerPayload', this.get('esraService').getProperty('dealAssessmentDetailsModel').get('fsData.fsForm.fsHeader.consumerPayload'));
        }
    }),
    actions: {
        doRefresh(value) {
            this.sendAction('doRefresh', value);
        }
    }
});
