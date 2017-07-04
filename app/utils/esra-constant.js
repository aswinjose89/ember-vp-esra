import Ember from 'ember';

let Consts = Ember.Object.extend({
    "templates": {
        "headerTemplate": {
            outlet: 'header-section',
            into: 'application'
        },
        navConfig: Ember.Object.create({
            title: 'FORM SECTIONS',
            additionalInfo: Ember.A([
                {
                    label: 'Activity Status:',
                    componentName: 'wb-md-tag',
                    componentConfig: Ember.Object.create({})
                },
                {
                    label: 'Outcome:',
                    componentName: 'wb-md-tag',
                    componentConfig: Ember.Object.create({})
                }
            ])
        }),
        sideBar() {
            var sidebarObj = {
                outlet: 'sidebar-nav',
                into: 'application'
            };
            return sidebarObj;
        }
    },
    "flyOutUrls": {
        fileValidationServiceUrl: '/api/dealcentre/workspace/document/:deal_Id',
        fileUploadServiceUrl: '/api/esra/upload/:doc_Id',
        fileDownloadServiceUrl: '/api/dealcentre/workspace/document/url?filenetDocId',
        MAX_ATTACHMENT_COUNT: 5
    },
    "flyOutObjects": {
        "attachmentList": {
            "description": null,
            "categoryType": null,
            "uploadedBy": null,
            "uploadedDate": new Date().getTime(),
            "attachmentType": "FILE",
            "fileName": null,
            "fileExtension": null,
            "fileCategory": null,
            downloadLinkUrl: null
        },
        attachmentCategories: [{
            "categoryType": "AD",
            "description": "Approval Documents"
        }, {
            "categoryType": "AWS",
            "description": "Announcements & Write-ups"
        }, {
            "categoryType": "PP",
            "description": "Pitches/Presentations"
        }, {
            "categoryType": "TD",
            "description": "Transaction Documents "
        }, {
            "categoryType": "WF",
            "description": "Working Files"
        }]
    },
    "esraSaveHdrSnackBar": {
        position: 'bottom-left',
        autoCloseTimer: 10000,
        isAutoClose: false,
        text: "Transaction ESRA has been saved successfully with your updates"
    },
    "esraDownloadSnackBar": {
        position: 'bottom-left',
        autoCloseTimer: 10000,
        isAutoClose: false,
        text: "Failed to download the File"
    },
    userSearchConfig: {
        label: 'Assigned To',
        optionValuePath: "psId",
        optionLabelPath: "codeDesc",
        multiple: true,
        required:true,
        pageable: true,
        pageSize: 10,
        searchable: true
    },
    accessControlCode: [
        {
            "code": "0001",
            "desc": "submit"
        },
        {
            "code": "0002",
            "desc": "recall"
        }, {
            "code": "0003",
            "desc": "referback"
        },
        {
            "code": "0004",
            "desc": "approve"
        },
        {
            "code": "0005",
            "desc": "reject"
        },
        {
            "code": "0006",
            "desc": "reopen"
        },
        {
            "code": "0007",
            "desc": "withdraw"
        },
        {
            "code": "0008",
            "desc": "refertoesrm"
        },
        {
            "code": "0009",
            "desc": "assign"
        }
    ],
    reqStatus: [
        Ember.Object.create({ id: 1, status: 'Closed - Transferred to CreditMate' }),
        Ember.Object.create({ id: 2, status: 'Closed - Completed' }),
        Ember.Object.create({ id: 3, status: 'Open - Tracked via WorkBench Action Tasks' })
    ],
    signoffconstant: {
        titles: {
            signoffRq: "Sign Off Requirements",
            signoffAtn: "Sign Off Actions",
            submit: "Submit",
            reopen: "ReOpen",
            refertoesrm: "Refer To ESRM",
            withdraw: "WithDraw",
            recall: "ReCall",
            approve: "Approve",
            reject: "Reject",
            referback: "Refer Back",
            assign: "Assign To Review",
            signoff: {
                refertoesrm: "Assign to ESRM",
                approve: "Approve",
                referback: "Refer Back",
                recall: "Recall",
                complete:"Complete"
            }
        },
        contents: {
            addSignOff: "Add your requirements using the 'ADD' button",
            addFollowupAtn: "Add Sign Off Actions using the 'ADD' button",
            submit: "Transaction ESRA has been successfully submitted for Deal Team Leader review",
            reopen: "You have successfully re-opened the Transaction ESRA",
            refertoesrm: "Transaction ESRA has been referred to ESRM  successfully",
            withdraw: "You have successfully Withdrawn the Transaction ESRA",
            recall: "You have successfully recalled the Transaction ESRA",
            approve: "Transaction ESRA has been approved successfully",
            reject: "You have successfully Rejected the Transaction ESRA",
            referback: "You have successfully Refer Back the Transaction ESRA",
            assign: "Transaction ESRA has been Assigned to Review  successfully",
            signoff: {
                refertoesrm: "Action assigned successfully",
                approve: "Action approved successfully",
                referback: "Action referred back successfully",
                recall: "Action recalled successfully",
                complete: "Action completed successfully"
            }

        },
        label: {
            addBtn: "+ ADD",
            addReqBtn: "+ ADD REQUIREMENT",
            addActionBtn: "+ ADD ACTION",
            dueDate: "Due Date",
            repeat: "Repeat",
            type: "Type",
            reqStatus: "Requirement Status",
            dueDateResp: "Due Date & Responsible Person",
            createdBy: "Created by",
            status: "Status",
            endRepeat: "End Repeat",
            emailReminder: "Email Reminder",
            assignedby: "Assigned By",
            assignedon: "Assigned On",
            completedOn:"Completed on",
            referByESRM:"Refered By",
            esraApproved:"Completed by"
        },
        roleDesc: new Map([
            ["actionowner", "ACTION_OWNER"],
            ["esrmApprover", "ESRA_APPROVER"],
            ["dealTeam", "DEAL_TEAM"]
        ])
    },
    gridFilterRequest: {
        "pagination": {
            "page": 1,
            "size": 10
        },
        "filters": null,
        "sort": null
    },
    dateTime: {
        format: "DD MMM YYYY"
    },
    memberType: new Map([
        ["Y", "CCT"],
        ["N", "Non-CCT"]
    ]),
    routeObjects:new Map([
        ["dealHome", "wb-ui-dealcentre.dealcentre-workspace.deal-documents"],
        ["calendar", "wb-ui-calendar.calendar"],
        ["assessment", "wb-ui-esra.summary.assessment"]
    ]),
    esraAuditTrailTabContent: Ember.A([
        Ember.Object.create({
            "label": "DEAL DETAILS",
            "id": 1
        }),
        Ember.Object.create({
            "label": "ATTACHMENT",
            "id": 2
        }),
        Ember.Object.create({
            "label": "ASSESSMENT",
            "id": 3
        }),
        Ember.Object.create({
            "label": "SIGN OFF",
            "id": 4
        })
    ]),
    esraAuditTrailTableConfig: {
        hideToolbar: true,
        columns: [{
            field: 'fieldName',
            type: 'text',
            title: 'Field Name',
            isPriorityWidth: true
        }, {
            field: 'oldValue',
            type: 'text',
            title: 'Old Value',
            isPriorityWidth: true
        }, {
            field: 'newValue',
            type: 'text',
            title: 'New Value',
            isPriorityWidth: true
        }, {
            field: 'updatedBy',
            type: 'text',
            title: 'Updated By'
        }, {
            field: 'formattedUpdatedOn',
            type: 'text',
            title: 'Updated On'
        }]
    },
    userRole:new Map([
            ['DTL', '0092'],
            ['DTE', '0093'],
            ['ESRM', '0005']
        ]),
        messages:{
            'esrmApprovalMsg':`You are approving this Transaction ESRA. If there are any conditions attached
            to this approval please key them into the Sign Off Requirements screen after you hit Submit below. Please do not use this comments
             box to document sign off conditions.`
        },
    signoffAttachmentDtl: {
        description: 'ESRA - Sign Off requirements document',
        categoryType: 'AD',
        categoryDesc:"Approval Documents"
    },
    signoffReqStatus: {
        closed: 'CLOSED',
        notClosed: 'NOT_CLOSED',
        notStarted: 'NOT_STARTED'
    },
    assessmentStatus: {
        completed: 'COMPLETED',
        notCompleted: 'NOT_COMPLETED',
        notStarted: 'NOT_STARTED'
    }
});

export default Consts.create();
