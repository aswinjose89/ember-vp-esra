import Ember from 'ember';
import detailConfig from '../utils/detail-config';
import Constants from '../utils/esra-constant';
import ModelProgressIndicator from 'wb-ui-core/mixins/model-progress-indicator';
import esraMixin from '../mixins/wb-esra-mixin';

const {
    Component,
    inject,
    computed
} = Ember;


const wbEsraHeaderComponent = Component.extend(ModelProgressIndicator, esraMixin, {
    isButtonDisable: false,
    record: Ember.Object.create({}),
    tagName: '',
    headerMenuActionConfig: detailConfig().get('headerMenuActionConfig'),
    actionMenuDealHeader: detailConfig().get('actionMenuDealHeader'),
    esraCommonService: inject.service(),
    routing: inject.service('-routing'),
    store: inject.service(),
    signoffActivity: computed('routing.currentRouteName', {
        get() {
            let currentRouteName = this.get('routing.currentRouteName').split('.').pop();
            if (Ember.isEqual(currentRouteName, 'signoffReq')) {
                let signoffActivity = this.get('esraCommonService').getSignoffActivity();
                return signoffActivity;
            }
        }
    }),
    firstObjDealTeamLeader: computed('model.dealTeamLeader', {
        get() {
            var dealTeamLeader = this.get('model.dealTeamLeader');
            return (this.get('esraCommonService').isDefined(dealTeamLeader)) ?
                dealTeamLeader[0].userId + ' - ' + dealTeamLeader[0].name : null;
        }
    }),
    dealTeamLeader: computed('model.dealTeamLeader', {
        get() {
            var dealTeamLeader = this.get('model.dealTeamLeader');
            if (this.get('esraCommonService').isDefined(dealTeamLeader)) {
                var mappedDeal = dealTeamLeader.map(val => {
                    return val.userId + ' - ' + val.name;
                });
                return mappedDeal;
            }
            return null;
        }
    }),
    disableDownload: computed('model.esraActivity.status', 'esraCommonService.dealAssessmentDetailsModel.saveDraftDisable', {
        get() {
            this.get('headerMenuActionConfig.items').setEach('config.isDisabled', !Ember.isPresent(this.get('model.esraActivity.status')));
            if (Ember.isEqual(this.get('esraCommonService.dealAssessmentDetailsModel.saveDraftDisable'), false)) {
                this.get('headerMenuActionConfig.items').findBy('code', 'download').set('config.isDisabled', true);
            }
        }
    }),
    headerDraftSaveDisable: computed('esraCommonService.disableSaveDraft', {
        get() {
            return this.get('esraCommonService').get('disableSaveDraft');
        }
    }),
    menuCount: 3,
    actions: {
        deleteAction() {
            let config = detailConfig().get('deleteESRA');
            this.get('esraCommonService').modalPopUpManager.call(this, config);
        },
        deleteESRA_trans() {
            var st = this.get('store'),
                params = this.get('esraCommonService').getParam(),
                record = this.get('esraCommonService').peekEsraActivity(),
                assessAdapter = st.adapterFor('esraActivity');
            assessAdapter.set('serviceURL', `${assessAdapter.get("namespace")}/esraActivities?dealId=${params.dealId}&version=${params.version}`);
            record.deleteRecord();
            this.showLoadingIndicator();
            record.save().then(value => {
                Ember.Logger.log(value);
                let config = detailConfig().get('deleteESRASuccess');
                this.hideLoadingIndicator();
                this.get('esraCommonService').setProperty('ESRADeleted', true);
                this.get('esraCommonService').modalPopUpAlertManager.call(this, config);
            });
        },
        deleteESRASuccess_trans() {
            this.sendAction('goBack');
        },
        saveAction() {
            this.send('workflowAction', 'SAVE');
        },
        saveDraft() {
            let currentRouteName = this.get('routing.currentRouteName').split('.').pop();
            if (Ember.isEqual(currentRouteName, 'assessment')) {
                this.set('ESRAHEADER.SAVEDRAFTTRIGGER', true);
            }
            this.sendAction('saveDraft');
        },
        showToolTip(data) {
            if (Ember.isArray(data)) {
                data = data.map(x => {
                    return `<li>${x}</li>`;
                }).join('');
            }
            this.mdTooltipManager.open({
                label: Ember.String.htmlSafe(`<ul>${data}</ul>`),
                shownOnOverflow: true,
            });
        },
        hideToolTip() {
            this.mdTooltipManager.close();
        },
        /**
        * [workflowAction This service to validate mandatory field and show error pop up for detail and assessment]
        * @param  {[type]} message  [description]
        * @param  {[type]} position [description]
        * @return {[type]}          [description]
        */
        workflowAction() {
            let [argument] = arguments, config, esraCommonService = this.get('esraCommonService');
            let action = (Ember.isEqual(Ember.typeOf(argument), "instance")) ?
                argument.get('actionParam')
                : argument,
                paramVal = JSON.parse(JSON.stringify(esraCommonService.getParam())),
                dealDetailModel = this.get('store').peekRecord("dealDetail", esraCommonService.getParam().dealId),
                assessmentDetailModel = this.get('store').peekRecord('assessmentDetail', esraCommonService.getParam().dealId),
                assessAdapter;

            config = detailConfig().get(action.concat("PopUpConfig"));
            if (config) {
                config.esraActivity = this.model.get('esraActivity');
                config.esraApprovers = this.model.get('esraApprovers');
            }
            paramVal.enableValidation = true;

            if (action && (Em.isEqual(action.toUpperCase(), 'SUBMIT') || Em.isEqual(action, 'SAVE'))) {
                if (Em.isPresent(dealDetailModel) && !Em.isPresent(dealDetailModel.get('description'))) {
                    let errorConfig = detailConfig().get('detailErrorValidation');
                    esraCommonService.modalPopUpAlertManager.call(this, errorConfig);
                }
                else {
                    let currentRouteName = this.get('routing.currentRouteName').split('.').pop();
                    assessAdapter = this.get('store').adapterFor('assessmentDetail');
                    assessAdapter.set('serviceURL', null);
                    if (Ember.isEqual(currentRouteName, 'assessment')) {
                        this.showLoadingIndicator();
                        if (Em.isEqual(action, 'SAVE')) {
                            this.set('ESRAHEADER.SAVETRIGGER', true);
                        }
                        else {
                            this.set('ESRAHEADER.SUBMITTRIGGER', true);
                        }
                        assessmentDetailModel.save({ adapterOptions: { actionType: 'ASSESSMENTDETAIL' } }).then((success) => {
                            if (success) {
                                this.send('assessmentValidationCheck', paramVal, esraCommonService, config, action);
                            }
                        });
                    }
                    else {
                        this.send('assessmentValidationCheck', paramVal, esraCommonService, config, action);
                    }
                }
            }
            else {
                switch (action) {
                    case 'approve':
                        config.message = Em.isEqual(Em.getWithDefault(config.esraActivity, 'userRole', null), '0005') ? Constants.messages.esrmApprovalMsg : config.message;
                        break;
                }
                esraCommonService.popUp.call(this, config, esraCommonService.filterFirstArray(action, "desc", "code"));
            }

        },
        assessmentValidationCheck(paramVal, esraCommonService, config, action) {
            this.get('store').queryRecord('assessmentDetail', paramVal).then((data) => {
                this.hideLoadingIndicator();
                if (Em.isPresent(data.get('fsData'))) {
                    let sectionErrorFlag = data.get('fsData.fsSections').filter(x => (x.get('layout') === "tab" || x.get('layout') === "vertical") && x.get('visible') === true).any(field => {
                        return field.get('fsFields').any(error => (error.get('error')) ? true : false);
                    });
                    if (Em.isEqual(sectionErrorFlag, true)) {
                        this.get('esraCommonService').setProperty('isEnableValidation', true);
                        let currentRouteName = this.get('routing.currentRouteName').split('.').pop();
                        if (Ember.isEqual(currentRouteName, 'details') || Ember.isEqual(currentRouteName, 'assessment')) {
                            let config = detailConfig().get('errorValidation');
                            config.currentPath = currentRouteName;
                            esraCommonService.modalPopUpManager.call(this, config, config.currentPath);
                        }
                    }
                    else {
                        if (Em.isEqual(action.toUpperCase(), 'SAVE')) {
                            this.sendAction('saveDraft');
                        }
                        else {
                            esraCommonService.popUp.call(this, config, esraCommonService.filterFirstArray(action, "desc", "code"));
                        }
                    }
                }
            });
        },
        workflowAlert() {
            let [actionType] = arguments,
                headerDataJSON = this.get("esraCommonService").getPopUpParam(),
                esraActivity = this.model.get('esraActivity');
            if (Em.isEqual(esraActivity.get('outcome'), '0002') && Em.isEqual(headerDataJSON.get('selectedItem.value'), "0002")) {
                const config = detailConfig().get('workflowAlertConfig'),
                    modalPopUpManager = this.get('esraCommonService').modalPopUpManager;
                modalPopUpManager.call(this, config, actionType);
            }
            else {
                this.send('workflowActionService', actionType);
            }
        },
        /**
        * [workflowActionService description]
        * @param  {[type]} message  [description]
        * @param  {[type]} position [description]
        * @return {[type]}          [description]
        */
        workflowActionService() {
            let [actionType] = arguments,
                headerDataJSON = this.get("esraCommonService").getPopUpParam(),
                params = this.get('esraCommonService').getParam(),
                currentRouteName = this.get('routing.currentRouteName').split('.').pop(),
                store = this.get('store'),
                assessAdapter;
            this.showLoadingIndicator();

            if (Ember.isEqual(actionType, '0001')) {
                if (Ember.isEqual(currentRouteName, 'details')) {
                    this.set('record', store.peekAll("dealDetail"));
                }
                else if (Ember.isEqual(currentRouteName, 'assessment')) {
                    this.set('record', store.peekRecord('assessmentDetail', params.dealId));
                    assessAdapter = store.adapterFor('assessmentDetail');
                    assessAdapter.set('serviceURL', null);
                }
                else if (Ember.isEqual(currentRouteName, 'workflowHistory')) {
                    this.send('workflowActionAPI', actionType, headerDataJSON);
                    return;
                }
                this.get('record').save({ adapterOptions: { actionType: 'ASSESSMENTDETAIL' } }).then((success) => {
                    if (success) {
                        this.send('workflowActionAPI', actionType, headerDataJSON);
                    }
                }, (error) => {
                    Ember.Logger.log("Error in saveDraft Action:", error);
                });
            }
            else {
                this.send('workflowActionAPI', actionType, headerDataJSON);
            }
        },
        /**
       * [workflowActionAPI description]
       * @param  {[type]} message  [description]
       * @param  {[type]} position [description]
       * @return {[type]}          [description]
       */
        workflowActionAPI() {
            let [actionType, headerDataJSON] = arguments;
            this.model.save({
                adapterOptions: {
                    actionType: actionType,
                    data: headerDataJSON,
                    actionName: 'workflowAction'
                }
            }).then(() => {
                this.hideLoadingIndicator();
                let workflowData = this.get('store').peekAll('workflowAction').findBy('status');
                if (this.get('esraCommonService').isDefined(workflowData)) {
                    this.get('esraCommonService').setProperty('isEnableValidation', workflowData.get('showValidationError'));
                    if (Ember.isEqual(workflowData.get('status'), "success")) {
                        let status = this.model.get("esraActivity.statusDesc");
                        this.model.setProperties({
                            navConfig: this.get('esraCommonService').getNavConfig(this.model.get("esraActivity")),
                            esraActivityStatus: this.get("esraCommonService").statusActivity(status,this.model.get("esraActivity"))
                        });
                        this.get("esraCommonService").workflowHistory(workflowData.get('esraActivity.workflowHistoryEnabled'));
                        this.get('esraCommonService').workflowActionPopUp.call(this, workflowData);
                    }
                    // else if (Ember.isEqual(workflowData.get('status'), "error") && workflowData.get('showValidationError')) {
                    //     let currentRouteName = this.get('routing.currentRouteName').split('.').pop();
                    //     if (Ember.isEqual(currentRouteName, 'details') || Ember.isEqual(currentRouteName, 'assessment')) {
                    //         let config = detailConfig().get('errorValidation');
                    //         config.currentPath = currentRouteName;
                    //         this.get('esraCommonService').modalPopUpManager.call(this, config, config.currentPath);
                    //     }
                    // }
                }

            }, (error) => {
                Ember.Logger.log("Error in dealHeader Action:", error);
            });
        },
        /**
       * [routeNavigation using getAssessment Action for assessment to get errors validated by OPA]
       * @param  {[type]} message  [description]
       * @param  {[type]} position [description]
       * @return {[type]}          [description]
       */
        routeNavigation() {
            let [currentRouteName] = arguments;
            this.get('esraCommonService').getStatusActivity(currentRouteName, 'ASSESSMENT_ERROR_NAV');
        },
        /**
        * [goBack description]
        * @param  {[type]} message  [description]
        * @param  {[type]} position [description]
        * @return {[type]}          [description]
        */
        goBack() {
            this.sendAction('goBack');
        },
        /**
        * [openAuditTrail description]
        * @param  {[type]} message  [description]
        * @param  {[type]} position [description]
        * @return {[type]}          [description]
        */
        openAuditTrail() {
            this.sendAction('openAuditTrail');
        },
        /**
        * [errorRouteHandler description]
        * @param  {[type]} message  [description]
        * @param  {[type]} position [description]
        * @return {[type]}          [description]
        */
        errorRouteHandler() {
            let currentRouteName = this.get('routing.currentRouteName').split('.').pop();
            if (Ember.isEqual(currentRouteName, 'assessment')) {
                return false;
            }
            else {
                this.send('routeNavigation', this.get('routing.currentRouteName'));
            }
        },
        /**
        * [fireAssessmentCall description]
        * @param  {[type]} message  [description]
        * @param  {[type]} position [description]
        * @return {[type]}          [description]
        */
        fireAssessmentCall() {
            let currentRouteName = this.get('routing.currentRouteName').split('.').pop();
            if (Ember.isEqual(currentRouteName, 'assessment')) {
                this.sendAction('getAssessment');
            }
            else {
                this.get('esraCommonService').getStatusActivity(this.get('routing.currentRouteName'));
            }
            return true;
        },
        /**
        * [downloadPDF description]
        * @param  {[type]} message  [description]
        * @param  {[type]} position [description]
        * @return {[type]}          [description]
        */
        downloadPDF() {
            let param = this.get('esraCommonService').getParam();
            Ember.Logger.log(param);
            let url = `api/esra/esraPDF`;
            let form = $('form.esraFileDownloadForm');
            form.append($('<input>', {
                type: 'hidden',
                name: 'dealId',
                value: param.dealId
            }));
            form.append($('<input>', {
                type: 'hidden',
                name: 'version',
                value: param.version
            }));
            form.append($('<input>', {
                type: 'hidden',
                name: 'WB-TOKEN',
                value: this.get('session.secure.wbToken')
            }));
            form.attr('action', url);
            form.submit();
            form.contents().remove();
        }
    }
});
export default wbEsraHeaderComponent;
