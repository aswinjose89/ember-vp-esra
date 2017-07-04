import Ember from 'ember';
import detailConfig from '../utils/detail-config';
import fileAttachment from '../mixins/wb-esra-attachment';
import Constants from '../utils/esra-constant';
import RouteProgressIndicator from 'wb-ui-core/mixins/route-progress-indicator';

const {
    Component,
    computed,
    A,
    inject
} = Ember;

export default Component.extend(fileAttachment, RouteProgressIndicator, {
    tagName: '',
    store: Ember.inject.service('store'),
    esraDetailMembersConfig: detailConfig().get('esraDetailMembersConfig'),
    esraDetailAtmntConfig: detailConfig().get('esraDetailAtmntConfig'),
    selectedLeads: A(),
    esraUploadQueue: Ember.A([]),
    esraCommonService: inject.service(),
    wbAjax: Ember.inject.service(),
    esraDetailedMembersData: computed('model.dealTeamMember.members', {
        get() {
            const dealTeamMembers = this.get('model.dealTeamMember.members');
            dealTeamMembers.set('meta', Ember.Object.create({ totalRecords: this.get('model.dealTeamMember.totalRecords') }));
            return dealTeamMembers;
        }
    }),
    esraDetailedAtmntData: computed('model.esraAttachment.files', 'model.esraAttachment.files.@each.deleted', {
        get() {
            var dealAttachments = Ember.A([]);
            let isFileDeleted = false;
            if (this.get('model.esraAttachment.files')) {
                this.get('model.esraAttachment.files').forEach(val => {
                    if (!val.get('deleted')) {
                        dealAttachments.pushObject(val);
                    } else {
                        isFileDeleted = true;
                    }
                });
            }
            if (!isFileDeleted) {
                dealAttachments.set('meta', Ember.Object.create({ totalRecords: this.get('model.esraAttachment.totalRecords') }));
            }
            return dealAttachments;
        }
    }),
    detailsDraftSaveDisable: Ember.computed('model.hasDirtyAttributes', 'model.esraAttachment.files.@each.hasDirtyAttributes', {
        get() {
            if (this.get('model.hasDirtyAttributes') || this.get('model.esraAttachment.files').filterBy('hasDirtyAttributes', true).length) {
                this.get('esraCommonService').set('disableSaveDraft', false);
                this.get('model').set('saveDraftDisable', false);
            } else {
                this.get('esraCommonService').set('disableSaveDraft', true);
                this.get('model').set('saveDraftDisable', true);
            }
        }
    }),
    actions: {
        closeAttachmentFlyout() {
            // this.showFileUploadQueue(true);
            this.set('attachUpload', false);
        },
        openAttachmentFlyout(file, readOnlyFlag) {
            const paramVal = this.get('esraCommonService').getParam();
            const dealParam = { dealId: paramVal.dealId };
            this.get('store').query("dealDocument", dealParam).then(result => {
                result.forEach(val => {
                    val.set("categoryType", val.get("docCategory"));
                    val.set("documentId", (val.get("docId")) ? val.get("docId") : val.get("documentId"));
                    val.set("linkedAttachmentId", (val.get("docId")) ? val.get("docId") : val.get("documentId"));
                    val.set("description", (val.get("desc")) ? val.get("desc") : val.get("description"));
                    val.set("isSelected", false);
                    val.set("fileCategory", this.get('esraCommonService').getAttachmentCategoryList().findBy("categoryType", val.get("docCategory")));
                });
                if (file) {
                    Constants.flyOutObjects.attachmentList.description = file.get("description");
                    Constants.flyOutObjects.attachmentList.categoryType = file.get("categoryType");
                    Constants.flyOutObjects.attachmentList.uploadedBy = file.get("uploadedBy").split(',').get('firstObject');
                    Constants.flyOutObjects.attachmentList.fileName = file.get("fileName.name");
                    Constants.flyOutObjects.attachmentList.fileExtension = file.get("fileName.type");
                    Constants.flyOutObjects.attachmentList.fileCategory = this.get('esraCommonService').getAttachmentCategoryList().findBy("categoryType", file.get("categoryType"));
                    Constants.flyOutObjects.attachmentList.downloadLinkUrl = Constants.flyOutUrls.fileDownloadServiceUrl + "=" + (result.filterBy("documentId", file.get("id")).findBy("fileNetDocId") ?
                        encodeURI(result.filterBy("documentId", file.get("id")).findBy("fileNetDocId").get("fileNetDocId")) : (file.get("id")) ? file.get("id") : null);
                    file = Ember.Object.create(Constants.flyOutObjects.attachmentList);
                    this.attachmentProp.setProperties({
                        editMode: true,
                        isDeletable: false
                    });
                }
                else {
                    this.attachmentProp.setProperties({
                        editMode: false,
                        isDeletable: true
                    });
                }
                this.attachmentFlyout(file, readOnlyFlag, result);
            });
        },
        setLinkFilesFlyout() {
            var myArr = Ember.A([]);
            this.get('linkDocuments').map(function (obj) {
                myArr.pushObject(Ember.Object.create(obj));
            });
            this.set("linkFileList", myArr);
        },
        linkSelectedFiles(selectedFiles) {
            Ember.Logger.log("selectedFiles", selectedFiles);
            if (Ember.isEmpty(this.get('attachmentList'))) {
                this.set('attachmentList', Ember.A([]));
            }
            selectedFiles.forEach(function (item) {
                this.get('attachmentList').pushObject(Ember.Object.create(item));
                const selectedFileForTable = {};
                selectedFileForTable.id = item.linkedAttachmentId; /*TODO: It Temporary Code.Basically it should get id from linked object*/
                selectedFileForTable.fileName = Ember.Object.create({ "type": (item.fileExtension) ? item.fileExtension : item.fileName.split(".").pop(-1), "name": item.fileName.split(".").get('firstObject') });
                selectedFileForTable.description = item.description;
                selectedFileForTable.uploadedBy = this.get('esraCommonService').getLoggedUserName() + ', ' + moment(item.uploadedDate).format('DD MMM YYYY');
                selectedFileForTable.categoryType = item.categoryType;
                selectedFileForTable.downloadLinkUrl = item.downloadLinkUrl;
                if (!this.get('esraCommonService').isDefined(this.get('model.esraAttachment'))) {
                    this.get('model.esraAttachment').set('files', Ember.A([]));
                    this.get('model.esraAttachment.files').pushObject(this.get('store').createRecord('file', selectedFileForTable));
                } else if (this.get('model.esraAttachment.files').getEach('id').indexOf(selectedFileForTable.id) === -1) {
                    this.get('model.esraAttachment.files').pushObject(this.get('store').createRecord('file', selectedFileForTable));
                } else {
                    let record = this.get('model.esraAttachment.files').findBy('id', selectedFileForTable.id);
                    record.setProperties({
                        id: selectedFileForTable.id,
                        fileName: selectedFileForTable.fileName,
                        description: selectedFileForTable.description,
                        // uploadedBy: selectedFileForTable.uploadedBy,
                        categoryType: selectedFileForTable.categoryType,
                        downloadLinkUrl: selectedFileForTable.downloadLinkUrl
                    });
                }
            }, this);
            this.set('attachmentList', this.get('attachmentList'));
        },
        attachUploadedFiles(selectedFile) {
            if (Ember.isEmpty(this.get('attachmentList'))) {
                this.set('attachmentList', Ember.A([]));
            }
            this.set('esraUploadQueue', this.get('esraUploadQueue'));
            Ember.Logger.log("selectedFile:", selectedFile);
            this.get('attachmentList').pushObject(Ember.Object.create(selectedFile));
            this.set('attachmentList', this.get('attachmentList'));
            // this.send('showFileUploadQueue', this.get('esraUploadQueue'));
            if (this.get('attachmentProp.editMode')) {
                this.get('model.esraAttachment.files').forEach(file => {
                    if (Ember.isEqual(file.get('fileName.name').replace(/\s/g, ''), selectedFile.fileName.replace(/\s/g, ''))) {
                        file.setProperties({
                            description: selectedFile.description,
                            categoryType: selectedFile.fileCategory.categoryType,
                            updated: true
                        });
                    }
                });
            }
            if (Ember.get(selectedFile, 'isFileUploading') === true) {
                this.get('esraUploadQueue').pushObject(selectedFile);
            }
        },
        updateUploadStatus(uploadSuccessFlag, selectedFile) {
            try {
                Ember.Logger.log("uploadSuccessFlag:", uploadSuccessFlag, "selectedFile", selectedFile);
                let attachmentArr = this.get('attachmentList'), filteredAttchArr;
                if (!Ember.isEmpty(attachmentArr)) {
                    filteredAttchArr = attachmentArr.filterBy('tempAttachmentId', Ember.get(selectedFile, 'tempAttachmentId'));
                    if (!Ember.isEmpty(filteredAttchArr) && !Ember.isEmpty(filteredAttchArr[0])) {
                        var attachment = filteredAttchArr[0];
                        if (uploadSuccessFlag) {
                            attachment.set('isFileUploading', false);
                            attachment.set('tempAttachmentId', selectedFile.newAtachmentId);
                            attachment.set('downloadLinkUrl', selectedFile.downloadLinkUrl);
                            const selectedFileForTable = {};
                            selectedFileForTable.id = this.get('esraCommonService').getDocId().docId;
                            selectedFileForTable.fileName = { "type": (selectedFile.fileExtension) ? selectedFile.fileExtension : selectedFile.fileName.split(".").pop(-1), "name": selectedFile.fileName.split(".").get('firstObject') };
                            selectedFileForTable.description = selectedFile.description;
                            selectedFileForTable.uploadedBy = this.get('esraCommonService').getLoggedUserName() + ', ' + moment(selectedFile.uploadedDate).format('DD MMM YYYY');
                            selectedFileForTable.categoryType = selectedFile.categoryType;
                            selectedFileForTable.downloadLinkUrl = selectedFile.downloadLinkUrl;
                            selectedFileForTable.uploadedFile = true;
                            if (!this.get('esraCommonService').isDefined(this.get('model.esraAttachment'))) {
                                this.get('model.esraAttachment').set('files', Ember.A([]));
                                this.get('model.esraAttachment.files').pushObject(this.get('store').createRecord('file', selectedFileForTable));
                            } else if (this.get('model.esraAttachment.files').getEach('id').indexOf(selectedFileForTable.id) === -1) {
                                this.get('model.esraAttachment.files').pushObject(this.get('store').createRecord('file', selectedFileForTable));
                            } else {
                                let record = this.get('model.esraAttachment.files').findBy('id', selectedFileForTable.id);
                                record.setProperties({
                                    fileName: selectedFileForTable.fileName,
                                    description: selectedFileForTable.description,
                                    uploadedBy: selectedFileForTable.uploadedBy,
                                    categoryType: selectedFileForTable.categoryType,
                                    downloadLinkUrl: selectedFileForTable.downloadLinkUrl
                                });
                            }
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
            }
            catch (error) {
                Ember.Logger.debug('Exception in method updateUploadStatus:', error);
            }

        },
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
        displayUploadQueue() {
            var myArr = Ember.A([]);
            this.get('uploadQueueDummyList').map(function (obj) {
                myArr.pushObject(Ember.Object.create(obj));
            });
            this.set("uploadQueueDummyList", myArr);
            // this.send('showFileUploadQueue', this.get("uploadQueueDummyList"));
        },
        showFileUploadQueue(fileUploadQueue) {
            this.get('mdFileUploadQueueManager').open({
                displayUploadQueue: true,
                uploadQueue: fileUploadQueue,
                cancelUploadAction: function (files) { this.send('cancelFileUpload', files); }.bind(this)
            });
        },
        deleteFileAction(file) {
            let config = detailConfig().get('deleteAttachments');
            this.get('esraCommonService').modalPopUpManager.call(this, config, file);
        },
        deleteAttachedFile(file) {
            file.set('deleted', true);
        },
        handleUploadedFile(selectedFile, isFileSizeInvalid, isFileTypeInvalid) {
            if (isFileSizeInvalid || isFileTypeInvalid) {
                this.setErrorMessage(isFileSizeInvalid, isFileTypeInvalid);
            } else {
                this.set("errorMessage", null);
                var uploadedFile = this.createAttachmentRecord(selectedFile);
                this.set("uploadedFile", uploadedFile);
            }
        },
        fileDownload(file) {
            var count = 1;
            function ajaxRepeator() {
                let _that = this;
                let paramVal = this.get('esraCommonService').getParam();
                let dealParam = { dealId: paramVal.dealId };
                _that.get('store').query("dealDocument", dealParam).then(result => {
                    if ((_that.get('esraCommonService').isDefined(result.filterBy("documentId", file.get("id"))) &&
                        result.filterBy("documentId", file.get("id")).findBy("fileNetDocId")) ||
                        (_that.get('esraCommonService').isDefined(result.filterBy("docId", file.get("id"))) &&
                            result.filterBy("docId", file.get("id")).findBy("fileNetDocId"))) {
                        let url = Constants.flyOutUrls.fileDownloadServiceUrl + "=" + encodeURI((Em.isPresent(result.filterBy("documentId", file.get("id")))) ? result.filterBy("documentId", file.get("id")).findBy("fileNetDocId").get("fileNetDocId") :
                            result.filterBy("docId", file.get("id")).findBy("fileNetDocId").get("fileNetDocId"));
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
        detailMemberQueryAction(gridFilter) {
            this.showLoadingIndicator();
            let paramVal = this.get('esraCommonService').getParam(),
                dealId = paramVal.dealId,
                version = paramVal.version;
            this.gridFilter = JSON.parse(gridFilter);
            Constants.gridFilterRequest.pagination.page = this.gridFilter.pagination.page;
            let request = JSON.stringify(Constants.gridFilterRequest);
            return new Ember.RSVP.Promise(resolve => {
                this.get('store').queryRecord('dealTeamMember', {
                    dealId, version, request
                }).then(data => {
                    this.hideLoadingIndicator();
                    data.set('members.meta', Ember.Object.create({ totalRecords: data.get('totalRecords') }));
                    resolve(data.get('members').toArray());
                });
            });
        },
        detailAttachmentQueryAction(gridFilter) {
            this.showLoadingIndicator();
            let paramVal = this.get('esraCommonService').getParam(),
                dealId = paramVal.dealId,
                version = paramVal.version;
            this.gridFilter = JSON.parse(gridFilter);
            Constants.gridFilterRequest.pagination.page = this.gridFilter.pagination.page;
            let request = JSON.stringify(Constants.gridFilterRequest);
            return new Ember.RSVP.Promise(resolve => {
                this.get('store').queryRecord('esra-attachment', {
                    dealId, version, request
                }).then(data => {
                    data.set('files.meta', Ember.Object.create({ totalRecords: data.get('totalRecords') }));
                    this.hideLoadingIndicator();
                    resolve(data.get('files'));
                });
            });
        },
        saveDraft() {
            let params = this.get('esraCommonService').getParam();
            let config = detailConfig().get('saveDraftConfig');
            this.get('store').peekRecord("dealDetail", params.dealId).save().then((success) => {
                if (success) {
                    this.get('esraService').modalPopUpManager.call(this, config);
                }
            }, (error) => {
                Ember.Logger.log("Error in saveDraft Action:", error);
            });
        }
    }

});
