import AuthenticatedRoute from 'wb-ui-core/routes/authenticated-route';
import MaterialLayoutHandler from 'wb-ui-md-components/mixins/material-layout-handler';
import Ember from 'ember';
import RouteProgressIndicator from 'wb-ui-core/mixins/route-progress-indicator';
import RouteErrorHandler from 'wb-ui-core/mixins/route-error-handler';
import detailConfig from '../../utils/detail-config';

const {inject, RSVP} = Ember;

export default AuthenticatedRoute.extend(MaterialLayoutHandler, RouteProgressIndicator, RouteErrorHandler, {
    esraCommonService: inject.service(),
    wbAjax: inject.service(),
    hideSecondaryNav: true,
    transitionRetry: false,
    model(queryParam, transition) {
        let paramVal = this.get('esraCommonService').getParam(),
            dealParam = { dealId: paramVal.dealId };
        this.reqId = transition.queryParams.reqId;
        this.taskId = transition.queryParams.taskId;
        this.showLoadingIndicator();
        var promises = RSVP.hash({
            signoffReq: this.store.queryRecord('signoffRequirement', paramVal),
            dealDoc: this.store.query("dealDocument", dealParam)
        });
        return promises.then(data => {
            this.hideLoadingIndicator();
            this.set('signoffReqModel', data.signoffReq);
            this.get('esraCommonService').setSignoffActivity(data.signoffReq.get('signoffActivity'));
            return data;
        });
    },
    afterModel() {
        if (this.reqId && this.taskId) {
            this.get('esraCommonService').setProperty('taskHighlight', {
                reqId: this.reqId,
                taskId: this.taskId
            });
        }
    },
    redirect() {
        this.get('esraCommonService').getStatusActivity(this.routeName);
    },
    actions: {
        // error(error, transition) {
        //     this.get('esraCommonService').exception("details", error, transition);
        // },
        saveDraft(hidePopup) {
            var record = this.get('signoffReqModel');
            this.showLoadingIndicator();
            record.save().then(() => {
                // hiding indicator based on the condition
                if (!hidePopup) {
                    this.hideLoadingIndicator();
                }
            });
        },
        userQueryAction(filters) {
            Ember.Logger.log('filters:', filters);
        },
        willTransition(transition) {
            Ember.Logger.log(transition);
            if (!this.get('signoffReqModel.details.saveDraftDisable') && !this.get('transitionRetry')) {
                transition.abort();
                this.set('transitionRetry', true);
                if (!this.get('esraCommonService').getProperty('ESRADeleted')) {
                    if (transition.targetName.indexOf('wb-ui-esra') === -1) {
                        let tabsSwitchDirtyConfig = detailConfig().get('tabsSwitchDirtyConfig');
                        this.get('esraCommonService.modalPopUpManager').call(this, tabsSwitchDirtyConfig, transition);
                    } else {
                        this.send('saveDraft', true);
                        transition.retry();
                    }
                } else {
                    this.send('proceedRouteAction', transition);
                }
            } else {
                if (!this.get('transitionRetry')) {
                    this.get('esraCommonService').onExit(transition);
                }
                this.get('esraCommonService.followupTskUploadAttachmentList').clear();
                this.get('esraCommonService').setProperty('taskHighlight', {});
                this.set('transitionRetry', false);
            }
        },
        proceedRouteAction(transition) {
            //do rollback
            Ember.Logger.log(transition);
            this.set('transitionRetry', true);
            this.get('signoffReqModel.details').forEach(item=>item.rollbackAll());
            this.get('signoffReqModel').rollbackAll();
            this.get('esraCommonService').onExit(transition);
            transition.retry();
        },
        cancelRouteAction(transition) {
            //do abort
            Ember.Logger.log(transition);
            this.set('transitionRetry', false);
        }
    }
});
