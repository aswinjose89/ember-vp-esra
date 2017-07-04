import Ember from 'ember';
import Constants from '../utils/esra-constant';

export default Ember.Mixin.create({
    snackBar: {},
    attachmentProp: Ember.Object.create({}),
    esraCommonService: Ember.inject.service(),
    componentConfig: Em.computed.alias('config.componentConfig'),
    popUpAttachmentList: Em.A([]),
    wbUserProfile: Em.inject.service(),
    attachmentFlyout(file, readOnlyFlag, result, followupTsk) {
        this.get('mdAttachmentFlyoutManager').open({
            showAttachmentFlyout: true,
            attachAction: (file) => { this.send('attachUploadedFiles', file); },
            cancelAction: () => { Ember.Logger.log("cancelAction"); },
            linkFilesAction: (files) => { this.send('linkSelectedFiles', files, followupTsk); },
            uploadStatusUpdateAction: (uploadSuccessFlag, selectedFile) => { this.send('updateUploadStatus', uploadSuccessFlag, selectedFile); },
            instructionMessage: `Select file from your computer to instantly add it to DealCentre or click
                                    LINK FILES to select from the library`,
            isEditable: true,
            attachedFile: file,
            isDeletable: this.get('attachmentProp.isDeletable'),
            uploadFileOnSelect: false,
            validateFile: true,
            validationAction: (file, attachmentRecord) => { return this.validateUploadingFile(file, attachmentRecord, followupTsk); },
            fileCategoryValues: this.get('esraCommonService').getAttachmentCategoryList(),
            fileUploadServiceUrl: Constants.flyOutUrls.fileUploadServiceUrl,
            fileDownloadServiceUrl: Constants.flyOutUrls.fileDownloadServiceUrl,
            isFileDescriptionMandatory: true,
            isFileCategoryMandatory: true,
            isPrivateFileFlagDisplayed: false,
            fileDescriptionMaxLength: 500,
            attachFilesDisabledFlag: false,
            fileList: result,
            showAttachFilesSectionFlag: true,
            fileTypeText: "File format is incorrect for the selected file type. Please check before uploading again."
        });
    },
    validateUploadingFile(selectedFile, attachmentRecord, followupTsk) {
        this.showSnackBarNotification("Validating File");
        let responseObj = Ember.Object.create({ "message": "Validating" });
        let paramVal = this.get('esraCommonService').getParam();
        var requestObject = {
            "dealDocument": {
                "docId": "",
                "dealId": paramVal.dealId,
                "desc": Ember.get(attachmentRecord, "description") || Constants.signoffAttachmentDtl.description,
                "docCategory": Ember.get(attachmentRecord, "fileCategory.categoryType") || Constants.signoffAttachmentDtl.categoryType,
                "overWriteFlag": false,
                "fileName": Ember.get(attachmentRecord, "fileName")
            }
        };
        Ember.Logger.log("requestObject", requestObject, "attachmentRecord", attachmentRecord);
        var url = Constants.flyOutUrls.fileValidationServiceUrl.replace(':deal_Id', requestObject.dealDocument.dealId);
        Ember.$.ajax({
            url: url,
            type: "POST",
            data: JSON.stringify(requestObject),
            processData: false,
            contentType: "application/JSON"
        }).then(function (response) {
            Ember.Logger.log("Ajax Response", response);
            this.get("snackBar").onClose();
            if (!Ember.isEmpty(response) && !Ember.isEmpty(response.dealDocument)) {
                let params = { docId: response.dealDocument.docId };
                this.get('esraCommonService').setDocId(params);
                if (response.dealDocument.overWriteFlag === false) {
                    responseObj.setProperties({
                        success: true,
                        message: "",
                        docId: response.dealDocument.docId
                    });
                    if (Ember.isPresent(followupTsk) && response.dealDocument.docId) {
                        attachmentRecord.set('docId', response.dealDocument.docId);
                        this.get('componentConfig.popUpAttachmentList').pushObject(attachmentRecord);
                        let docId = (response.dealDocument.docId) ? response.dealDocument.docId.toString() : null;
                        followupTsk.get('documents').pushObject(this.fileDetails(attachmentRecord, docId));
                        this.get('esraCommonService.followupTskUploadAttachmentList').push(response.dealDocument.docId.toString());
                    }
                } else {
                    let msg = `The File that you have selected is already available in the document category selected.
                                   Do you want to overwrite the stored document with the file you selected?`;
                    this.mdDialogManager.confirm({
                        cancelButtonLabel: 'CANCEL',
                        confirmButonLabel: 'OVERWRITE',
                        title: 'Overwrite File?',
                        size: "medium",
                        message: msg
                    }).then(() => {
                        requestObject.dealDocument.docId = response.dealDocument.docId;
                        requestObject.dealDocument.overWriteFlag = true;
                        Ember.$.ajax({
                            url: url,
                            type: "POST",
                            data: JSON.stringify(requestObject),
                            processData: false,
                            contentType: "application/JSON"
                        }).then(function (response2) {
                            responseObj.setProperties({
                                success: true,
                                message: "",
                                docId: response2.dealDocument.docId,
                                fileDownloadUrl: Constants.flyOutUrls.fileDownloadServiceUrl.replace('filenetDocId', "filenetDocId =" + response2.dealDocument.docId)
                            });
                            if (Ember.isPresent(followupTsk) && response2.dealDocument.docId) {
                                attachmentRecord.set('docId', response2.dealDocument.docId);
                                if (!followupTsk.get('documents').findBy('docId', response2.dealDocument.docId.toString())) {
                                    this.get('componentConfig.popUpAttachmentList').pushObject(attachmentRecord);
                                    let docId = (response2.dealDocument.docId) ? response2.dealDocument.docId.toString() : null;
                                    followupTsk.get('documents').pushObject(this.fileDetails(attachmentRecord, docId));
                                }
                                this.get('esraCommonService.followupTskUploadAttachmentList').push(response2.dealDocument.docId.toString());
                            }
                        }.bind(this), function (response) {
                            Ember.Logger.log("response2:", response);
                            this.showSnackBarNotification("File Validation service failed");
                            responseObj.setProperties({
                                success: false,
                                message: "File Validation service failed"
                            });
                        }.bind(this));
                    });
                }
            } else {
                Ember.Logger.log("response:", response);
                this.showSnackBarNotification("File Validation service failed");
                responseObj.setProperties({
                    success: false,
                    message: "File Validation service failed"
                });
            }
        }.bind(this), function (response) {
            Ember.Logger.log("response:", response);
            this.showSnackBarNotification("File Validation service failed");
            responseObj.setProperties({
                success: false,
                message: "File Validation service failed"
            });
        }.bind(this));
        return responseObj;
    },
    showSnackBarNotification(message, position = "bottom-left") {
        this.set("snackBar", this.mdSnackBarManager);
        this.get("snackBar").open({
            position: position,
            text: message
        });
    },
    fileDetails(attachmentRecord, docId) {
        return (attachmentRecord) ? {
            "fileName": {
                "name": (Em.get(attachmentRecord, 'fileName.name')) ? Em.get(attachmentRecord, 'fileName.name').split('.').get('firstObject') : (Em.get(attachmentRecord, 'fileName')) ? Em.get(attachmentRecord, 'fileName').split('.').get('firstObject') : null,
                "type": (Em.get(attachmentRecord, 'fileExtension')) ? Em.get(attachmentRecord, 'fileExtension') : (Em.get(attachmentRecord, 'fileName')) ? Em.get(attachmentRecord, 'fileName.type') : null
            },
            "description": Ember.getWithDefault(attachmentRecord, 'description', Constants.signoffAttachmentDtl.description),
            "categoryType": (Em.get(attachmentRecord, 'fileCategory')) ? Em.get(attachmentRecord, 'fileCategory.categoryType') : Em.getWithDefault(attachmentRecord, 'categoryType', Constants.signoffAttachmentDtl.categoryType),
            id: 0,
            docId: docId
        } : {};
    },
    handleFileUploadError(failedAttachment) {
        Ember.Logger.error("File upload failed.");
        Ember.set(failedAttachment, 'isFileUploading', false);
        if (this.get('showAttachmentFlyout') === true) {
            var failedTempAttachmentId = Ember.get(failedAttachment, 'tempAttachmentId');
            var currentFile = this.get('attachedFile');
            if (!Ember.isBlank(currentFile) && failedTempAttachmentId === Ember.get(currentFile, 'tempAttachmentId')) {
                this.set('errorMessage', "File upload failed");
                this.set('attachedFile', null);
            }
        }
        this.set('oldFile', failedAttachment);
        Ember.set(failedAttachment, 'isError', true);
    },
    createAttachmentRecord(selectedFile) {
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(selectedFile.name)[1];
        var userProfile = this.get('wbUserProfile').get('userProfile');
        var uploadedBy = null;
        if (userProfile) {
            uploadedBy = userProfile.get('psId') + " - " + userProfile.get('firstName') + " " + userProfile.get('lastName');
        }
        var uploadedFile = Em.Object.create({
            uploadedDate: (new Date()).getTime(),
            attachmentType: "FILE",
            fileName: selectedFile.name,
            sizeInMb: (selectedFile.size / (1024 * 1024)).toFixed(2),
            fileExtension: ext,
            description: Constants.signoffAttachmentDtl.description,
            categoryType: Constants.signoffAttachmentDtl.categoryType,
            tempAttachmentId: Math.floor(Math.random() * 10000100001),
            isPrivateFile: false,
            percentComplete: "0%",
            uploadedBy: uploadedBy,
            isFileUploadPaused: false,
            selectedFile: selectedFile
        });
        return uploadedFile;
    },
    setErrorMessage(isFileSizeInvalid, isFileTypeInvalid) {
        if (isFileSizeInvalid) {
            this.set("errorMessage", "The size of the file selected is bigger than expected." +
                " Please select file having size less than  50 MB");
        } else if (isFileTypeInvalid) {
            this.set("errorMessage", "The file type you selected is not supported. ");
        }
    },
    actions: {
        handleUploadedFile(selectedFile, isFileSizeInvalid, isFileTypeInvalid) {
            if (isFileSizeInvalid || isFileTypeInvalid) {
                this.setErrorMessage(isFileSizeInvalid, isFileTypeInvalid);
            } else {
                this.set("errorMessage", null);
                var uploadedFile = this.createAttachmentRecord(selectedFile);
                if (Ember.isEmpty(this.get('componentConfig.popUpAttachmentList'))) {
                    this.set('componentConfig.popUpAttachmentList', Em.A([]));
                }
                this.get('validateUploadingFile').call(this, uploadedFile, uploadedFile, this.get('componentConfig.followupTasks'));

            }
        },
        deletePopUpFileAction(file) {
            file.set('deleted', true);
            this.get('componentConfig.popUpAttachmentList').removeObject(file);
            if (this.get('componentConfig.followupTasks.documents')) {
                this.get('componentConfig.followupTasks.documents').forEach((val, key) => {
                    if (val.docId === file.get('docId')) {
                        this.get('componentConfig.followupTasks.documents').removeAt(key);
                    }
                });
            }
        }
    }
});
