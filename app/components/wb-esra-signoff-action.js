import Ember from 'ember';
import detailConfig from '../utils/detail-config';
import Constants from '../utils/esra-constant';

export default Ember.Component.extend({
    tagName: '',
    esraCommonService: Ember.inject.service(),
    signoffconstant: Constants.signoffconstant,
    followupActionMenu: detailConfig().get('followupActionMenu'),
    signoffRequirement: Ember.computed('signoffModel', {
        get() {
            return this.get('signoffModel');
        }
    }),
    actions: {
        /**
        * [updateSignoffAction description]
        * @param  {[type]} message  [description]
        * @param  {[type]} position [description]
        * @return {[type]}          [description]
        */
        updateSignoffAction(followupTsk) {
            this.sendAction('triggerFollowUpEditAction',followupTsk);
        },
        /**
        * [deleteFollowupAction description]
        * @param  {[type]} message  [description]
        * @param  {[type]} position [description]
        * @return {[type]}          [description]
        */
        deleteFollowupAction(followupAction) {
            this.sendAction('triggerFollowUpDeleteAction', followupAction);
        }
    }
});
