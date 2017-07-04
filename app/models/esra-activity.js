import DS from 'ember-data';
import detailConfig from '../utils/detail-config';
import Ember from 'ember';
import Constants from '../utils/esra-constant';

const {
    inject,
    computed,
    isEqual,
    Object
} = Ember;

export default DS.Model.extend({
    esraCommonService: inject.service(),
    status: DS.attr('string'),
    outcome: DS.attr('string'),
    version: DS.attr('string'),
    readOnly: DS.attr('boolean'),
    saveEnabled: DS.attr('string'),
    saveDraftEnabled: DS.attr('string'),
    submitEnabled: DS.attr('string'),
    recallEnabled: DS.attr('string'),
    approveEnabled: DS.attr('string'),
    rejectEnabled: DS.attr('string'),
    referBackEnabled: DS.attr('string'),
    withdrawEnabled: DS.attr('string'),
    reopenEnabled: DS.attr('string'),
    deleteEnabled: DS.attr('string'),
    referToESRMEnabled: DS.attr('string'),
    assignToReviewEnabled: DS.attr('string'),
    persistedApprovalRoute: DS.attr('string'),
    persistedDecision: DS.attr('string'),
    locked: DS.attr('boolean'),
    lockMessage: DS.attr('string'),
    userRole: DS.attr('string'),
    userAccess: DS.attr('string'),
    esrmRouteOnly: DS.attr('boolean'),
    workflowHistoryEnabled: DS.attr('boolean', {
        defaultValue: false
    }),
    allSignoffReqCompleted: DS.attr('string'),
    assessmentCompleted: DS.attr('string'),
    statusDesc: computed('status', {
        get() {
            return this.get('esraCommonService').statusDesc(this.get('status'));
        }
    }),
    outcomeDesc: computed('outcome', {
        get() {
            return this.get('esraCommonService').outComeDesc(this.get('outcome'));
        }
    }),
    statusColor: computed('status', {
        get() {
            return this.get('esraCommonService').statusColor(this.get('status'));
        }
    }),
    outcomeColor: computed('outcome', {
        get() {
            return this.get('esraCommonService').outComeColor(this.get('outcome'));
        }
    }),
    IsDisableRecall: computed('recallEnabled', {
        get() {
            return isEqual(this.get('recallEnabled'), 'V');
        }
    }),
    IsDisableWithdraw: computed('withdrawEnabled', {
        get() {
            return isEqual(this.get('withdrawEnabled'), 'V');
        }
    }),
    IsDisableReopen: computed('reopenEnabled', {
        get() {
            return isEqual(this.get('reopenEnabled'), 'V');
        }
    }),
    IsDisableReferToESRM: computed('referToESRMEnabled', {
        get() {
            return isEqual(this.get('referToESRMEnabled'), 'V');
        }
    }),
    IsDisableAssignToReview: computed('assignToReviewEnabled', {
        get() {
            return isEqual(this.get('assignToReviewEnabled'), 'V');
        }
    }),
    IsDisableApprove: computed('approveEnabled', {
        get() {
            return isEqual(this.get('approveEnabled'), 'V');
        }
    }),
    IsDisableReject: computed('rejectEnabled', {
        get() {
            return isEqual(this.get('rejectEnabled'), 'V');
        }
    }),
    IsDisableReferBack: computed('referBackEnabled', {
        get() {
            return isEqual(this.get('referBackEnabled'), 'V');
        }
    }),
    actionMenuDealHeader: computed(
        'recallEnabled',
        'approveEnabled',
        'rejectEnabled',
        'referBackEnabled',
        'withdrawEnabled',
        'reopenEnabled',
        'referToESRMEnabled',
        'assignToReviewEnabled', {
            get() {
                let actionMenuDealHeader = detailConfig().get('actionMenuDealHeader'),
                    esraActivity = Object.create({}),
                    menuItems;
                esraActivity.setProperties({
                    "recallEnabled": this.get('recallEnabled'),
                    "approveEnabled": this.get('approveEnabled'),
                    "rejectEnabled": this.get('rejectEnabled'),
                    "referBackEnabled": this.get('referBackEnabled'),
                    "withdrawEnabled": this.get('withdrawEnabled'),
                    "reopenEnabled": this.get('reopenEnabled'),
                    "referToESRMEnabled": this.get('referToESRMEnabled'),
                    "assignToReviewEnabled": this.get('assignToReviewEnabled')
                });
                menuItems = actionMenuDealHeader.items.map(item => {
                    if (isEqual(esraActivity.get(item.actionControl).toUpperCase(), "E")) {
                        return item;
                    }
                    else if (isEqual(esraActivity.get(item.actionControl).toUpperCase(), "V")) {
                        item.set('isDisabled', true);
                        return item;
                    }
                    return null;
                }).compact();
                actionMenuDealHeader.set('items', menuItems);
                return actionMenuDealHeader;
            }
        }),
    versionUpdate: computed('version', function () {
        let paramVal = this.get('esraCommonService').getParam();
        paramVal.version = this.get('version');
    }),
    isAttachmentDisabled: computed('readOnly', 'userRole', 'status', function () {
        let readOnly = this.get('readOnly'),
            userRole = (this.get('userRole')) ? this.get('userRole') : null,
            userRoleDtl = this.get('esraCommonService.userRoleDtl')(),
            status = (this.get('status')) ? this.get('status') : null,
            dtlOutcome = ["0002", "0005"], esrmOutcome = ["0003", "0005"], dteOutcome = ["0005"];
        if (readOnly) {
            return !((Em.isEqual(userRole, userRoleDtl.get('DTL')) && dtlOutcome.contains(status))
                || (Em.isEqual(userRole, userRoleDtl.get('ESRM')) && esrmOutcome.contains(status))
                || (Em.isEqual(userRole, userRoleDtl.get('DTE')) && dteOutcome.contains(status)));
        }
        return readOnly;
    }),
    assessmentStatus: computed('assessmentCompleted', {
        get() {
            let status = this.get('assessmentCompleted');
            if (Ember.isEqual(status, Constants.assessmentStatus.completed)) {
                return 'complete';
            } else if (Ember.isEqual(status, Constants.assessmentStatus.notCompleted)) {
                return 'error';
            } else {
                return null;
            }
        }
    }),
    signoffReqStatus: computed('allSignoffReqCompleted', {
        get() {
            let status = this.get('allSignoffReqCompleted');
            let value = Ember.isEqual(status, Constants.signoffReqStatus.closed) ? 'complete' : Ember.isEqual(status, Constants.signoffReqStatus.notClosed) ? 'error' : null;
            return value;
        }
    })
});
