import Ember from 'ember';
import Constants from './esra-constant';

export default function detailConfig() {
    const esraDetailAtmntRowActions = {
        items: [{
            label: "Edit",
            action: "openAttachmentFlyout",
            iconName: "mode_edit"
        }, {
            label: "Delete",
            action: "deleteFileAction",
            iconName: "delete",
            disabled: false
        }]
    };
    const Config = {
        "headerMenuActionConfig": {
            visibleItems: '2',
            position: "right",
            items: Ember.A([
                Ember.Object.create({
                    componentName: 'wb-md-icon',
                    code: 'auditTrail',
                    config: {
                        iconName: 'insert_invitation',
                        label: 'calendar',
                        color: 'white',
                        action: 'openAuditTrail',
                        helpText: 'Audit Trail'
                    }
                }),
                Ember.Object.create({
                    componentName: 'wb-md-icon',
                    code: 'download',
                    config: {
                        iconName: 'file_download',
                        label: 'Download',
                        color: 'white',
                        action: 'downloadPDF',
                        helpText: 'Download'
                    },
                    groupHeader: 'Group Header'
                })
            ])
        },
        "esraDetailMembersConfig": {
            "tableHeading": 'Team Members',
            "sortable": false,
            "priorityColumns": true,
            "pagable": true,
            "pageType": 'loadmore',
            "pageSize": 10,
            "rowsPerPage": [10, 20, 30],
            "filterable": false,
            "tableEmptyMessage": "No Team Members has found",
            "filterConditions": ["contains", "equal"],
            "columns": [{
                "field": "memberNameDesc",
                "type": "text",
                "title": "Member Name"
            }, {
                "field": "businessArea",
                "type": 'text',
                "title": "Business Area"
            }, {
                "field": "dealTeamRoleDesc",
                "type": 'text',
                "title": "Deal Team Role"
            }, {
                "field": "dealAccessDesc",
                "type": "text",
                "title": "Deal Access"
            }, {
                "field": "memberTypeDesc",
                "type": "text",
                "title": "CCT/Non-CCT"
            }]
        },
        "esraDetailAtmntRowActions": esraDetailAtmntRowActions,
        "esraDetailAtmntConfig": {
            "tableHeading": 'Attachments',
            "hideToolbar": true,
            "pagable": true,
            "pageType": 'loadmore',
            "sortable": false,
            "priorityColumns": true,
            "filterable": false,
            "pageSize": 10,
            "rowsPerPage": [10, 20, 30],
            "filterConditions": ["contains", "equal"],
            "tableEmptyMessage": "Add your first Attachment using the 'ADD' button",
            "rowActions": esraDetailAtmntRowActions,
            "columns": [{
                field: 'fileName',
                type: 'component',
                componentName: 'wb-md-file',
                title: 'File Name',
                action: 'fileDownload'
            }, {
                "field": "description",
                "type": 'text',
                "title": "Description",
                "isPriorityWidth": true
            }, {
                "field": "uploadedBy",
                "type": 'text',
                "title": "Uploaded by"
            }]
        },
        "workflowPopUpConfig": {
            componentName: 'wb-esra-popup',
            message: 'Basic Text Message',
            title: 'Team Information',
            size: 'medium',
            showTopBar: true,
            showActionBar: true,
            buttonLabel: 'OK',
            fieldSection: [{
                field: "comments",
                type: "comment",
                label: "Comments",
                leftIconName: "chat",
                componentName: 'wb-md-input',
                value: "",
                maxLength: 500
            }],
            buttonSection: [{
                action: "closeDialog",
                color: "white",
                type: "primary",
                label: "CANCEL"
            },
            {
                action: "closeDialog",
                color: "blue",
                type: "primary",
                label: "SUBMIT"
            }]
        },
        "submitPopUpConfig": Ember.Object.create({
            componentName: 'wb-esra-popup',
            message: false,
            title: 'Submit for Review',
            size: 'medium',
            showTopBar: true,
            showActionBar: true,
            buttonLabel: 'OK',
            esraAction: 'submit',
            popupActions: 'workflowAlert',
            flag:"submit-approval-route",
            approvalRoute: {
                title: 'Select Approval Route',
                required: true,
                type: "radio",
                action: 'radioAction',
                componentName: 'wb-md-radio-group',
                selectedItem: "dataJSON.headerDataJSON.selectedItem",
                content: [{
                    value: '0001',
                    name: 'Deal Team Leader'
                }, {
                    value: '0002',
                    name: 'ESRM'
                }]
            },
            comments: {
                field: "comments",
                type: "comment",
                required: false,
                componentName: "wb-md-input",
                label: "Enter your comments (optional)",
                leftIconName: "chat",
                value: "dataJSON.headerDataJSON.comment",
                maxLength: 500
            },
            buttonSection: [{
                action: "closeDialogBubbling",
                color: "white",
                type: "primary",
                label: "CANCEL"
            },
            {
                action: "workflowActions",
                color: "blue",
                type: "primary",
                label: "SUBMIT",
                conditionalDisable: true
            }]
        }),
        "recallPopUpConfig": Ember.Object.create({
            componentName: 'wb-esra-popup',
            message: "Are you sure you want to recall the Transaction ESRA?",
            title: 'Recall',
            size: 'medium',
            showTopBar: true,
            showActionBar: true,
            buttonLabel: 'OK',
            popupActions: "workflowActionService",
            esraAction: 'workflowevent',
            comments: {
                field: "comments",
                type: "comment",
                componentName: "wb-md-input",
                label: "Enter your comment",
                required: true,
                leftIconName: "chat",
                value: "",
                maxLength: 500
            },
            buttonSection: [{
                action: "closeDialogBubbling",
                color: "white",
                type: "primary",
                label: "CANCEL"
            },
            {
                action: "workflowActions",
                color: "blue",
                type: "primary",
                label: "RECALL",
                disableoption: true
            }]
        }),
        "refertoesrmPopUpConfig": Ember.Object.create({
            componentName: 'wb-esra-popup',
            message: "Are you sure you want to refer to ESRM?",
            title: 'REFER TO ESRM',
            size: 'medium',
            showTopBar: true,
            showActionBar: true,
            buttonLabel: 'OK',
            popupActions: "workflowActionService",
            esraAction: 'workflowevent',
            comments: {
                field: "comments",
                type: "comment",
                componentName: "wb-md-input",
                label: "Enter your comments (optional)",
                leftIconName: "chat",
                value: "",
                maxLength: 500
            },
            buttonSection: [{
                action: "closeDialogBubbling",
                color: "white",
                type: "primary",
                label: "CANCEL"
            },
            {
                action: "workflowActions",
                color: "blue",
                type: "primary",
                label: "REFER TO ESRM",
                disableoption: false
            }]
        }),
        "assignPopUpConfig": Ember.Object.create({
            componentName: 'wb-esra-popup',
            //message: "Are you sure you want to Assign to Review?",
            title: 'Assign',
            size: 'medium',
            showTopBar: true,
            showActionBar: true,
            buttonLabel: 'OK',
            popupActions: "workflowActionService",
            esraAction: 'workflowevent',
            multiselect: true,
            flag: 'assignee',
            assignee: {
                field: "assignee",
                type: "select",
                searchFlag: 'assignPopUpConfig',
                userSearchConfig: {
                    label: 'Assigned To',
                    optionValuePath: "psId",
                    optionLabelPath: "name",
                    multiple: true,
                    required: true,
                    pageable: true,
                    pageSize: 10,
                    searchable: true
                }
            },
            comments: {
                field: "comments",
                type: "comment",
                componentName: "wb-md-input",
                label: "Enter your comments (optional)",
                leftIconName: "chat",
                required: false,
                value: "",
                maxLength: 500
            },
            buttonSection: [{
                action: "closeDialogBubbling",
                color: "white",
                type: "primary",
                label: "CANCEL"
            },
            {
                action: "workflowActions",
                color: "blue",
                type: "primary",
                label: "ASSIGN",
                disableoption: true
            }]
        }),
        "reopenPopUpConfig": Ember.Object.create({
            componentName: 'wb-esra-popup',
            message: "Are you sure you want to reopen the Transaction ESRA? To progress the activity after reopening it, you will need to resubmit into the approval process",
            title: 'REOPEN',
            size: 'medium',
            showTopBar: true,
            showActionBar: true,
            buttonLabel: 'OK',
            popupActions: "workflowActionService",
            esraAction: 'workflowevent',
            comments: {
                field: "comments",
                type: "comment",
                componentName: "wb-md-input",
                label: "Comments",
                leftIconName: "chat",
                required: true,
                value: "",
                maxLength: 500
            },
            buttonSection: [{
                action: "closeDialogBubbling",
                color: "white",
                type: "primary",
                label: "CANCEL"
            },
            {
                action: "workflowActions",
                color: "blue",
                type: "primary",
                label: "REOPEN",
                disableoption: true
            }]
        }),
        "withdrawPopUpConfig": Ember.Object.create({
            componentName: 'wb-esra-popup',
            message: "Are you sure you want to withdraw the Transaction ESRA? To progress the activity after reopening it, you will need to resubmit into approval process",
            title: 'WITHDRAW',
            size: 'medium',
            showTopBar: true,
            showActionBar: true,
            buttonLabel: 'OK',
            popupActions: "workflowActionService",
            esraAction: 'workflowevent',
            comments: {
                field: "comments",
                type: "comment",
                componentName: "wb-md-input",
                label: "Comments",
                leftIconName: "chat",
                required: true,
                value: "",
                maxLength: 500
            },
            buttonSection: [{
                action: "closeDialogBubbling",
                color: "white",
                type: "primary",
                label: "CANCEL"
            },
            {
                action: "workflowActions",
                color: "blue",
                type: "primary",
                label: "WITHDRAW",
                disableoption: true
            }]
        }),
        "approvePopUpConfig": Ember.Object.create({
            componentName: 'wb-esra-popup',
            message: "You are approving this Transaction ESRA. You may provide comments to describe if any further action is required.",
            title: 'Approve',
            size: 'medium',
            showTopBar: true,
            showActionBar: true,
            buttonLabel: 'OK',
            popupActions: "workflowActionService",
            esraAction: 'workflowevent',
            nonMandatory: false,
            toolbarColor: 'green',
            BRRRC_Enabled: true,
            escalatedBRRRC: {
                title: 'Escalated to BRRRC?',
                required: true,
                type: "radio",
                action: 'radioAction',
                componentName: 'wb-md-radio-group',
                selectedItem: "dataJSON.headerDataJSON.selectedItem",
                content: [{
                    value: 'Y',
                    name: 'Yes'
                }, {
                    value: 'N',
                    name: 'No'
                }]
            },
            comments: {
                field: "comments",
                type: "comment",
                componentName: "wb-md-input",
                label: "Comments",
                leftIconName: "chat",
                required: true,
                value: "",
                maxLength: 500
            },
            buttonSection: [{
                action: "closeDialogBubbling",
                label: "CANCEL"
            },
            {
                action: "workflowActions",
                color: "green",
                type: "primary",
                label: "SUBMIT",
                disableoption: true
            }]
        }),
        "rejectPopUpConfig": Ember.Object.create({
            componentName: 'wb-esra-popup',
            message: "You are Rejecting this Transaction ESRA. Provide your reasons below.",
            title: 'Reject',
            size: 'medium',
            showTopBar: true,
            showActionBar: true,
            buttonLabel: 'OK',
            popupActions: "workflowActionService",
            esraAction: 'workflowevent',
            toolbarColor: 'orange',
            BRRRC_Enabled: true,
            escalatedBRRRC: {
                title: 'Escalated to BRRRC?',
                required: true,
                type: "radio",
                action: 'radioAction',
                componentName: 'wb-md-radio-group',
                selectedItem: "dataJSON.headerDataJSON.selectedItem",
                content: [{
                    value: 'Y',
                    name: 'Yes'
                }, {
                    value: 'N',
                    name: 'No'
                }]
            },
            comments: {
                field: "comments",
                type: "comment",
                componentName: "wb-md-input",
                label: "Comments",
                leftIconName: "chat",
                required: true,
                value: "",
                maxLength: 500
            },
            buttonSection: [{
                action: "closeDialogBubbling",
                label: "CANCEL"
            },
            {
                action: "workflowActions",
                color: "orange",
                type: "primary",
                label: "SUBMIT",
                disableoption: true
            }]
        }),
        "referbackPopUpConfig": Ember.Object.create({
            componentName: 'wb-esra-popup',
            message: "Are you sure you want to refer this request back to Deal Team?",
            title: 'Refer Back',
            size: 'medium',
            showTopBar: true,
            showActionBar: true,
            buttonLabel: 'OK',
            popupActions: "workflowActionService",
            esraAction: 'workflowevent',
            BRRRC_Enabled: true,
            escalatedBRRRC: {
                title: 'Escalated to BRRRC?',
                required: true,
                type: "radio",
                action: 'radioAction',
                componentName: 'wb-md-radio-group',
                selectedItem: "dataJSON.headerDataJSON.selectedItem",
                content: [{
                    value: 'Y',
                    name: 'Yes'
                }, {
                    value: 'N',
                    name: 'No'
                }]
            },
            comments: {
                field: "comments",
                type: "comment",
                componentName: "wb-md-input",
                label: "Enter your comment",
                required: true,
                leftIconName: "chat",
                value: "",
                maxLength: 500
            },
            buttonSection: [{
                action: "closeDialogBubbling",
                color: "white",
                type: "primary",
                label: "CANCEL"
            },
            {
                action: "workflowActions",
                color: "blue",
                type: "primary",
                label: "REFER BACK",
                disableoption: true
            }]
        }),
        "deleteAttachments": {
            message: 'Are you sure you want to delete this file?',
            title: 'Confirm',
            externalFn: true,
            cancelButtonLabel: 'Cancel',
            confirmButonLabel: 'Delete',
            actionHandler: 'deleteAttachedFile'
        },
        "saveDraftConfig": {
            message: "Transaction ESRA has been saved successfully with your updates",
            title: 'Success',
            showTopBar: true,
            showActionBar: true,
            buttonLabel: 'OK'
        },
        "commonAlertConfig": {
            message: null,
            title: 'Success',
            showTopBar: true,
            showActionBar: true,
            buttonLabel: 'OK'
        },
        "commonConfirmConfig": {
            message: null,
            title: 'Confirm',
            externalFn: true,
            confirmButonLabel: 'Yes',
            cancelButtonLabel: 'No',
            actionHandler: 'test'
        },
        "dtlLoginAlertConfig": {
            message: `Deal Team Leader cannot submit and approve their own Transaction ESRA. If this form qualifies for approval by a Deal Team Leader it will be routed to any other Deal Team Leaders named in the Deal Team, however if there are no other Deal Team Leaders it will need to be submitted to ESRM for approval. Do you wish to continue?`,
            title: 'Please Note',
            externalFn: false,
            confirmButonLabel: 'Continue',
            cancelButtonLabel: 'Cancel',
            cancelActionHandler: "goBack"
        },
        "workflowAlertConfig": {
            message: `This is a Compliant form and can be approved by the Deal Team Leader. Do you still wish to submit to ESRM for approval?`,
            title: 'Please Note',
            externalFn: true,
            confirmButonLabel: 'Yes',
            actionHandler: 'workflowActionService',
            cancelButtonLabel: 'No',
            cancelActionHandler: false
        },
        "deleteESRA": {
            message: 'Are you sure you want to delete this Transaction ESRA?',
            title: 'Confirm',
            externalFn: true,
            cancelButtonLabel: 'No',
            confirmButonLabel: 'Yes',
            actionHandler: 'deleteESRA_trans'
        },
        "deleteESRASuccess": {
            message: 'Transaction ESRA deleted successfully',
            title: 'Success',
            externalFn: true,
            showTopBar: true,
            showActionBar: true,
            buttonLabel: 'OK',
            actionHandler: 'deleteESRASuccess_trans'
        },
        "signoffPopUpConfig": {
            componentName: 'wb-esra-popover-popup',
            title: 'Sign Off Requirements',
            size: 'medium',
            showTopBar: true,
            showActionBar: true,
            buttonLabel: 'OK',
            popOver: true,
            esraAction: 'createsignoffReq',
            requirement: {
                field: "requirement",
                type: "comment",
                label: "Requirements",
                leftIconName: "chat",
                value: "",
                required: true,
                maxLength: 500
            },
            dueDate: {
                field: "dueDate",
                type: "datepicker",
                label: "Due Date",
                value: "",
                format: "dd MMM yyyy",
                required: false,
                leftIconName: "event",
                startDate: new Date().getTime()
            },
            type: {
                field: "type",
                type: "select",
                label: "Type",
                value: "",
                optionValuePath: "code",
                optionLabelPath: "description"
            },
            repeat: {
                field: "repeat",
                type: "select",
                label: "Repeat Every",
                value: "",
                optionValuePath: "code",
                optionLabelPath: "description"
            },
            buttonSection: [{
                action: "closeDialog",
                color: "white",
                type: "primary",
                label: "CANCEL"
            },
            {
                action: "createSignOffReq",
                disableoption: true,
                color: "blue",
                type: "primary",
                label: "DONE"
            }],
            secondLevel: Ember.Object.create({
                componentName: 'wb-esra-popup',
                title: 'Add Signoff Action',
                size: 'medium',
                showTopBar: true,
                showActionBar: true,
                buttonLabel: 'OK',
                popOver: true,
                esraAction: 'createsignoffTask',
                popupActions: 'followupactionAssign',
                atnReq: {
                    field: "atnReq",
                    type: "comment",
                    label: "Action Required",
                    leftIconName: "chat",
                    value: "",
                    required: true,
                    maxLength: 500
                },
                dueDate: {
                    field: "dueDate",
                    type: "datepicker",
                    label: "Due Date",
                    value: "",
                    format: "dd MMM yyyy",
                    required: true,
                    leftIconName: "event",
                    startDate: new Date().getTime()
                },
                repeat: {
                    field: "repeat",
                    type: "select",
                    label: "Repeat",
                    value: "",
                    optionValuePath: "code",
                    optionLabelPath: "description",
                    changeAction:"changeTaskRepeat"
                },
                endRepeat: {
                    field: "endRepeat",
                    type: "datepicker",
                    label: "End Repeat",
                    value: "",
                    format: "dd MMM yyyy",
                    leftIconName: "event",
                    required: false
                },
                buttonSection: [{
                    action: "closeDialogBubbling",
                    color: "white",
                    type: "primary",
                    label: "CANCEL"
                },
                {
                    action: "followupactionAssign",
                    color: "blue",
                    type: "primary",
                    label: "ASSIGN",
                    disableoption: true
                }]
            })
        },
        gridFilterConfig: {
            "pagination": {
                "page": 1,
                "size": 10
            }
        },
        "actionMenuDealHeader": Ember.Object.create({
            triggerElement: Ember.Object.create({
                componentName: 'wb-md-button',
                config: Ember.Object.create({
                    label: 'action',
                    color: 'white',
                    type: 'primary'
                })
            }),
            items: Ember.A([
                Ember.Object.create({
                    iconName: 'check',
                    label: 'Approve',
                    action: "workflowAction",
                    actionControl: "approveEnabled",
                    actionParam: 'approve'
                }),
                Ember.Object.create({
                    iconName: 'close',
                    label: 'Reject',
                    action: 'workflowAction',
                    actionControl: "rejectEnabled",
                    actionParam: 'reject'
                }),
                Ember.Object.create({
                    iconName: 'replay',
                    label: 'Refer Back',
                    action: 'workflowAction',
                    actionControl: "referBackEnabled",
                    actionParam: 'referback'
                }),
                Ember.Object.create({
                    iconName: 'folder_open',
                    label: 'Reopen',
                    action: 'workflowAction',
                    actionControl: "reopenEnabled",
                    actionParam: 'reopen'
                }),
                Ember.Object.create({
                    iconName: 'phone',
                    label: 'Recall',
                    action: 'workflowAction',
                    actionControl: "recallEnabled",
                    actionParam: 'recall'
                }),
                Ember.Object.create({
                    iconName: 'replay',
                    label: 'WithDraw',
                    action: 'workflowAction',
                    actionControl: "withdrawEnabled",
                    actionParam: 'withdraw'
                }),
                Ember.Object.create({
                    iconName: 'assignment_turned_in',
                    label: 'Refer To ESRM',
                    action: 'workflowAction',
                    actionControl: "referToESRMEnabled",
                    actionParam: 'refertoesrm'
                }),
                Ember.Object.create({
                    iconName: 'assignment_turned_in',
                    label: 'Assign',
                    action: 'workflowAction',
                    actionControl: "assignToReviewEnabled",
                    actionParam: 'assign'
                })
            ])
        }),
        followupActionMenu: Ember.Object.create({
            items: Ember.A([
                Ember.Object.create({
                    iconName: 'people',
                    label: 'Assign to ESRM',
                    action: 'workflowAction',
                    actionControl: "referToESRMEnabled",
                    windowBox: "POPUP",
                    actionParam: 'refertoesrm',
                    actionCode: "0003",
                    entitlement: 'refertoesrm'
                }),
                Ember.Object.create({
                    iconName: 'done',
                    label: 'Complete',
                    action: 'workflowAction',
                    actionParam: 'complete',
                    windowBox: "POPUP",
                    actionCode: "0002",
                    entitlement: 'complete'
                }),
                Ember.Object.create({
                    iconName: 'edit',
                    label: 'Edit',
                    action: 'updateSignoffAction',
                    actionControl: "editSignoffTaskEnabled",
                    entitlement: 'edit'
                }),
                Ember.Object.create({
                    iconName: 'live_feed',
                    label: 'Set Email Reminder',
                    action: 'emailReminderPopUp',
                    actionParam: 'emailreminder',
                    entitlement: 'emailreminder'
                }),
                Ember.Object.create({
                    iconName: 'delete',
                    label: 'Delete',
                    action: 'deleteAction',
                    actionControl: "deleteSignoffTaskEnabled",
                    entitlement: 'delete'
                }),
                Ember.Object.create({
                    iconName: 'check',
                    label: 'Approve/Complete',
                    action: 'workflowAction',
                    windowBox: "POPUP",
                    actionControl: "approveEnabled",
                    actionParam: 'approve',
                    actionCode: "0006",
                    entitlement: 'approve'
                })
                // Ember.Object.create({
                //     iconName: 'replay',
                //     label: 'Refer Back',
                //     action: 'workflowAction',
                //     windowBox: "POPUP",
                //     actionControl: "referBackEnabled",
                //     actionParam: 'referback',
                //     actionCode: "0001",
                //     entitlement: 'referback'
                // }),
                // Ember.Object.create({
                //     iconName: 'replay',
                //     label: 'Recall',
                //     action: 'workflowAction',
                //     windowBox: "POPUP",
                //     actionControl: "recallEnabled",
                //     actionParam: 'recall',
                //     actionCode: "0004",
                //     entitlement: 'recall'
                // })
            ])
        }),
        signoffreqActionMenu: Ember.Object.create({
            items: Ember.A([
                Ember.Object.create({
                    iconName: 'edit',
                    label: 'Edit',
                    action: 'updateSignOffReq',
                    actionControl: "editSignoffReqEnabled"
                }),
                Ember.Object.create({
                    iconName: 'delete',
                    label: 'Delete',
                    action: 'deleteAction',
                    actionControl: "deleteSignoffReqEnabled"
                })
            ])
        }),
        "deleteSignoffReq": {
            message: 'Are you sure you want to delete this Signoff Requirement?',
            title: 'Confirm',
            externalFn: true,
            cancelButtonLabel: 'Cancel',
            confirmButonLabel: 'Delete',
            actionHandler: 'deleteSignoffReq'
        },
        "deleteFollowupTask": {
            message: 'Are you sure you want to delete this Signoff Action?',
            title: 'Confirm',
            externalFn: true,
            cancelButtonLabel: 'Cancel',
            confirmButonLabel: 'Delete',
            actionHandler: 'deleteFollowupAction'
        },
        "signoffActionStatus": Ember.Object.create({
            label: Constants.signoffconstant.label.status,
            component: Ember.Object.create({
                name: 'wb-md-tag',
                config: Ember.Object.create({
                    label: "Status",
                    color: "gray"
                })
            })
        }),
        "signoffCompleteConfig": Ember.Object.create({
            message: "You are confirming the closure of the Sign Off task. Do you wish to proceed? This action cannot be reversed.",
            title: 'Confirm closure of the Sign Off Action?',
            // externalFn: true,
            // cancelButtonLabel: 'CANCEL',
            // confirmButonLabel: 'PROCEED',
            // actionHandler: 'signoffWorkflowActionService',
            // cancelActionHandler: 'signoffWorkflowActionCancel'
            size: 'medium',
            showTopBar: true,
            showActionBar: true,
            buttonLabel: 'OK',
            esraAction: 'signoffworkflowevent',
            multiselect: false,
            simultaneousButtons: true,
            comments: {
                field: "comments",
                type: "comment",
                componentName: "wb-md-input",
                label: "Comments",
                leftIconName: "chat",
                required: true,
                value: "",
                maxLength: 300
            },
            "deleteAttachments": {
                message: 'Are you sure you want to delete this file?',
                title: 'Confirm',
                externalFn: true,
                cancelButtonLabel: 'Cancel',
                confirmButonLabel: 'Delete',
                actionHandler: 'deleteAttachedFile'
            },
            fileAttachment: {
                isAttachment: true,
            },
            buttonSection: [{
                action: "handleUploadedFile",
                color: "gray",
                positionClass: "content-toolbar__element pull-left",
                isAttachment: true,
                maxSize: 20000,
                iconName: "attach_file",
                placeHolder: "PLEASE SELECT FILE",
                label: "CANCEL"
            },
            {
                action: "signoffWorkflowActions",
                color: "blue",
                type: "primary",
                label: "COMPLETE",
                disableoption: true
            }, {
                action: "closeDialogBubbling",
                color: "gray",
                type: "secondary",
                label: "CANCEL"
            }
            ]
        }),
        "signoffRefertoesrmConfig": Ember.Object.create({
            componentName: 'wb-esra-popup',
            title: 'Assign to ESRM',
            size: 'medium',
            showTopBar: true,
            showActionBar: true,
            buttonLabel: 'OK',
            esraAction: 'signoffworkflowevent',
            multiselect: true,
            flag: 'assigneetoesrm',
            simultaneousButtons: true,
            deleteAttachments: {
                message: 'Are you sure you want to delete this file?',
                title: 'Confirm',
                externalFn: true,
                cancelButtonLabel: 'Cancel',
                confirmButonLabel: 'Delete',
                actionHandler: 'deleteAttachedFile'
            },
            fileAttachment: {
                isAttachment: true,
            },
            assignee: {
                field: "assignee",
                type: "select",
                userSearchConfig: {
                    label: 'Assigned To',
                    optionValuePath: "psId",
                    optionLabelPath: "name",
                    multiple: true,
                    required: true,
                    readonly: true
                },
            },
            comments: {
                field: "comments",
                type: "comment",
                componentName: "wb-md-input",
                label: "Enter your comments",
                leftIconName: "chat",
                required: true,
                value: "",
                maxLength: 300
            },
            buttonSection: [
                {
                    action: "handleUploadedFile",
                    color: "gray",
                    positionClass: "content-toolbar__element pull-left",
                    isAttachment: true,
                    maxSize: 20000,
                    iconName: "attach_file",
                    placeHolder: "PLEASE SELECT FILE"
                },
                {
                    action: "signoffWorkflowActions",
                    color: "blue",
                    type: "primary",
                    label: "Assign",
                    disableoption: true
                },
                {
                    action: "closeDialogBubbling",
                    color: "white",
                    type: "primary",
                    label: "CANCEL"
                }]
        }),
        "signoffApproveConfig": Ember.Object.create({
            componentName: 'wb-esra-popup',
            message: "You are confirming the approval / closure of the Sign Off task. Do you wish to proceed? This action cannot be reversed.",
            title: 'Confirm approval / closure of the Sign Off Action?',
            size: 'medium',
            showTopBar: true,
            showActionBar: true,
            toolbarColor: 'green',
            buttonLabel: 'OK',
            esraAction: 'signoffworkflowevent',
            simultaneousButtons: true,
            deleteAttachments: {
                message: 'Are you sure you want to delete this file?',
                title: 'Confirm',
                externalFn: true,
                cancelButtonLabel: 'Cancel',
                confirmButonLabel: 'Delete',
                actionHandler: 'deleteAttachedFile'
            },
            fileAttachment: {
                isAttachment: true,
            },
            comments: {
                field: "comments",
                type: "comment",
                componentName: "wb-md-input",
                label: "Enter your comments (optional)",
                leftIconName: "chat",
                value: "",
                maxLength: 500
            },
            buttonSection: [
                {
                    action: "handleUploadedFile",
                    color: "gray",
                    positionClass: "content-toolbar__element pull-left",
                    isAttachment: true,
                    maxSize: 20000,
                    iconName: "attach_file",
                    placeHolder: "PLEASE SELECT FILE",
                    label: "CANCEL"
                },
                {
                    action: "signoffWorkflowActions",
                    color: "green",
                    type: "primary",
                    label: "SUBMIT",
                    disableoption: false
                },
                {
                    action: "closeDialogBubbling",
                    color: "white",
                    type: "primary",
                    label: "CANCEL"
                }]
        }),
        "signoffEmailreminderConfig": Ember.Object.create({
            componentName: 'wb-esra-popup',
            title: 'Set Email Reminder',
            size: 'medium',
            showTopBar: true,
            showActionBar: true,
            buttonLabel: 'OK',
            popupActions: "emailReminderAction",
            esraAction: 'emailReminder',
            simultaneousButtons: true,
            dueDate: {
                field: "dueDate",
                type: "datepicker",
                label: "Reminder Date",
                value: "",
                format: "dd MMM yyyy",
                required: false,
                leftIconName: "event",
                startDate: new Date().getTime()
            },
            buttonSection: [
                {
                    action: "emailReminderAction",
                    color: "blue",
                    type: "primary",
                    label: "DONE",
                    disableoption: false
                },
                {
                    action: "closeDialogBubbling",
                    color: "grey",
                    type: "secondary",
                    label: "CANCEL"
                },
                {
                    action: "clearEmailReminder",
                    color: "grey",
                    type: "secondary",
                    positionClass: "content-toolbar__element pull-left",
                    label: "CLEAR REMINDER"
                }]
        }),
        "signoffReferbackConfig": Ember.Object.create({
            componentName: 'wb-esra-popup',
            message: "You are Referring Back this Transaction ESRA to your Team for further editing.You may provide comments to describe what action is required.",
            title: 'Refer Back',
            size: 'medium',
            showTopBar: true,
            showActionBar: true,
            buttonLabel: 'OK',
            popupActions: "signoffWorkflowActionService",
            esraAction: 'signoffworkflowevent',
            comments: {
                field: "comments",
                type: "comment",
                componentName: "wb-md-input",
                label: "Comments *",
                leftIconName: "chat",
                value: "",
                maxLength: 500
            },
            buttonSection: [{
                action: "closeDialogBubbling",
                color: "white",
                type: "primary",
                label: "CANCEL"
            },
            {
                action: "signoffWorkflowActions",
                color: "gray",
                type: "primary",
                label: "SUBMIT",
                disableoption: true
            }]
        }),
        "signoffRecallConfig": Ember.Object.create({
            componentName: 'wb-esra-popup',
            message: "You are Recalling this Transaction ESRA to your Team for further editing.You may provide comments to describe what action is required.",
            title: 'Recall',
            size: 'medium',
            showTopBar: true,
            showActionBar: true,
            buttonLabel: 'OK',
            popupActions: "signoffWorkflowActionService",
            esraAction: 'signoffworkflowevent',
            comments: {
                field: "comments",
                type: "comment",
                componentName: "wb-md-input",
                label: "Comments *",
                leftIconName: "chat",
                required: true,
                value: "",
                maxLength: 500
            },
            buttonSection: [{
                action: "closeDialogBubbling",
                color: "white",
                type: "primary",
                label: "CANCEL"
            },
            {
                action: "signoffWorkflowActions",
                color: "gray",
                type: "primary",
                label: "SUBMIT",
                disableoption: true
            }]
        }),
        errorValidation: {
            message: 'Please fill up all the mandatory fields',
            title: 'Error',
            externalFn: true,
            cancelButtonLabel: 'Cancel',
            confirmButonLabel: 'Ok',
            actionHandler: 'errorRouteHandler'
        },
        goBackConfig: {
            cancelButtonLabel: 'No',
            confirmButonLabel: 'Yes',
            title: 'Do you want to exit?',
            message: "Your updates will not be saved, Are you sure you want to exit?",
            externalFn: true,
            actionHandler: 'backToDeal'
        },
        tabsSwitchDirtyConfig: {
            cancelButtonLabel: 'No',
            confirmButonLabel: 'Yes',
            title: 'Do you want to exit?',
            message: "Your updates will not be saved, Are you sure you want to exit?",
            externalFn: true,
            actionHandler: 'proceedRouteAction',
            cancelActionHandler: 'cancelRouteAction'
        },
        detailErrorValidation: {
            message: "Please fill up the mandatory field",
            title: 'Error',
            showTopBar: true,
            showActionBar: true,
            buttonLabel: 'OK'
        },
        toggleTaskIconConfig: {
            visibleItems: '0',
            toggleElement: {
                iconDefault: 'unfold_more',
                iconAlternative: 'unfold_less'
            }
        }
    };
    return {
        get: function (option) {
            return Config[option];
        }
    };
}
