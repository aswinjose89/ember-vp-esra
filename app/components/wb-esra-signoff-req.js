import Ember from 'ember';
import detailConfig from '../utils/detail-config';
import Constants from '../utils/esra-constant';
import esraMixin from '../mixins/wb-esra-mixin';

const {
    computed,
    inject
} = Ember;

export default Ember.Component.extend(esraMixin, {
    tagName: '',
    esraCommonService: inject.service(),
    esraPicklistService: inject.service(),
    store: inject.service(),
    signoffconstant: Constants.signoffconstant,
    signoffreqActionMenu: detailConfig().get('signoffreqActionMenu'),
    signoffRequirement: computed('signoffModel', {
        get() {
            return this.get('signoffModel');
        }
    }),
    esraActivity: computed({
        get() {
            return this.trigger('esraActivityPeekRecord');
        }
    }),
    signoffDraftSaveDisable: Ember.computed('signoffModel.@each.hasDirtyAttributes', {
        get() {
            if (this.get('signoffModel').filterBy('hasDirtyAttributes', true).length) {
                this.get('esraCommonService').set('disableSaveDraft', false);
                this.get('signoffModel').set('saveDraftDisable', false);
            } else {
                this.get('esraCommonService').set('disableSaveDraft', true);
                this.get('signoffModel').set('saveDraftDisable', true);
            }
        }
    }),
    didRender() {
        Ember.run.scheduleOnce('afterRender', this, function () {
            let taskHighlight = this.get('esraCommonService.taskHighlight');
            if (taskHighlight && taskHighlight.taskId) {
                let highlight = Ember.$('#task-highlight-' + taskHighlight.taskId);
                if (highlight && highlight.get(0)) {
                    highlight.get(0).scrollIntoView(true);
                }
            }
        });
        this._super(...arguments);
    },
    actions: {
        /**
       * [createSignOffReq description]
       * @param  {[type]} message  [description]
       * @param  {[type]} position [description]
       * @return {[type]}          [description]
       */
        createSignOffReq() {
            this.get("esraCommonService").setSignoffReq(this);
            let config = detailConfig().get('signoffPopUpConfig');
            config.action = "create";
            config.signoffModel = Ember.Object.create({});
            config.signoffActivity = this.signoffActivity;
            this.get("esraCommonService").popOverPopup.call(this, config, config.signoffModel);
        },
        /**
        * [updateSignOffReq description]
        * @param  {[type]} message  [description]
        * @param  {[type]} position [description]
        * @return {[type]}          [description]
        */
        updateSignOffReq(signoffreq) {
            this.get("esraCommonService").setSignoffReq(this);
            let config = detailConfig().get('signoffPopUpConfig');
            config.action = "edit";
            config.signoffModel = Ember.Object.create({
                requirements: signoffreq.get('requirements'),
                dueDate: signoffreq.get('dueDate'),
                type: signoffreq.get('type'),
                status: signoffreq.get('status'),
                repeat: signoffreq.get('repeat'),
                signoffVersion: signoffreq.get('signoffVersion'),
                id: signoffreq.get('id'),
                followupTasks: signoffreq.get('followupTasks')

            });
            config.signoffreq = signoffreq;
            config.signoffActivity = this.signoffActivity;
            this.get("esraCommonService").popOverPopup.call(this, config, config.signoffModel);
        },
        /**
        * [deleteFollowupAction description]
        * @param  {[type]} message  [description]
        * @param  {[type]} position [description]
        * @return {[type]}          [description]
        */
        deleteFollowupAction() {
            this.get('signoffreq');
        }
    }
});
