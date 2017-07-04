import Ember from 'ember';
import detailConfig from '../utils/detail-config';
import Constants from '../utils/esra-constant';
import RouteProgressIndicator from 'wb-ui-core/mixins/route-progress-indicator';
import EmberValidations from 'ember-validations';

export default Ember.Component.extend(RouteProgressIndicator,EmberValidations, {
    tagName: '',
    componentConfig: Ember.computed.reads('config.componentConfig'),
    esraCommonService: Ember.inject.service(),
    esraPicklistService: Ember.inject.service(),
    signoffconstant: Constants.signoffconstant,
    store: Ember.inject.service(),
    wbUserProfile: Ember.inject.service(),
    signoffModel: Em.computed.reads('config.componentConfig.signoffModel'),
    signoffType: Ember.computed({
        get() {
            return this.get('esraPicklistService').getSignOffTypes();
        }
    }),
    signoffRepeat: Ember.computed({
        get() {
            return this.get('esraPicklistService').getSignOffRepeats();
        }
    }),
    signoffReqRepeat: Ember.computed({
        get() {
            return this.get('esraPicklistService').getSignOffRepeats();
        }
    }),
    validations: {
        'signoffModel.requirements': {
            presence: true
        }
    },
    isButtonInValid: Ember.computed.not('isValid', function () {
        return (Ember.isEqual(this.get('isDirty'), true)) ? this.get('isValid') : true;
    }),
    actions: {
        closeDialog() {
            this.get('config.onClose').call(...this.get('config.callbackContext'));
        },
        /**
        * [openPopup description]
        * @param  {[type]} message  [description]
        * @param  {[type]} position [description]
        * @return {[type]}          [description]
        */
        openPopup(signoffModel) {
            if (detailConfig().get('signoffPopUpConfig') &&
                detailConfig().get('signoffPopUpConfig').popOver) {
                let config = detailConfig().get('signoffPopUpConfig').secondLevel,
                    userDetail = this.get('esraCommonService').userDetails();
                config.followupTasks = Ember.Object.create({
                    actionRequired: signoffModel.requirements,
                    dueDate: signoffModel.dueDate,
                    repeat: null,
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
        /**
       * [updateSignoffAction description]
       * @param  {[type]} message  [description]
       * @param  {[type]} position [description]
       * @return {[type]}          [description]
       */
        updateSignoffAction(signoffModel) {
            if (detailConfig().get('signoffPopUpConfig') &&
                detailConfig().get('signoffPopUpConfig').popOver) {
                let config = detailConfig().get('signoffPopUpConfig').secondLevel;
                config.followupTasks = "";
                this.get("esraCommonService").popUp.call(this, config, config.followupTasks);
                Ember.Logger.log('signoffModel:', signoffModel);
            }
        },
        /**
       * [createSignOffReq description]
       * @param  {[type]} message  [description]
       * @param  {[type]} position [description]
       * @return {[type]}          [description]
       */
        createSignOffReq(signoffModel) {
            var paramVal = this.get('esraCommonService').getParam(),
                esraActivity = this.get('esraCommonService').peekEsraActivity();
            if (Ember.isEqual(this.get('componentConfig.action'), 'create')) {
                let followupTask = signoffModel.followupTasks,
                    signoffModelArray = Ember.A([]),
                    createSignOffReq = {
                        requirements: signoffModel.get('requirements'),
                        dueDate: (signoffModel.get('dueDate')) ? signoffModel.get('dueDate') : null,
                        type: signoffModel.get('type'),
                        repeat: (Em.isEqual(signoffModel.get('repeat'), '0000')) ? null : signoffModel.get('repeat'),
                        status: "", //UAT DEFECT FIX 
                        signoffVersion: 1,
                        signoffId: null,
                        id: this.get('esraCommonService').randomNum(),
                        esraActivity
                    };

                if (followupTask) {
                    createSignOffReq.followupTasks = followupTask;
                }
                this.showLoadingIndicator();
                this.get('store').createRecord('signoffDetail', createSignOffReq).save({
                    adapterOptions: {
                        actionType: this.get('componentConfig.action'),
                        paramVal

                    }
                }).then((success) => {
                    if (success.get('isLoaded')) {
                        this.hideLoadingIndicator();
                        if (success.get('deleted')) {
                            success.unloadRecord();
                        }
                        this.get('store').peekAll('followupTask').forEach(record => {
                            if (record.get('isNew') || record.get('deleted')) {
                                record.unloadRecord();
                            }
                        });
                        var selfSignOff = this.get("esraCommonService").getSignoffReq();
                        if (this.get("esraCommonService").isDefined(selfSignOff.signoffModel) &&
                            selfSignOff.get('signoffModel.content').length > 0) {
                            selfSignOff.signoffModel.pushObject(success);
                        }
                        else {
                            signoffModelArray.pushObject(success);
                            selfSignOff.set('signoffModel', signoffModelArray);
                        }
                    }
                });
            }
            else if (Ember.isEqual(this.get('componentConfig.action'), 'edit')) {
                let paramVal = this.get('esraCommonService').getParam();
                this.get('esraCommonService').setSignoffId({ flag: "edit", id: signoffModel.id });
                this.get('componentConfig.signoffreq').set('requirements', signoffModel.requirements);
                this.get('componentConfig.signoffreq').set('dueDate', signoffModel.dueDate);
                this.get('componentConfig.signoffreq').set('type', signoffModel.type);
                this.get('componentConfig.signoffreq').set('repeat',(Em.isEqual(signoffModel.repeat, '0000')) ? null : signoffModel.repeat);
                this.get('componentConfig.signoffreq').set('status', signoffModel.status);
                this.get('componentConfig.signoffreq').set('esraActivity', (signoffModel.esraActivity) ?
                    signoffModel.esraActivity : esraActivity);
                this.showLoadingIndicator();
                signoffModel.get('followupTasks').forEach(val => {
                    val.send('becomeDirty');
                });
                this.get('componentConfig.signoffreq').save({
                    adapterOptions: {
                        actionType: this.get('componentConfig.action'),
                        paramVal
                    }
                }).then((success) => {
                    if (success.get('isLoaded')) {
                        this.hideLoadingIndicator();
                        this.get('store').peekAll('followupTask').forEach(record => {
                            if (record.get('hasDirtyAttributes') || record.get('deleted')) {
                                record.unloadRecord();
                            }
                        });
                    }
                });
            }
            this.send('closeDialog');
        },
        /**
       * [followupactionAssign description]
       * @param  {[type]} message  [description]
       * @param  {[type]} position [description]
       * @return {[type]}          [description]
       */
        followupactionAssign(followupAction) {
            let createTask = null;
            if (followupAction) {
                createTask = this.get('store').createRecord('followupTask', {
                    actionRequired: followupAction.get('actionRequired'),
                    dueDate: followupAction.get('dueDate') ? followupAction.get('dueDate') : null,
                    repeat: followupAction.get('repeat'),
                    endRepeat: followupAction.get('endRepeat'),
                    assignedBy: followupAction.get('assignedBy'),
                    createdBy: followupAction.get('createdBy'),
                    assignedDate: null,
                    taskStatus: null,
                    completedDate: null,
                    completionComments: null,
                    confirmedByEsrm: null,
                    docId: null,
                    assignees: followupAction.get('assignees')
                });
            }
            if (this.get('componentConfig.signoffModel.followupTasks')) {
                this.get('componentConfig.signoffModel.followupTasks').pushObject(createTask);
            }
            else {
                let followupTasks = Ember.A([]);
                followupTasks.pushObject(createTask);
                this.get('componentConfig.signoffModel').set('followupTasks', followupTasks);
            }
        }
    }
});
