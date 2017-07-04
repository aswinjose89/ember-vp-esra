import Ember from 'ember';
import detailConfig from '../utils/detail-config';
import Constants from '../utils/esra-constant';
import RouteProgressIndicator from 'wb-ui-core/mixins/route-progress-indicator';

const {
    computed,
    inject
} = Ember;

export default Ember.Component.extend(RouteProgressIndicator, {
    tagName: '',
    esraCommonService: inject.service(),
    esraPicklistService: inject.service(),
    store: inject.service(),
    signoffconstant: Constants.signoffconstant,
    wbUserProfile: Ember.inject.service(),
    signoffreqActionMenu: detailConfig().get('signoffreqActionMenu'),
    toggleTaskIconConfig: detailConfig().get('toggleTaskIconConfig'),
    IsToggleEnabled: false,
    disableReqStatus: computed('signoffActivity', {
        get() {
            let signoffActivity = this.get('signoffActivity');
            return (Em.isEqual(signoffActivity.get('roleDesc').toUpperCase(), this.get('signoffconstant.roleDesc').get('esrmApprover')));
        }
    }),
    signoffOrderIndex: computed('signoffIndex', {
        get() {
            let signoffIndex = this.get('signoffIndex');
            return (signoffIndex + 1);
        }
    }),
    signoffOpenTask: computed('signoffreq.followupTasks.@each.taskStatus', {
        get() {
            let followupTasks = this.get('signoffreq.followupTasks'),
                signoffOpenTask = (followupTasks.get('length') > 0) ? followupTasks.reject(task => ["0002", "0006"].contains(task.get('taskStatus'))) : [],
                signoffOpenTaskCount = (signoffOpenTask.length > 0) ? `${followupTasks.reject(task => ["0002", "0006"].contains(task.get('taskStatus'))).length}  Opened Task` : "-";
            return signoffOpenTaskCount;
        }
    }),
    reqStatusLabel: computed('signoffreq.status', {
        get() {
            let getSignOffStatusTypes = this.get('esraPicklistService').getSignOffStatusTypes(),
                reqStatus = this.get('signoffreq.status');
            return (reqStatus) ? {
                description: Em.getWithDefault(getSignOffStatusTypes.filterBy('code', reqStatus), 'firstObject.description', '-'),
                iconColor: (["0001", "0002"].contains(reqStatus)) ? "green" : "orange"
            } : "-";
        }
    }),
    /**
       * [reqStatus Condition used to check if the followup task is not completed
       *            means DTL couldn't close the requirement status']
       * @param  {[type]} message  [description]
       * @param  {[type]} position [description]
       * @return {[type]}          [description]
       */
    reqStatus: computed('signoffreq.followupTasks.@each.taskStatus', 'signoffActivity', {
        get() {
            let getSignOffStatusTypes = this.get('esraPicklistService').getSignOffStatusTypes(),
                signoffActivity = this.get('signoffActivity'),
                followupTasks = this.get('signoffreq.followupTasks');

            if (followupTasks &&
                followupTasks.filter(task => ["0002", "0006"].contains(task.get('taskStatus'))) &&
                Ember.isEqual(followupTasks.filter(task => ["0002", "0006"].contains(task.get('taskStatus'))).length, followupTasks.get('content').length) &&
                Em.isEqual(signoffActivity.get('roleDesc').toUpperCase(), this.get('signoffconstant.roleDesc').get('dealTeam'))) {
                return getSignOffStatusTypes;
            }
            return (this.get('esraCommonService').isDefined(getSignOffStatusTypes)) ?
                getSignOffStatusTypes.filterBy('code', "0003") :
                getSignOffStatusTypes;
        }
    }),
    reqStatusSelectedVal: computed('signoffreq.status', {
        get() {
            let getSignOffStatusTypes = this.get('esraPicklistService').getSignOffStatusTypes(),
                signoffStatus = this.get('signoffreq.status');

            return (signoffStatus && getSignOffStatusTypes.filterBy('code', signoffStatus).length > 0) ? getSignOffStatusTypes.filterBy('code', signoffStatus).get('firstObject') :
                Em.Object.create({ code: null, description: null });
        }
    }),
    signoffRequirement: computed('signoffModel', {
        get() {
            return this.get('signoffModel');
        }
    }),
    signoffActionHighlight: computed('esraCommonService.taskHighlight', {
        get() {
            let taskHighlight = this.get('esraCommonService.taskHighlight');
            if (taskHighlight && taskHighlight.reqId && Ember.isEqual(taskHighlight.reqId, this.get('signoffreq.signoffId'))) {
                this.set('IsToggleEnabled', true);
            } else {
                this.set('IsToggleEnabled', false);
            }
        }
    }),
    actions: {
        updateSignOffReq() {
            this.sendAction('triggerEditAction', this.get('signoffreq'));
        },
        deleteAction() {
            let config = detailConfig().get('deleteSignoffReq');
            this.get('esraCommonService').modalPopUpManager.call(this, config);
        },
        deleteSignoffReq() {
            var paramVal = this.get('esraCommonService').getParam(),
                esraActivity = this.get('esraCommonService').peekEsraActivity();
            this.get('signoffreq').setProperties({
                deleted: true,
                id: this.get('signoffreq.id'),
                esraActivity: esraActivity
            });
            this.showLoadingIndicator();
            this.get('signoffreq').save({
                adapterOptions: {
                    actionType: 'delete',
                    paramVal
                }
            }).then((success) => {
                if (success.get('isLoaded')) {
                    this.hideLoadingIndicator();
                    if (success.get('deleted')) {
                        success.unloadRecord();
                    }
                }
            });
        },
        deleteFollowupAction() {
            var paramVal = this.get('esraCommonService').getParam(),
                esraActivity = this.get('esraCommonService').peekEsraActivity();
            this.get('signoffreq').set('esraActivity', esraActivity);
            this.showLoadingIndicator();
            this.get('signoffreq').save({
                adapterOptions: {
                    actionType: 'delete',
                    paramVal
                }
            }).then(() => {
                this.hideLoadingIndicator();
            });
        },
        /**
        * [openPopup description]
        * @param  {[type]} message  [description]
        * @param  {[type]} position [description]
        * @return {[type]}          [description]
        */
        openPopup(signoffreq) {
            if (detailConfig().get('signoffPopUpConfig') &&
                detailConfig().get('signoffPopUpConfig').popOver) {
                let config = detailConfig().get('signoffPopUpConfig').secondLevel;
                config.followupTasks = Ember.Object.create({
                    actionRequired: signoffreq.get('requirements'),
                    dueDate: signoffreq.get('dueDate'),
                    repeat: Em.isPresent(signoffreq.get('repeat')) ? signoffreq.get('repeat') : "0000",
                    endRepeat: null,
                    assignedBy: `${this.get('wbUserProfile.userProfile.psId')} - ${this.get('wbUserProfile.userProfile.lastName')} , ${this.get('wbUserProfile.userProfile.firstName')}`,
                    createdBy: `${this.get('wbUserProfile.userProfile.psId')} - ${this.get('wbUserProfile.userProfile.lastName')} , ${this.get('wbUserProfile.userProfile.firstName')}`,
                    assignedDate: null,
                    taskStatus: null,
                    completedDate: null,
                    completionComments: null,
                    confirmedByEsrm: null,
                    docId: null,
                    assignees: Ember.A([]),
                    id: this.get('esraCommonService').randomNum()
                });
                this.get("esraCommonService").popUp.call(this, config, config.followupTasks);
            }
        },
        followupactionAssign(followupAction) {
            this.get('esraCommonService').setSignoffId({ flag: "edit", id: this.get('signoffreq.id') });
            let followActionObj = this.get('store').createRecord('followupTask', {
                "actionRequired": followupAction.get('actionRequired'),
                "dueDate": followupAction.get('dueDate') ? followupAction.get('dueDate') : null,
                "repeat": (Em.isEqual(followupAction.get('repeat'), '0000')) ? null : followupAction.get('repeat'),
                "endRepeat": followupAction.get('endRepeat'),
                "assignedBy": `${this.get('wbUserProfile.userProfile.psId')} - ${this.get('wbUserProfile.userProfile.lastName')} , ${this.get('wbUserProfile.userProfile.firstName')}`,
                "createdBy": `${this.get('wbUserProfile.userProfile.psId')} - ${this.get('wbUserProfile.userProfile.lastName')} , ${this.get('wbUserProfile.userProfile.firstName')}`,
                "assignedDate": null,
                "taskStatus": null,
                "completedDate": null,
                "completionComments": null,
                "confirmedByEsrm": null,
                "deleted": false,
                "docId": null,
                "assignees": followupAction.get('assignees')
            }),
                paramVal = this.get('esraCommonService').getParam(),
                esraActivity = this.get('esraCommonService').peekEsraActivity();
            this.get('signoffreq.followupTasks').pushObject(followActionObj);
            this.set('signoffreq.esraActivity', esraActivity);
            this.showLoadingIndicator();
            this.get('signoffreq').save({
                adapterOptions: {
                    actionType: 'edit',
                    paramVal
                }
            }).then(() => {
                this.hideLoadingIndicator();
                this.get('store').peekAll('followupTask').forEach(record => {
                    if (record.get('isNew')) {
                        record.unloadRecord();
                    }
                });
            });
        }
    }
});
