import Ember from 'ember';
import Constants from '../utils/esra-constant';
import RouteProgressIndicator from 'wb-ui-core/mixins/route-progress-indicator';
import EmberValidations from 'ember-validations';
import fileAttachment from '../mixins/wb-esra-attachment';

const {
    computed,
    inject,
    Object,
    isEqual,
    isEmpty,
    Component
} = Ember;

export default Component.extend(RouteProgressIndicator, EmberValidations, fileAttachment, {
    tagName: '',
    componentConfig: computed.alias('config.componentConfig'),
    followupTasks: computed('componentConfig.followupTasks.actionRequired',
        'componentConfig.followupTasks.dueDate',
        'componentConfig.followupTasks.assignees.@each.name', {
            get() {
                return this.get('componentConfig.followupTasks');
            }
        }),
    store: inject.service(),
    esraCommonService: inject.service(),
    esraPicklistService: inject.service(),
    uploadedFileCount: 0,
    /*TODO:This code is used to add extra conditions in code*/
    dataJSON: computed({
        get() {
            let esraApprovers = this.get('componentConfig.esraApprovers');
            let selectedItem = null, selectedBRRRC = null;
            if (this.get('componentConfig.esraActivity.esrmRouteOnly')) {
                selectedItem = this.get('componentConfig.approvalRoute.content') ? this.get('componentConfig.approvalRoute.content')[1] : null;
            } else {
                selectedItem = this.get('componentConfig.approvalRoute.content') ? this.get('componentConfig.approvalRoute.content.firstObject') : null;
            }
            if (this.get('componentConfig.BRRRC_Enabled')) {
                selectedBRRRC = this.get('componentConfig.escalatedBRRRC.content') ? this.get('componentConfig.escalatedBRRRC.content')[1] : null;
            }
            return Object.create({
                headerDataJSON: Object.create({
                    escalatedBRRRC: selectedBRRRC,
                    selectedItem: selectedItem,
                    comment: "",
                    assignees: Ember.isPresent(esraApprovers) ? esraApprovers : Ember.A([])
                })
            });
        }
    }),
    userSearchConfig: Constants.userSearchConfig,
    signoffRepeat: computed({
        get() {
            return this.get('esraPicklistService').getSignOffRepeats();
        }
    }),
    selectedUsers: Ember.A(),
    userContent: Ember.A(),
    validations: {
        'followupTasks.actionRequired': {
            presence: true
        },
        'followupTasks.dueDate': {
            presence: true
        },
        'followupTasks.assignees': {
            presence: true
        }
    },
    isButtonInValid: Ember.computed.not('isValid', function () {
        return (Ember.isEqual(this.get('isDirty'), true)) ? this.get('isValid') : true;
    }),
    conditionalMandatory: computed('dataJSON.headerDataJSON.selectedItem.value', 'dataJSON.headerDataJSON.comment', {
        get() {
            let esraActivity = this.get('componentConfig.esraActivity'), flag = this.get('componentConfig.flag');

            switch (flag) {
                case 'submit-approval-route':
                    if ((isEqual(esraActivity.get('outcome'), "0002") && this.get('dataJSON.headerDataJSON.selectedItem') &&
                        isEqual(this.get('dataJSON.headerDataJSON.selectedItem.value'), "0002"))) {
                        this.set('componentConfig.comments.label', "Enter your comment");
                        return isEmpty(this.get('dataJSON.headerDataJSON.comment').trim());
                    }
                    else {
                        this.set('componentConfig.comments.label', "Enter your comments (optional)");
                    }
                    break;
            }
        }
    }),
    isButtonDisabled: computed('dataJSON.headerDataJSON.comment', 'dataJSON.headerDataJSON.assignees.@each', 'dataJSON.headerDataJSON.selectedItem', {
        get() {
            if (isEqual(this.get('componentConfig.esraAction'), 'workflowevent') ||
                isEqual(this.get('componentConfig.esraAction'), 'submit') ||
                isEqual(this.get('componentConfig.esraAction'), 'signoffworkflowevent')) {
                if (isEqual(this.get('componentConfig.flag'), 'assignee')) {
                    return (isEmpty(this.get('dataJSON.headerDataJSON.assignees')));
                }
                else if (isEqual(this.get('componentConfig.flag'), 'assigneetoesrm')) {
                    return (isEmpty(this.get('dataJSON.headerDataJSON.comment').trim())
                        || isEmpty(this.get('dataJSON.headerDataJSON.assignees')));
                }
                else if (isEqual(this.get('componentConfig.nonMandatory'), true)) {
                    return false;
                } else if (this.get('dataJSON.headerDataJSON.selectedItem')) {
                    this.get('componentConfig.buttonSection').setEach('disableoption', false);
                }
                return isEmpty(this.get('dataJSON.headerDataJSON.comment').trim());
            }
        }
    }),
    isEndRepeatDisabled: computed('componentConfig.followupTasks.repeat', {
        get() {
            if (isEqual(this.get('componentConfig.esraAction'), 'createsignoffTask')) {
                return (isEmpty(this.get('componentConfig.followupTasks.repeat')) ||
                    (isEqual(this.get('componentConfig.followupTasks.repeat'), '0000')));
            }
        }
    }),
    actions: {
        closeDialog() {
            this.get('config.onClose').call(...this.get('config.callbackContext'));
        },
        closeDialogBubbling() {
            this.set('uploadedFileCount', 0);
            this.get('componentConfig').setProperties({
                popUpAttachmentList: Em.A([]),
                popupActions: false
            });
            this.get('config.onClose').call(...this.get('config.callbackContext'));
        },
        radioAction(val, selectedItem) {
            Ember.Logger.log("Radio button action: ", val, selectedItem);
        },
        workflowActions(actionType) {
            this.get('esraCommonService').setPopUpParam(this.get('dataJSON.headerDataJSON'));
            this.sendAction("workflowActionService", actionType);
            this.send('closeDialog');
        },
        changeTaskRepeat(selectedItem) {
            if (Em.isEqual(selectedItem.get('code'), "0000") && this.get('componentConfig.followupTasks.endRepeat')) {
                this.set('componentConfig.followupTasks.endRepeat', null);
            }
        },
        signoffWorkflowActions(followupTasks, actionMenu) {
            this.get('esraCommonService').setSignoffPopUpParam(this.get('dataJSON.headerDataJSON'));
            if (Em.isPresent(this.get('componentConfig.popUpAttachmentList'))) {
                this.get('componentConfig.popUpAttachmentList').forEach(attachment => {
                    this.send('uploadFile', attachment, true, actionMenu, this.get('componentConfig.popUpAttachmentList.length'));
                });
            }
            else {
                this.get('componentConfig._thatSignoffActionCard').send('signoffWorkflowActionService', actionMenu, this.get('componentConfig.popUpAttachmentList'));
                this.send('closeDialog');
            }
        },
        emailReminderAction(followupTasks) {
            this.get('esraCommonService').setProperty('reminderFollowupTasks', followupTasks);
            this.send('closeDialog');
        },
        clearEmailReminder(followupTasks) {
            followupTasks.set('emailReminderDate', null);
            this.get('esraCommonService').setProperty('reminderFollowupTasks', followupTasks);
            this.send('closeDialog');
        },
        searchAssignee(filter) {
            let paramVal = this.get('esraCommonService').getParam();
            let filterParam = JSON.parse(filter);
            let filters = { "pagination": { "page": filterParam.page, "size": 10 }, "searchValue": filterParam.searchKey, dealId: paramVal.dealId },
                request = JSON.stringify(filters),
                dealId = paramVal.dealId;
            return this.get('store').query('searchDealTeamMember', { request, dealId });
        },
        searchEsrmAssignee(filter) {
            let filters = { "pagination": { "page": 1, "size": 10 }, "searchValue": filter },
                request = JSON.stringify(filters),
                businessArea = this.get('esraCommonService').getBusinessArea();
            return this.get('store').query('searchESRMApprover', { request, businessArea });
        },
        selectAssignee() {
            let paramVal = this.get('esraCommonService').getParam();
            let filters = { "pagination": { "page": 1, "size": 10 }, "searchValue": "", dealId: paramVal.dealId },
                request = JSON.stringify(filters),
                dealId = paramVal.dealId;
            this.get('store').query('searchDealTeamMember', { request, dealId }).then(result => {
                this.set('userContent', result.toArray());
            });
        },
        selectOpenBox(searchFlag) {
            if (Em.isEqual(searchFlag, 'assignPopUpConfig')) {
                let paramVal = this.get('esraCommonService').getParam();
                let filters = { "pagination": { "page": 1, "size": 10 }, "searchValue": "" },
                    request = JSON.stringify(filters),
                    businessArea = this.get('esraCommonService').getBusinessArea();
                this.get('store').query('searchESRMApprover', { request, businessArea }).then(result => {
                    this.set('userContent', result.toArray());
                });
            }
        },
        workflowActionSubmit() {
            Ember.Logger.log('workflowActionSubmit:');
        },
        followupactionAssign(followupAction) {
            followupAction.set('assignedBy', "DTE"); /*TODO:Temporary Hardcoded to test by hitting API*/
            followupAction.set('assignedDate', new Date().getTime());
            this.sendAction('followupactionAssign', followupAction);
            this.send('closeDialog');
        },
        uploadFile() {
            let [attachment, isValidated, actionMenu, attachmentLength] = arguments;
            this.set("errorMessage", null);
            if (this.get('uploadFileOnSelect') === false && !isValidated) {
                this.set('selectedFile', selectFile);
                Ember.set(attachment, 'isFileUploading', false);
                Ember.set(attachment, 'isFileUploadPaused', true);
            } else {
                let selectedFile = Em.getWithDefault(attachment, 'selectedFile', null);
                this.set("errorMessage", null);
                Ember.set(attachment, 'isFileUploadPaused', false);
                Ember.set(attachment, 'isFileUploading', true);
                Ember.set(attachment, "categoryType", Ember.get(attachment, "fileCategory.categoryType"));
                var formData = new FormData();
                formData.append("docContextRegisterDocument.id", "attachment");
                formData.append("docTransactionFiles[0].multipartFile", selectedFile);
                formData.append("docId", attachment.get('docId'));
                formData.append("ContentId", "attachment");
                delete attachment.selectedFile;
                formData.append("attachmentRecord", JSON.stringify(attachment));
                var xhr = new XMLHttpRequest();
                xhr.open('POST', Constants.flyOutUrls.fileUploadServiceUrl.replace(':doc_Id', attachment.get('docId')), true);
                xhr.setRequestHeader('WB-TOKEN', this.get('session.secure.wbToken'));
                var uploadSuccessFlag = true;
                var response = null;
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        this.set('uploadedFileCount', this.get('uploadedFileCount') + 1);
                        response = JSON.parse(xhr.responseText);
                        if (Ember.get(response, 'result.id')) {
                            if (Em.isEqual(attachmentLength, this.get('uploadedFileCount'))) {
                                this.set('uploadedFileCount', 0);
                                this.get('componentConfig._thatSignoffActionCard').send('signoffWorkflowActionService', actionMenu, this.get('componentConfig.popUpAttachmentList'));
                                this.send('closeDialog');
                            }
                        } else {
                            uploadSuccessFlag = false;
                            this.handleFileUploadError(attachment);
                        }
                    } else {
                        uploadSuccessFlag = false;
                        this.handleFileUploadError(attachment);
                    }
                    // var result = this.get('uploadStatusUpdateAction').call(result, uploadSuccessFlag, attachment, response);
                }.bind(this);
                xhr.upload.onerror = function () {
                    uploadSuccessFlag = false;
                    this.handleFileUploadError(attachment);
                    // var result = this.get('uploadStatusUpdateAction').call(result, uploadSuccessFlag, attachment, response);
                }.bind(this);
                xhr.onerror = function () {
                    uploadSuccessFlag = false;
                    this.handleFileUploadError(attachment);
                    // var result = this.get('uploadStatusUpdateAction').call(result, uploadSuccessFlag, attachment, response);
                }.bind(this);
                xhr.send(formData);
                this.set('oldFile', null);
            }
            // }
        }
    }
});
