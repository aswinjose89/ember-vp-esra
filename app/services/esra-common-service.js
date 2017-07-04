import Ember from 'ember';
import Constants from '../utils/esra-constant';
import detailConfig from '../utils/detail-config';
const {inject} = Ember;

export default Ember.Service.extend({
    store: inject.service(),
    routing: inject.service('-routing'),
    esraPicklistService: inject.service(),
    picklistService: inject.service(),
    wbAjax: inject.service(),
    paramValue: null,
    signoffparamValue: null,
    docIdVal: null,
    paramDetails: null,
    signoffReq: null,
    signoffId: null,
    baParam: null,
    signoffActivity: null,
    isEnableValidation: false,
    disableSaveDraft: true,
    ESRADeleted: false,
    followupTskUploadAttachmentList: Ember.A([]),
    wbUserProfile: inject.service(),
    getAttachmentCategoryList() {
        if (!this.get('attachmentCategoryList')) {
            let attachmentCategoryList = [];
            this.get('picklistService').getDcDealDocumentCategoryFilters().toArray().forEach(item => {
                attachmentCategoryList.push({
                    id: item.get('id'),
                    categoryType: item.get('code'),
                    description: item.get('description')
                });
            });
            this.set('attachmentCategoryList', attachmentCategoryList);
        }
        return this.get('attachmentCategoryList');
    },
    setProperty(property, value) {
        this.set(property, value);
    },
    getProperty(property) {
        return this.get(property);
    },
    setParam: function (paramValue) {
        this.set('param', paramValue);
    },
    getParam: function () {
        return this.get('param');
    },
    setDetails: function (paramDetails) {
        this.set('paramDetails', paramDetails);
    },
    getDetails: function () {
        return this.get('paramDetails');
    },
    setDocId: function (docIdVal) {
        this.set('docIdVal', docIdVal);
    },
    getDocId: function () {
        return this.get('docIdVal');
    },
    setPopUpParam: function (signoffparamValue) {
        this.set('popUpParam', signoffparamValue);
    },
    getPopUpParam: function () {
        return this.get('popUpParam');
    },
    setSignoffPopUpParam: function (paramValue) {
        this.set('popUpParam', paramValue);
    },
    getSignoffPopUpParam: function () {
        return this.get('popUpParam');
    },
    setBusinessArea: function (baParamValue) {
        this.set('baParam', baParamValue);
    },
    getBusinessArea: function () {
        return this.get('baParam');
    },
    setSignoffReq: function (signoffReq) {
        this.set('signoffReq', signoffReq);
    },
    getSignoffReq: function () {
        return this.get('signoffReq');
    },
    setSignoffId: function (signoffId) {
        this.set('signoffId', signoffId);
    },
    getSignoffId: function () {
        return this.get('signoffId');
    },
    setSignoffActivity: function (signoffActivity) {
        this.set('signoffActivity', signoffActivity);
    },
    getSignoffActivity: function () {
        return this.get('signoffActivity');
    },
    exception(routeName, error) {
        if (error) {
            Ember.Logger.debug(`Error Route Name #${routeName}#: ${error}`);
        }
    },
    /**
     * [statusColor description]
     * @param  {[type]} message  [description]
     * @param  {[type]} position [description]
     * @return {[type]}          [description]
     */
    statusColor(colorCode) {
        const picklistObj = this.get('esraPicklistService').getStatusTypes();
        return this.colorMapping(picklistObj, colorCode);
    },
    /**
     * [outComeColor description]
     * @param  {[type]} message  [description]
     * @param  {[type]} position [description]
     * @return {[type]}          [description]
     */
    outComeColor(colorCode) {
        const picklistObj = this.get('esraPicklistService').getOutcomeTypes();
        return this.colorMapping(picklistObj, colorCode);
    },
    /**
     * [actionColor description]
     * @param  {[type]} message  [description]
     * @param  {[type]} position [description]
     * @return {[type]}          [description]
     */
    actionColor(colorCode) {
        const picklistObj = this.get('esraPicklistService').getActionTypes();
        return this.colorMapping(picklistObj, colorCode);
    },
    /**
     * [colorMapping description]
     * @param  {[type]} message  [description]
     * @param  {[type]} position [description]
     * @return {[type]}          [description]
     */
    colorMapping(picklistObj, colorCode) {
        if (picklistObj && colorCode && picklistObj.findBy('code', colorCode)) {
            return picklistObj.findBy('code', colorCode).get("param1");
        }
        return null;
    },
    /**
     * [statusDesc description]
     * @param  {[type]} message  [description]
     * @param  {[type]} position [description]
     * @return {[type]}          [description]
     */
    statusDesc(descCode, desc) {
        const picklistObj = this.get('esraPicklistService').getStatusTypes();
        return this.descMapping(picklistObj, descCode, (desc) ? desc : "description");
    },
    /**
     * [outComeDesc description]
     * @param  {[type]} message  [description]
     * @param  {[type]} position [description]
     * @return {[type]}          [description]
     */
    outComeDesc(descCode, desc) {
        const picklistObj = this.get('esraPicklistService').getOutcomeTypes();
        return this.descMapping(picklistObj, descCode, (desc) ? desc : "description");
    },
    /**
     * [descMapping description]
     * @param  {[type]} message  [description]
     * @param  {[type]} position [description]
     * @return {[type]}          [description]
     */
    descMapping(picklistObj, descCode, desc) {
        if (picklistObj && descCode && picklistObj.findBy('code', descCode)) {
            let description = picklistObj.findBy('code', descCode).get(desc);
            return (!Ember.isNone(description)) ? description : "No Description Found";
        }
        return "-";

    },
    randomNum() {
        return Ember.uuid();
    },
    modalPopUpManager(config, param = true) {
        this.mdDialogManager.confirm(config).then(() => {
            if (config.externalFn) {
                this.send(config.actionHandler, param);
            }
        }).catch((cancel) => {
            if (config.cancelActionHandler) {
                this.send(config.cancelActionHandler, param);
            }
        });
    },
    modalPopUpAlertManager(config, param = true) {
        this.mdDialogManager.alert(config).then(() => {
            if (config.externalFn) {
                this.send(config.actionHandler, param);
            }
            return false;
        });
    },
    popUp() {
        let [config, param = true] = arguments;
        if (config) {
            config.componentName = 'wb-esra-popup';
            config.model = this.get('model'),
                this.mdDialogManager.popup(config).then(() => {
                    if (config.popupActions) {
                        this.send(config.popupActions, param, arguments);
                    }
                }, () => {
                    Ember.Logger.log("failure");
                    return;
                });
        } else {
            return {};
        }
    },
    popOverPopup(config, param = true) {
        if (config) {
            config.componentName = 'wb-esra-popover-popup';
            this.mdDialogManager.popup(config).then(() => {
                if (config.popupActions) {
                    this.send(config.popupActions, param);
                }
            }, () => {
                Ember.Logger.log("failure");
                return;
            });
        }
        else {
            return {};
        }
    },
    statusActivity(param, esraActivity) {
        if (param && esraActivity) {
            const statusFlag = !(Ember.isEqual(param.toUpperCase(), "COMPLETED") &&
                Ember.isEqual(Em.getWithDefault(esraActivity, 'persistedApprovalRoute', null), "0002") &&
                Ember.isEqual(Em.getWithDefault(esraActivity, 'persistedDecision', null), "0001"));
            this.set('activityStatus', statusFlag);
            return statusFlag;
        }
        return null;

    },
    workflowHistory(value) {
        this.set('workflowHistoryEnabled', value);
    },
    disableRouteList: ["signoffReq", "workflowHistory"],
    getStatusActivity(routeName, flag) {
        let currentRouteName = routeName.split('.').pop();
        if (Em.isEqual(flag, 'ASSESSMENT_ERROR_NAV') && Em.isEqual(currentRouteName, 'details')) {
            this.get('routing').transitionTo(Constants.routeObjects.get('assessment'));
        }
        else if (routeName && this.get('activityStatus') &&
            this.disableRouteList.includes(routeName.split('.').pop(-1))) {
            this.get('routing').transitionTo(routeName.split('.').slice(0, -1).join('.') + '.details');
        }
    },
    getWorkflowHistory(routeName) {
        if (routeName && !this.get('workflowHistoryEnabled') && this.disableRouteList.includes(routeName.split('.').pop(-1))) {
            this.get('routing').transitionTo(routeName.split('.').slice(0, -1).join('.') + '.details');
        }
    },
    getNavConfig(esraActivity) {
        Constants.templates.navConfig.additionalInfo[0].componentConfig.setProperties({
            label: esraActivity.get('statusDesc'),
            color: esraActivity.get('statusColor')
        });
        Constants.templates.navConfig.additionalInfo[1].componentConfig.setProperties({
            label: esraActivity.get('outcomeDesc'),
            color: esraActivity.get('outcomeColor')
        });

        return Constants.templates.navConfig;
    },
    /**
     * [DpProductType description]
     * @param  {[type]} message  [description]
     * @param  {[type]} position [description]
     * @return {[type]}          [description]
     */
    pickListDpProductType(code, desc) {
        const picklistObj = this.get('picklistService').getDpProductTypes();
        return this.descMapping(picklistObj, code, (desc) ? desc : "description");
    },
    /**
    * [SubProductType description]
    * @param  {[type]} message  [description]
    * @param  {[type]} position [description]
    * @return {[type]}          [description]
    */
    pickListSubProductType(code, desc) {
        const picklistObj = this.get('picklistService').getSubProductTypes();
        return this.descMapping(picklistObj, code, (desc) ? desc : "description");
    },
    /**
     * [ActionType From ESRA Picklist]
     * @param  {[type]} message  [description]
     * @param  {[type]} position [description]
     * @return {[type]}          [description]
     */
    pickListActionType(code, desc) {
        const picklistObj = this.get('esraPicklistService').getActionTypes();
        return this.descMapping(picklistObj, code, (desc) ? desc : "description");
    },
    /**
     * [StatusType From ESRA Picklist]
     * @param  {[type]} message  [description]
     * @param  {[type]} position [description]
     * @return {[type]}          [description]
     */
    pickListStatusType(code, desc) {
        const picklistObj = this.get('esraPicklistService').getStatusTypes();
        return this.descMapping(picklistObj, code, (desc) ? desc : "description");

    },
    /**
     * [DlplAccess From ESRA Picklist]
     * @param  {[type]} message  [description]
     * @param  {[type]} position [description]
     * @return {[type]}          [description]
     */
    pickListDlplAccess(code, desc) {
        const picklistObj = this.get('esraPicklistService').getDlplAccesses();
        return this.descMapping(picklistObj, code, (desc) ? desc : "description");

    },
    /**
     * [DlplTeamRole From ESRA Picklist]
     * @param  {[type]} message  [description]
     * @param  {[type]} position [description]
     * @return {[type]}          [description]
     */
    pickListDlplTeamRole(code, desc) {
        const picklistObj = this.get('esraPicklistService').getDlplTeamRoles();
        return this.descMapping(picklistObj, code, (desc) ? desc : "description");

    },
    /**
     * [DealCountries description]
     * @param  {[type]} message  [description]
     * @param  {[type]} position [description]
     * @return {[type]}          [description]
     */
    getDealCountries(code, desc) {
        const picklistObj = this.get('picklistService').getDealCountries();
        return this.descMapping(picklistObj, code, (desc) ? desc : "description");
    },
    /**
     * [pickListSignOffStatusType From ESRA Picklist]
     * @param  {[type]} message  [description]
     * @param  {[type]} position [description]
     * @return {[type]}          [description]
     */
    pickListSignOffStatusType(code, desc) {
        const picklistObj = this.get('esraPicklistService').getSignOffStatusTypes();
        return this.descMapping(picklistObj, code, (desc) ? desc : "description");

    },
    /**
     * [pickListSignOffActivityStatusType From ESRA Picklist]
     * @param  {[type]} message  [description]
     * @param  {[type]} position [description]
     * @return {[type]}          [description]
     */
    pickListSignOffActivityStatusType(code, desc) {
        const picklistObj = this.get('esraPicklistService').getSignOffActivityStatusTypes();
        return this.descMapping(picklistObj, code, (desc) ? desc : "description");

    },
    /**
     * [pickListSignOffType From ESRA Picklist]
     * @param  {[type]} message  [description]
     * @param  {[type]} position [description]
     * @return {[type]}          [description]
     */
    pickListSignOffType(code, desc) {
        const picklistObj = this.get('esraPicklistService').getSignOffTypes();
        return this.descMapping(picklistObj, code, (desc) ? desc : "description");

    },
    /**
     * [pickListSignOffRepeat From ESRA Picklist]
     * @param  {[type]} message  [description]
     * @param  {[type]} position [description]
     * @return {[type]}          [description]
     */
    pickListSignOffRepeat(code, desc) {
        const picklistObj = this.get('esraPicklistService').getSignOffRepeats();
        return this.descMapping(picklistObj, code, (desc) ? desc : "description");

    },
    /**
     * [pickListDealStageCF From ESRA Picklist]
     * @param  {[type]} message  [description]
     * @param  {[type]} position [description]
     * @return {[type]}          [description]
     */
    pickListDealStageCF(code, desc) {
        const picklistObj = this.get('picklistService').getDealStageCFs();
        return this.descMapping(picklistObj, code, (desc) ? desc : "description");

    },
    /**
     * [pickListDealStageCM From ESRA Picklist]
     * @param  {[type]} message  [description]
     * @param  {[type]} position [description]
     * @return {[type]}          [description]
     */
    pickListDealStageCM(code, desc) {
        const picklistObj = this.get('picklistService').getDealStageCMs();
        return this.descMapping(picklistObj, code, (desc) ? desc : "description");

    },
    isDefined(value) {
        if (Ember.isPresent(value)) {
            return true;
        }
        else {
            Ember.Logger.debug("No Value Found From DB For This Property for the model ", this.routeName);
            return false;
        }
    },
    /**
     * [filterFirstArray description]
     * @param  {[type]} message  [description]
     * @param  {[type]} position [description]
     * @return {[type]}          [description]
     */
    filterFirstArray(value, insideFilter, outsideFilter) {
        return Constants.accessControlCode.filter(x => x[insideFilter] === value).pop()[outsideFilter];
    },
    /**
     * [workflowActionPopUp description]
     * @param  {[type]} message  [description]
     * @param  {[type]} position [description]
     * @return {[type]}          [description]
     */
    workflowActionPopUp(workflowData) {
        const config = detailConfig().get('commonAlertConfig'),
            modalPopUpAlertManager = this.get('esraCommonService').modalPopUpAlertManager;
        config.message = workflowData.get('responseMessage');
        config.title = workflowData.get('responseTitle');
        config.externalFn = true;
        config.actionHandler = "fireAssessmentCall";
        modalPopUpAlertManager.call(this, config);
    },

    getSignOffStatusTypes() {
        return this.get('esraPicklistService').getSignOffStatusTypes();
    },
    dateFormat(value, format, utcBool) {
        value = Number(value);
        if (utcBool) {
            return moment(value).utc().format((format) ? format : Constants.dateTime.format);
        } else {
            return moment(value).format((format) ? format : Constants.dateTime.format);
        }

    },
    userDetails() {
        return this.get('wbUserProfile.userProfile').toJSON();
    },
    historyStack: Ember.A(),
    previousRoute() {
        if (this.historyStack.length > 2) {
            let lastEl = this.historyStack.objectAt(this.historyStack.length - 1);
            let lastElOneUp = this.historyStack.objectAt(this.historyStack.length - 2);
            if (lastEl.name === lastElOneUp.name) {
                this.popLastRoute();
                this.previousRoute();
            }
            return this.historyStack.objectAt(this.historyStack.length - 2);
        } else {
            return { name: 'wb-ui-sales.sales.gems-summary' };
        }
    },
    pushRoute(routeName) {
        this.historyStack.pushObject(routeName);
    },
    popLastRoute() {
        this.historyStack.popObject();
    },
    onExit(transition) {
        if (transition.targetName.indexOf('wb-ui-esra') <= -1) {
            let paramVal = this.getParam(),
                consumerPayload = this.get('consumerPayload') || {},
                url = `${'/api/esra/unlock?dealId=' + paramVal.dealId + '&version=' + paramVal.version + '&sessionId=' + (consumerPayload.sessionId || '') + '&rulebaseVersion=' + (consumerPayload.rulebaseVersion || '')}`;
            this.get('wbAjax').request(url, {
                type: "GET",
                data: null,
                processData: false,
                contentType: false
            });
        }
    },
    getAssessment() {
        this.store.queryRecord('assessmentDetail', this.paramVal).then((data) => {
            this.set('assessmentDtlModel', data);
            return data;
        })
    },
    esramApproverMapping(followupActionMenu, followupTsk) {
        return followupActionMenu.items.map(item => {
            if ((Ember.isEqual(item.get('entitlement').toUpperCase(), "APPROVE")) && followupTsk.get('taskStatus') === "0003") {
                return item;
            }
            return null;
        }).compact();
    },
    signOffMenuMapping() {
        let [followupActionMenu, followupTsk, availableOptions, disableOption] = arguments;
        return followupActionMenu.items.map(item => {
            if (availableOptions.contains(item.get('entitlement').toUpperCase())) {
                return item;
            }
            return null;
        }).compact();
    },
    consolidateMenuOptions(followupActionMenu, signoffActivity) {
        return followupActionMenu.items.map(item => {
            if (item.actionControl && Ember.isEqual(signoffActivity.get(item.actionControl).toUpperCase(), "E")) {
                return item;
            }
            else if (item.actionControl && Ember.isEqual(signoffActivity.get(item.actionControl).toUpperCase(), "V")) {
                item.set('isDisabled', true);
                return item;
            }
            return null;
        }).compact();
    },
    actionOwnerMapping(followupActionMenu, followupTsk) {
        return followupActionMenu.items.map(item => {
            if (((Ember.isEqual(item.get('entitlement').toUpperCase(), "COMPLETE") || Ember.isEqual(item.get('entitlement').toUpperCase(), "EMAILREMINDER")) && followupTsk.get('taskStatus') === "0001") ||
                (Ember.isEqual(item.get('entitlement').toUpperCase(), "REFERTOESRM") && followupTsk.get('taskStatus') !== "0003") || (Ember.isEqual(item.get('entitlement').toUpperCase(), "RECALL") && followupTsk.get('taskStatus') && followupTsk.get('taskStatus').includes('0003'))) {
                return item;
            }
            else if (Ember.isEqual(item.get('entitlement').toUpperCase(), "EDIT") ||
                Ember.isEqual(item.get('entitlement').toUpperCase(), "DELETE")) {
                item.set('isDisabled', true);
                return item;
            }
            return null;
        }).compact();
    },
    deleteDealDirtyFiles(dealDetailsModel) {
        let dirtyFiles = dealDetailsModel.get('esraAttachment.files').filterBy('uploadedFile', true);
        if (dirtyFiles.length) {
            dirtyFiles.forEach(value => {
                let url = Constants.flyOutUrls.fileValidationServiceUrl.replace(':deal_Id', value.get('id'));
                Ember.$.ajax({
                    url: url,
                    type: "DELETE",
                    processData: false,
                    contentType: "application/JSON"
                });
                value.unloadRecord();
            });
        }
    },
    onClearOpaSession() {
        let paramVal = this.getParam(),
            consumerPayload = this.get('consumerPayload') || {},
            url = `${'/api/esra/clearOpaSession?dealId=' + paramVal.dealId + '&version=' + paramVal.version + '&sessionId=' + (consumerPayload.sessionId || '') + '&rulebaseVersion=' + (consumerPayload.rulebaseVersion || '')}`;
        this.get('wbAjax').request(url, {
            type: "GET",
            data: null,
            processData: false,
            contentType: false
        });
    },
    getLoggedUserName() {
        return this.get('wbUserProfile.userProfile.lastName') + ',' + this.get('wbUserProfile.userProfile.firstName');
    },
    userRoleDtl() {
        return Constants.userRole;
    },
    peekEsraActivity() {
        let param = this.get('param');
        return this.get('store').peekRecord('esra-activity', param.dealId);
    }
});
