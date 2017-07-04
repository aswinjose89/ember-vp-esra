import Ember from 'ember';
import detailConfig from '../utils/detail-config';
import fileAttachment from '../mixins/wb-esra-attachment';
import Constants from '../utils/esra-constant';
import ModelProgressIndicator from 'wb-ui-core/mixins/model-progress-indicator';

export default Ember.Component.extend(fileAttachment, ModelProgressIndicator, {
    tagName: '',
    esraCommonService: Ember.inject.service(),
    store: Ember.inject.service(),
    wbAjax: Ember.inject.service(),
    signoffconstant: Constants.signoffconstant,
    wbUserProfile: Ember.inject.service(),
    deletePopupconfig: detailConfig().get('deleteAttachments'),
    toggleTaskIconConfig: detailConfig().get('toggleTaskIconConfig'),
    hideTaskActions: false,
    followupActionMenu: Ember.computed(
        'signoffActivity.recallEnabled',
        'signoffActivity.approveEnabled',
        'signoffActivity.referBackEnabled',
        'signoffActivity.referToESRMEnabled',
        'signoffActivity.deleteSignoffTaskEnabled',
        'signoffActivity.editSignoffTaskEnabled',
        'followupTsk.taskStatus', {
            get() {
                let followupActionMenu = detailConfig().get('followupActionMenu'),
                    signoffActivity = Ember.Object.create({}),
                    menuItems,
                    userDetail = this.get('esraCommonService').userDetails(),
                    followupTsk = this.get('followupTsk'),
                    signoffActivityObj = this.get('signoffActivity');
                signoffActivity.setProperties({
                    "recallEnabled": this.get('signoffActivity.recallEnabled'),
                    "approveEnabled": this.get('signoffActivity.approveEnabled'),
                    "referBackEnabled": this.get('signoffActivity.referBackEnabled'),
                    "referToESRMEnabled": this.get('signoffActivity.referToESRMEnabled'),
                    "deleteSignoffTaskEnabled": this.get('signoffActivity.deleteSignoffTaskEnabled'),
                    "editSignoffTaskEnabled": this.get('signoffActivity.editSignoffTaskEnabled')
                });
                if (Ember.isPresent(followupTsk.get('assignees')) && followupTsk.get('assignees').isAny('psId', userDetail.psId) && signoffActivityObj.get('roleDesc').toUpperCase() !== this.get('signoffconstant.roleDesc').get('esrmApprover')
                    && followupTsk.get('taskStatus') !== '0002') {
                    menuItems = this.get('esraCommonService').actionOwnerMapping(followupActionMenu, followupTsk);
                }
                else if (Ember.isEqual(signoffActivityObj.get('roleDesc').toUpperCase(), this.get('signoffconstant.roleDesc').get('esrmApprover'))) {
                    menuItems = this.get('esraCommonService').esramApproverMapping(followupActionMenu, followupTsk);
                }
                else if (Ember.isEqual(signoffActivityObj.get('roleDesc').toUpperCase(), this.get('signoffconstant.roleDesc').get('dealTeam'))
                    && !followupTsk.get('assignees').isAny('psId', userDetail.psId) && Em.isEqual(followupTsk.get('taskStatus'), '0003')) {

                    menuItems = Em.A([]);
                }
                else if (Ember.isEqual(signoffActivityObj.get('roleDesc').toUpperCase(), this.get('signoffconstant.roleDesc').get('dealTeam'))
                    && !followupTsk.get('assignees').isAny('psId', userDetail.psId) && (Em.isEqual(followupTsk.get('taskStatus'), '0001') || Em.isEqual(followupTsk.get('taskStatus'), '0005'))) {
                    let availableOptions = ['EDIT', 'DELETE'];
                    menuItems = this.get('esraCommonService').signOffMenuMapping(followupActionMenu, followupTsk, availableOptions);
                }
                else if (Ember.isEqual(signoffActivityObj.get('roleDesc').toUpperCase(), this.get('signoffconstant.roleDesc').get('dealTeam'))
                    && !followupTsk.get('assignees').isAny('psId', userDetail.psId) && Em.isEqual(followupTsk.get('taskStatus'), '0002')) {
                    let availableOptions = ['REFERTOESRM'];
                    menuItems = this.get('esraCommonService').signOffMenuMapping(followupActionMenu, followupTsk, availableOptions);
                }
                else if (followupTsk.get('assignees').isAny('psId', userDetail.psId) && Em.isEqual(followupTsk.get('taskStatus'), '0002')) {
                    menuItems = Em.A([]);
                }
                else {
                    menuItems = this.get('esraCommonService').consolidateMenuOptions(followupActionMenu, signoffActivity);
                }

                followupActionMenu.set('items', menuItems);
                return followupActionMenu;
            }
        }),
    entitlementHandler: Ember.computed(
        'followupTsk.taskStatus',
        'signoffActivity.roleDesc',
        'followupTsk.assignees.@each.psId', {
            get() {
                let taskStatus = this.get('followupTsk.taskStatus'),
                    followupTsk = this.get('followupTsk'),
                    roleDesc = this.get('signoffActivity.roleDesc').toUpperCase(),
                    userDetail = this.get('esraCommonService').userDetails(),
                    signoffActivity = this.get('signoffActivity'),
                    chechboxConfig = Ember.Object.create({
                        action: 'workflowAction',
                        actionParam: 'complete',
                        isChecked: false,
                        isDisabled: false,
                        windowBox: "POPUP",
                        iconColor: null,
                        cardDisabled: false,
                        actionCode: "0002",
                        isAttachmentEnabled: false
                    });
                if (Ember.isEqual(taskStatus, '0002') || Ember.isEqual(taskStatus, '0006')) {
                    chechboxConfig.setProperties({
                        isChecked: true,
                        iconColor: 'green-500',
                        isDisabled: true
                    });
                }

                if (Ember.isEqual(signoffActivity.get('roleDesc').toUpperCase(), this.get('signoffconstant.roleDesc').get('esrmApprover'))) {
                    if (Ember.isEqual(signoffActivity.get('signoffTaskReadonly'), 'V') && taskStatus !== '0003') {
                        chechboxConfig.set('cardDisabled', true);
                    }
                    else if (taskStatus !== '0003') {
                        chechboxConfig.set('isDisabled', true);
                    }
                    else if (Ember.isEqual(taskStatus, '0003')) {
                        chechboxConfig.setProperties({
                            isDisabled: true,
                            isAttachmentEnabled: true
                        });
                    }
                }
                else if ((Ember.isPresent(followupTsk.get('assignees')) && followupTsk.get('assignees').isAny('psId', userDetail.psId))) {
                    // if (taskStatus !== '0001'|| taskStatus !== '0005') {
                    //     chechboxConfig.setProperties({
                    //         isDisabled: true,
                    //         isAttachmentEnabled: false
                    //     });
                    // }
                    if (Em.isEqual(taskStatus, '0001') || Em.isEqual(taskStatus, '0005')) {
                        chechboxConfig.set('isAttachmentEnabled', true);
                        chechboxConfig.setProperties({
                            isDisabled: false,
                            isAttachmentEnabled: true
                        });
                    }
                    else {
                        chechboxConfig.setProperties({
                            isDisabled: true,
                            isAttachmentEnabled: false
                        });
                    }

                }
                else if ((Ember.isPresent(followupTsk.get('assignees')) && !followupTsk.get('assignees').isAny('psId', userDetail.psId))) {
                    if (Ember.isEqual(taskStatus, '0002')) {
                        chechboxConfig.set('isAttachmentEnabled', true);
                    }
                    chechboxConfig.set('isDisabled', true);
                }
                // if (followupTsk.get('assignees').isAny('psId', userDetail.psId)) {
                //     chechboxConfig.set('isAttachmentEnabled', true);
                // }
                return chechboxConfig;
            }
        }),
    signoffRequirement: Ember.computed('signoffModel', {
        get() {
            return this.get('signoffModel');
        }
    }),
    esraUploadQueue: Ember.A([]),
    // signoffAttachmentList: Ember.computed('followupTsk', 'followupTsk.taskStatus', 'followupTsk.documents', 'signoffActivity', {
    //     get() {
    //         let paramVal = this.get('esraCommonService').getParam(),
    //             followupTsk = this.get('followupTsk'),
    //             signoffActivity = this.get('signoffActivity'),
    //             filteredAttachment,
    //             dealParam = { dealId: paramVal.dealId };
    //         // if (Ember.isEmpty(this.get('attachmentList'))) {
    //         this.set('attachmentList', Ember.A([]));
    //         // }
    //         if (this.get('esraCommonService').isDefined(followupTsk) &&
    //             this.get('esraCommonService').isDefined(followupTsk.get('documents'))) {
    //             this.get('store').query("dealDocument", dealParam).then(dealDoc => {
    //                 followupTsk.get('documents').forEach(val => {
    //                     filteredAttachment = dealDoc.filterBy('docId', val.docId.toString());
    //                     if (this.get('esraCommonService').isDefined(filteredAttachment)) {
    //                         let attachmentFile = Em.Object.create(filteredAttachment.get('firstObject').toJSON());
    //                         if (Em.isEqual(signoffActivity.get('signoffTaskReadonly'), "V") || Em.isEqual(followupTsk.get('taskStatus'), "0002")) {
    //                             attachmentFile.set('isReadOnlyFile', true);
    //                         }
    //                         this.get('attachmentList').pushObject(attachmentFile);
    //                     }

    //                 });
    //             });
    //         }
    //     }
    // }),
    getEsraActivity() {
        return this.get('esraCommonService').peekEsraActivity();
    },
    getDealHeader() {
        var paramVal = this.get('esraCommonService').getParam();
        return this.get('store').peekRecord('dealHeader', paramVal.dealId);
    },
    dueDateRespList: Ember.computed('followupTsk.assignees', 'followupTsk.dueDate', {
        get() {
            let date = this.get('esraCommonService').dateFormat(this.get('followupTsk.dueDate')),
                list = [];
            this.get('followupTsk.assignees').forEach((item, index) => {
                list.push(`${date}<span class="mid-dot"></span>${item.get('psId')} - ${item.get('name')}`);
            });
            return {
                listLimit: 1,
                list: list
            };
        }
    }),
    actions: {
        /**
       * [closeAttachmentFlyout description]
       * @param  {[type]} message  [description]
       * @param  {[type]} position [description]
       * @return {[type]}          [description]
       */
        closeAttachmentFlyout() {
            // this.showFileUploadQueue(true);
            this.set('attachUpload', false);
        },
        /**
       * [openAttachmentFlyout description]
       * @param  {[type]} message  [description]
       * @param  {[type]} position [description]
       * @return {[type]}          [description]
       */
        openAttachmentFlyout(followupTsk, readOnlyFlag) {
            let paramVal = this.get('esraCommonService').getParam();
            let dealParam = { dealId: paramVal.dealId };
            this.get('store').query("dealDocument", dealParam).then(result => {
                result.forEach(val => {
                    val.setProperties({
                        categoryType: val.get("docCategory"),
                        documentId: (val.get("docId")) ? val.get("docId") : val.get("documentId"),
                        linkedAttachmentId: (val.get("docId")) ? val.get("docId") : val.get("documentId"),
                        description: (val.get("desc")) ? val.get("desc") : val.get("description"),
                        isSelected: false,
                        fileCategory: this.get('esraCommonService').getAttachmentCategoryList().findBy("categoryType", val.get("docCategory"))
                    });
                });
                this.attachmentFlyout(null, readOnlyFlag, result, followupTsk);
            });
        },
        /**
      * [setLinkFilesFlyout description]
      * @param  {[type]} message  [description]
      * @param  {[type]} position [description]
      * @return {[type]}          [description]
      */
        setLinkFilesFlyout() {
            var myArr = Ember.A([]);
            this.get('linkDocuments').map(function (obj) {
                myArr.pushObject(Ember.Object.create(obj));
            });
            this.set("linkFileList", myArr);
        },
        /**
       * [linkSelectedFiles description]
       * @param  {[type]} message  [description]
       * @param  {[type]} position [description]
       * @return {[type]}          [description]
       */
        linkSelectedFiles(selectedFiles, followupTsk) {
            Ember.Logger.log("selectedFiles", selectedFiles);
            if (Ember.isEmpty(this.get('attachmentList'))) {
                this.set('attachmentList', Ember.A([]));
            }
            selectedFiles.forEach(function (item) {
                const selectedFileForTable = {};
                selectedFileForTable.id = item.documentId; /*TODO: It Temporary Code.Basically it should get id from linked object*/
                selectedFileForTable.fileName = Ember.Object.create({ "type": (item.fileExtension) ? item.fileExtension : item.fileName.split(".").pop(-1), "name": item.fileName });
                selectedFileForTable.description = item.description;
                selectedFileForTable.uploadedBy = item.uploadedBy;
                selectedFileForTable.categoryType = item.categoryType;
                selectedFileForTable.downloadLinkUrl = item.downloadLinkUrl;
                if (!followupTsk.get('documents').findBy('docId', item.linkedAttachmentId)) {
                    followupTsk.get('documents').pushObject(this.fileDetails(selectedFileForTable, item.linkedAttachmentId));
                    // followupTsk.get('documents').pushObject({
                    //     id: 0,
                    //     docId: item.linkedAttachmentId
                    // });
                }
            }, this);
            this.showLoadingIndicator();
            this.set('attachmentList', this.get('attachmentList'));
            let paramVal = this.get('esraCommonService').getParam(),
                esraActivity = this.getEsraActivity(paramVal);
            this.set('signoffreq.esraActivity', esraActivity);
            this.get('signoffreq').save().then((success) => {
                if (success) {
                    this.hideLoadingIndicator();
                }
            });
        },
        /**
       * [attachUploadedFiles description]
       * @param  {[type]} message  [description]
       * @param  {[type]} position [description]
       * @return {[type]}          [description]
       */
        attachUploadedFiles(selectedFile) {
            if (Ember.isEmpty(this.get('attachmentList'))) {
                this.set('attachmentList', Ember.A([]));
            }
            this.set('esraUploadQueue', this.get('esraUploadQueue'));
            Ember.Logger.log("selectedFile:", JSON.stringify(selectedFile));
            this.get('attachmentList').pushObject(Ember.Object.create(selectedFile));
            this.set('attachmentList', this.get('attachmentList'));
            // this.send('showFileUploadQueue', this.get('esraUploadQueue'));
            if (Ember.get(selectedFile, 'isFileUploading') === true) {
                this.get('esraUploadQueue').pushObject(selectedFile);
            }
        },
        /**
       * [updateUploadStatus description]
       * @param  {[type]} message  [description]
       * @param  {[type]} position [description]
       * @return {[type]}          [description]
       */
        updateUploadStatus(uploadSuccessFlag, selectedFile, followupTsk) {
            Ember.Logger.log("uploadSuccessFlag:", uploadSuccessFlag, "selectedFile", selectedFile);
            let attachmentArr = this.get('attachmentList'), filteredAttchArr;
            if (!Ember.isEmpty(attachmentArr)) {
                filteredAttchArr = attachmentArr.filterBy('tempAttachmentId', Ember.get(selectedFile, 'tempAttachmentId'));
                if (!Ember.isEmpty(filteredAttchArr) && !Ember.isEmpty(filteredAttchArr[0])) {
                    var attachment = filteredAttchArr[0];
                    if (uploadSuccessFlag) {
                        attachment.set('isFileUploading', false);
                        attachment.set('tempAttachmentId', selectedFile.newAttachmentId);
                        attachment.set('downloadLinkUrl', selectedFile.downloadLinkUrl);
                        this.showLoadingIndicator();
                        let paramVal = this.get('esraCommonService').getParam(),
                            esraActivity = this.getEsraActivity(paramVal);
                        this.set('signoffreq.esraActivity', esraActivity);
                        this.get('signoffreq').save().then((success) => {
                            this.hideLoadingIndicator();
                        });

                    } else {
                        Ember.Logger.error("File upload Failure");
                        filteredAttchArr = attachmentArr.filter(function (item) {
                            return Ember.get(item, 'tempAttachmentId') !== Ember.get(selectedFile, 'tempAttachmentId');
                        });
                        this.set('attachmentList', filteredAttchArr);
                        this.set('attachmentList', this.get('attachmentList'));
                    }
                }
            }
        },
        /**
      * [cancelFileUpload description]
      * @param  {[type]} message  [description]
      * @param  {[type]} position [description]
      * @return {[type]}          [description]
      */
        cancelFileUpload(files) {
            Ember.Logger.log("cancelFileUpload: files> ", files);
            let attachmentArr = this.get('attachmentList');
            if (!Ember.isEmpty(files) && !Ember.isEmpty(attachmentArr)) {
                var cancelledFileIds = [];
                files.forEach(function (file) {
                    cancelledFileIds.push(Ember.get(file, 'tempAttachmentId'));
                });
                var filteredAttchArr = attachmentArr.filter(function (file) {
                    return !cancelledFileIds.includes(Ember.get(file, 'tempAttachmentId'));
                });
                this.set('attachmentList', filteredAttchArr);
                this.set('attachmentList', this.get('attachmentList'));
            }
        },
        /**
      * [displayUploadQueue description]
      * @param  {[type]} message  [description]
      * @param  {[type]} position [description]
      * @return {[type]}          [description]
      */
        displayUploadQueue() {
            var myArr = Ember.A([]);
            this.get('uploadQueueDummyList').map(function (obj) {
                myArr.pushObject(Ember.Object.create(obj));
            });
            this.set("uploadQueueDummyList", myArr);
            // this.send('showFileUploadQueue', this.get("uploadQueueDummyList"));
        },
        /**
      * [showFileUploadQueue description]
      * @param  {[type]} message  [description]
      * @param  {[type]} position [description]
      * @return {[type]}          [description]
      */
        showFileUploadQueue(fileUploadQueue) {
            this.get('mdFileUploadQueueManager').open({
                displayUploadQueue: true,
                uploadQueue: fileUploadQueue,
                cancelUploadAction: function (files) { this.send('cancelFileUpload', files) }.bind(this)
            });
        },
        /**
      * [deleteFileAction description]
      * @param  {[type]} message  [description]
      * @param  {[type]} position [description]
      * @return {[type]}          [description]
      */
        deleteFileAction(file) {
            // let uploadedDocsList = this.get('esraCommonService.followupTskUploadAttachmentList');
            // if (uploadedDocsList.contains(file.get('documentId'))) {
            //     let url = Constants.flyOutUrls.fileValidationServiceUrl.replace(':deal_Id', file.get('documentId'));
            //     Ember.$.ajax({
            //         url: url,
            //         type: "DELETE",
            //         processData: false,
            //         contentType: "application/JSON"
            //     });
            //     uploadedDocsList.removeAt(uploadedDocsList.indexOf(file.get('documentId')));
            // }
            this.send('deleteAttachedFile', file);
        },
        /**
      * [deleteAttachedFile description]
      * @param  {[type]} message  [description]
      * @param  {[type]} position [description]
      * @return {[type]}          [description]
      */
        deleteAttachedFile(file) {
            this.showLoadingIndicator();
            // file.set('deleted', true);
            let documentsList = this.get('followupTsk.documents');
            documentsList.forEach((item, index) => {
                if (item.docId === (file.get('documentId')) ? file.get('documentId') : file.get('tempAttachmentId')) {
                    Em.set(item, 'deleted', true);
                }
            });
            // this.get('attachmentList').forEach((val, key) => {
            //     if (val.get('docId') === (file.get('documentId')) ? file.get('documentId') : file.get('tempAttachmentId')) {
            //         this.get('attachmentList').removeAt(key);
            //     }
            // });
            let paramVal = this.get('esraCommonService').getParam(),
                esraActivity = this.getEsraActivity(paramVal);
            this.set('signoffreq.esraActivity', esraActivity);
            this.get('signoffreq').save().then((success) => {
                this.hideLoadingIndicator();
            });
        },
        //     /**
        //    * [handleUploadedFile description]
        //    * @param  {[type]} message  [description]
        //    * @param  {[type]} position [description]
        //    * @return {[type]}          [description]
        //    */
        //     handleUploadedFile(selectedFile, isFileSizeInvalid, isFileTypeInvalid) {
        //         if (isFileSizeInvalid || isFileTypeInvalid) {
        //             this.setErrorMessage(isFileSizeInvalid, isFileTypeInvalid);
        //         } else {
        //             this.set("errorMessage", null);
        //             var uploadedFile = this.createAttachmentRecord(selectedFile);
        //             this.set("uploadedFile", uploadedFile);
        //         }
        //     },
        fileDownload(file) {
            var count = 1;
            function ajaxRepeator() {
                let _that = this;
                let paramVal = this.get('esraCommonService').getParam();
                let dealParam = { dealId: paramVal.dealId };
                _that.get('store').query("dealDocument", dealParam).then(result => {
                    if ((_that.get('esraCommonService').isDefined(result.filterBy("documentId", file.get("docId"))) &&
                        result.filterBy("documentId", file.get("docId")).findBy("fileNetDocId")) ||
                        (_that.get('esraCommonService').isDefined(result.filterBy("docId", file.get("docId"))) &&
                            result.filterBy("docId", file.get("docId")).findBy("fileNetDocId"))) {
                        let url = Constants.flyOutUrls.fileDownloadServiceUrl + "=" + encodeURI((Em.isPresent(result.filterBy("documentId", file.get("docId")))) ? result.filterBy("documentId", file.get("docId")).findBy("fileNetDocId").get("fileNetDocId") :
                            result.filterBy("docId", file.get("docId")).findBy("fileNetDocId").get("fileNetDocId"));
                        _that.get('wbAjax').request(url, {
                            url: '',
                            type: "GET",
                            data: null,
                            processData: false,
                            contentType: false
                        }).then(function (response) {
                            if (response) {
                                let link = document.createElement("a");
                                [link.download, link.target, link.href] = ["download", "_blank", response.filenetURL];
                                link.click();
                            }
                        });

                    } else {
                        (count < 5) ? Ember.run.later(_that, ajaxRepeator, 1000) :
                            this.mdSnackBarManager.open(Constants.esraDownloadSnackBar);
                        count++;
                    }
                });
            }
            ajaxRepeator.call(this);
        },
        /**
       * [createSignOffAction description]
       * @param  {[type]} message  [description]
       * @param  {[type]} position [description]
       * @return {[type]}          [description]
       */
        createSignOffAction(signoffModel) {
            this.sendAction('triggerFollowUpEditAction', this.get('followupTsk'));
            Ember.Logger.log("signoffModel:", signoffModel);
        },
        /**
       * [updateSignoffAction description]
       * @param  {[type]} message  [description]
       * @param  {[type]} position [description]
       * @return {[type]}          [description]
       */
        updateSignoffAction() {
            if (detailConfig().get('signoffPopUpConfig') &&
                detailConfig().get('signoffPopUpConfig').popOver) {
                let config = detailConfig().get('signoffPopUpConfig').secondLevel;
                config.followupTasks = Ember.Object.create({
                    "actionRequired": this.get('followupTsk').get('actionRequired'),
                    "dueDate": this.get('followupTsk').get('dueDate'),
                    "repeat": (!this.get('followupTsk').get('repeat')) ? "0000" : this.get('followupTsk').get('repeat'),
                    "endRepeat": this.get('followupTsk').get('endRepeat'),
                    "assignedBy": this.get('followupTsk').get('assignedBy'),
                    "createdBy": this.get('followupTsk').get('createdBy'),
                    "assignedDate": null,
                    "taskStatus": null,
                    "completedDate": null,
                    "completionComments": null,
                    "confirmedByEsrm": null,
                    "docId": null,
                    "id": this.get('followupTsk').get('id'),
                    "assignees": Ember.copy(this.get('followupTsk').get('assignees').toArray())
                });
                this.get("esraCommonService").popUp.call(this, config, config.followupTasks);
            }
        },
        /**
       * [followupactionAssign description]
       * @param  {[type]} message  [description]
       * @param  {[type]} position [description]
       * @return {[type]}          [description]
       */
        followupactionAssign(followupact) {
            let paramVal = this.get('esraCommonService').getParam(),
                esraActivity = this.getEsraActivity(paramVal);
            this.get('followupTsk').set('actionRequired', followupact.get('actionRequired'));
            this.get('followupTsk').set('dueDate', followupact.get('dueDate'));
            this.get('followupTsk').set('repeat', (Em.isEqual(followupact.get('repeat'), "0000")) ? null : followupact.get('repeat'));
            this.get('followupTsk').set('endRepeat', followupact.get('endRepeat'));
            esraActivity = this.get('esraCommonService').peekEsraActivity();
            this.get('followupTsk').setProperties({
                'actionRequired': followupact.get('actionRequired'),
                'dueDate': followupact.get('dueDate'),
                'repeat': (Em.isEqual(followupact.get('repeat'), '0000')) ? null : followupact.get('repeat'),
                'endRepeat': followupact.get('endRepeat'),
                'assignees': followupact.get('assignees')
            });
            this.set('signoffreq.esraActivity', esraActivity);
            this.showLoadingIndicator();
            this.get('signoffreq').save().then((success) => {
                if (success) {
                    this.hideLoadingIndicator();
                }
            });
        },
        /**
        * [workflowAction description]
        * @param  {[type]} message  [description]
        * @param  {[type]} position [description]
        * @return {[type]}          [description]
        */
        workflowAction(actionMenu) {
            const config = (actionMenu.get('actionParam')) ?
                detailConfig().get(`${"signoff" + actionMenu.get('actionParam').capitalize() + 'Config'}`) : null,
                modalPopUpManager = this.get('esraCommonService').modalPopUpManager,
                componentPopUp = this.get("esraCommonService").popUp;
            if (Ember.isEqual(actionMenu.get('windowBox'), 'ALERT')) {
                if (Ember.isEqual(actionMenu.get('actionCode'), '0002')) { /*Its only when we wanna complete*/
                    actionMenu.setProperties({
                        isChecked: true,
                        iconColor: 'green-500'
                    });
                }
                modalPopUpManager.call(this, config, actionMenu);
            }
            else {
                config.setProperties({
                    _thatSignoffActionCard: this,
                    followupTasks: this.get('followupTsk'),
                    actionMenu: actionMenu,
                    esraApprovers: Em.getWithDefault(this.getDealHeader(), 'esraApprovers', null)
                });
                componentPopUp.call(this, config, actionMenu);
            }

        },
        /**
        * [emailReminderPopUp description]
        * @param  {[type]} message  [description]
        * @param  {[type]} position [description]
        * @return {[type]}          [description]
        */
        emailReminderPopUp(actionMenu) {
            const config = (actionMenu.get('actionParam')) ?
                detailConfig().get(`${"signoff" + actionMenu.get('actionParam').capitalize() + 'Config'}`) : null,
                componentPopUp = this.get("esraCommonService").popUp;
            config.followupTasks = Em.Object.create({
                emailReminderEnabled: this.get('followupTsk.emailReminderEnabled'),
                emailReminderDate: this.get('followupTsk.emailReminderDate')
            });
            componentPopUp.call(this, config, config.followupTasks);
        },
        /**
        * [signoffWorkflowActionCancel description]
        * @param  {[type]} message  [description]
        * @param  {[type]} position [description]
        * @return {[type]}          [description]
        */
        signoffWorkflowActionCancel() {
            this.get('entitlementHandler').setProperties({
                isChecked: false,
                iconColor: null
            });
        },
        /**
         * [signoffWorkflowActionService description]
         * @param  {[type]} message  [description]
         * @param  {[type]} position [description]
         * @return {[type]}          [description]
         */
        signoffWorkflowActionService(actionMenu, popUpAttachmentList) {

            let signoffActivity = this.get('signoffActivity'), followupTsk = this.get('followupTsk'), headerDataJSON = this.get('esraCommonService').getSignoffPopUpParam();

            this.get('followupTsk').set('taskStatus', actionMenu.get('actionCode'));
            if (this.get('attachmentList')) {
                this.get('followupTsk').set('docId', this.get('attachmentList').map(val => {
                    return val.linkedAttachmentId;
                }));
            }
            // this.send('uploadFile', file, false, false, true, attachment);
            if (Ember.isEqual(actionMenu.get('windowBox'), 'POPUP')) {
                let headerDataJSON = this.get('esraCommonService').getSignoffPopUpParam();

                if (Em.isEqual(actionMenu.get('actionCode'), '0002')) {
                    this.get('followupTsk').setProperties({
                        aoCompletionComments: this.get('esraCommonService').isDefined(headerDataJSON) ? headerDataJSON.get('comment') : null,
                        completedDate: new Date().getTime(),
                        completedBy: `${this.get('wbUserProfile.userProfile.psId')} - ${this.get('wbUserProfile.userProfile.lastName')} , ${this.get('wbUserProfile.userProfile.firstName')}`
                    });
                }
                else if (Em.isEqual(actionMenu.get('actionCode'), '0003')) {
                    this.get('followupTsk').setProperties({
                        referredToEsrmComments: this.get('esraCommonService').isDefined(headerDataJSON) ? headerDataJSON.get('comment') : null,
                        esraApprovers: (this.get('esraCommonService').isDefined(headerDataJSON) && this.get('esraCommonService').isDefined(headerDataJSON.get('assignees'))) ? headerDataJSON.get('assignees').map(val => {
                            return val.get('psId');
                        }) : null,
                        referredToEsrmDate: new Date().getTime(),
                        referredToEsrmBy: `${this.get('wbUserProfile.userProfile.psId')} - ${this.get('wbUserProfile.userProfile.lastName')} , ${this.get('wbUserProfile.userProfile.firstName')}`
                    });
                }
                else if (Em.isEqual(actionMenu.get('actionCode'), '0006')) {
                    this.get('followupTsk').setProperties({
                        esrmApprovedComments: this.get('esraCommonService').isDefined(headerDataJSON) ? headerDataJSON.get('comment') : null,
                        esraApprovers: (this.get('esraCommonService').isDefined(headerDataJSON) && this.get('esraCommonService').isDefined(headerDataJSON.get('assignees'))) ? headerDataJSON.get('assignees').map(val => {
                            return val.get('psId');
                        }) : null,
                        esrmApprovedDate: new Date().getTime(),
                        esrmApprovedBy: `${this.get('wbUserProfile.userProfile.psId')} - ${this.get('wbUserProfile.userProfile.lastName')} , ${this.get('wbUserProfile.userProfile.firstName')}`
                    });
                }
                else {
                    this.get('followupTsk').setProperties({
                        completionComments: this.get('esraCommonService').isDefined(headerDataJSON) ? headerDataJSON.get('comment') : null,
                        esraApprovers: (this.get('esraCommonService').isDefined(headerDataJSON) && this.get('esraCommonService').isDefined(headerDataJSON.get('assignees'))) ? headerDataJSON.get('assignees').map(val => {
                            return val.get('psId');
                        }) : null,
                        completedDate: new Date().getTime(),
                        completedBy: `${this.get('wbUserProfile.userProfile.psId')} - ${this.get('wbUserProfile.userProfile.lastName')} , ${this.get('wbUserProfile.userProfile.firstName')}`
                    });
                }
            }
            var paramVal = this.get('esraCommonService').getParam(),
                esraActivity = this.getEsraActivity(paramVal);
            this.get('signoffreq').set('esraActivity', esraActivity);
            this.showLoadingIndicator();
            this.get('signoffreq').save().then((success) => {
                if (success) {
                    this.hideLoadingIndicator();
                    (popUpAttachmentList) ? popUpAttachmentList = Em.A([]) : null;
                    this.send('signoffWorkflowAlert', actionMenu);
                }
            });
        },
        emailReminderAction(fsk) {
            var paramVal = this.get('esraCommonService').getParam(),
                esraActivity = this.getEsraActivity(paramVal),
                reminderFollowupTasks = this.get('esraCommonService').getProperty('reminderFollowupTasks');
            this.get('followupTsk').setProperties({
                emailReminderEnabled: (reminderFollowupTasks && reminderFollowupTasks.get('emailReminderDate')) ? "Y" : "N",
                emailReminderDate: Em.getWithDefault(reminderFollowupTasks, 'emailReminderDate', null)
            });
            this.get('signoffreq').set('esraActivity', esraActivity);
            this.showLoadingIndicator();
            this.get('signoffreq').save().then((success) => {
                if (success) {
                    this.hideLoadingIndicator();
                }
            });
        },
        /**
         * [signoffWorkflowAlert description]
         * @param  {[type]} message  [description]
         * @param  {[type]} position [description]
         * @return {[type]}          [description]
         */
        signoffWorkflowAlert(actionMenu) {
            const config = detailConfig().get('commonAlertConfig'),
                modalPopUpAlertManager = this.get('esraCommonService').modalPopUpAlertManager;
            config.message = this.get('signoffconstant').contents.signoff[actionMenu.get('actionParam')];
            config.title = this.get('signoffconstant').titles.signoff[actionMenu.get('actionParam')];
            modalPopUpAlertManager.call(this, config);
        },
        /**
       * [deleteFollowupAction description]
       * @param  {[type]} message  [description]
       * @param  {[type]} position [description]
       * @return {[type]}          [description]
       */
        deleteFollowupAction() {
            this.get('followupTsk').set("deleted", true);
            this.sendAction('triggerFollowUpDeleteAction', this.get('followupTsk'));
        },
        /**
      * [deleteAction description]
      * @param  {[type]} message  [description]
      * @param  {[type]} position [description]
      * @return {[type]}          [description]
      */
        deleteAction() {
            let config = detailConfig().get('deleteFollowupTask');
            this.get('esraCommonService').modalPopUpManager.call(this, config);
        }

    }
});
