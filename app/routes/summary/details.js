import AuthenticatedRoute from 'wb-ui-core/routes/authenticated-route';
import MaterialLayoutHandler from 'wb-ui-md-components/mixins/material-layout-handler';
import Ember from 'ember';
import RouteProgressIndicator from 'wb-ui-core/mixins/route-progress-indicator';
import RouteErrorHandler from 'wb-ui-core/mixins/route-error-handler';
import detailConfig from '../../utils/detail-config';

const {inject} = Ember;

export default AuthenticatedRoute.extend(MaterialLayoutHandler, RouteProgressIndicator, RouteErrorHandler, {
    esraService: inject.service("esra-common-service"),
    hideSecondaryNav: true,
    transitionRetry: false,
    model() {
        let paramVal = this.get('esraService').getParam();
        this.showLoadingIndicator();
        return this.store.queryRecord('dealDetail', paramVal).then(data => {
            this.hideLoadingIndicator();
            this.set('dealDetail', data);
            return data;
        });
    },
    afterModel(model) {
        this.detailConfig(model);
    },
    detailConfig(model) {
        let status = model.get("esraActivity.statusDesc");
        var parentRoute = this.modelFor(this.routeName.replace('.' + this.routeName.split('.').pop(-1), ''));
        parentRoute.setProperties({
            navConfig: this.get('esraService').getNavConfig(model.get("esraActivity")),
            esraActivityStatus: this.get("esraService").statusActivity(status, model.get("esraActivity"))
        });
    },
    actions: {
        // error(error, transition) {
        //     this.get('esraService').exception("details", error, transition);
        // },
        saveDraft(hidePopup) {
            let config = detailConfig().get('saveDraftConfig');
            if (this.get('dealDetail.description')) {
                this.showLoadingIndicator();
                this.get('dealDetail').save().then((success) => {
                    // hiding indicator based on the condition
                    this.get("esraService").workflowHistory(success.get('esraActivity.workflowHistoryEnabled'));
                    if (!hidePopup) {
                        this.hideLoadingIndicator();
                        this.get('esraService').modalPopUpAlertManager.call(this, config);
                    }
                    if (success.get('firstObject')) {
                        this.detailConfig.call(this, success.get('firstObject'));
                    }
                    else {
                        this.detailConfig.call(this, success);
                    }
                }, (error) => {
                    this.hideLoadingIndicator();
                    Ember.Logger.log("Error in saveDraft Action:", error);
                });
            } else {
                let errorConfig = detailConfig().get('detailErrorValidation');
                this.get('esraService').modalPopUpAlertManager.call(this, errorConfig);
            }
        },
        userQueryAction(filters) {
            Ember.Logger.log('filters:', filters);
            // return this.get('store').query('user',{filters});
        },
        willTransition(transition) {
            Ember.Logger.log(transition);
            if (!this.get('dealDetail.saveDraftDisable') && !this.get('transitionRetry')) {
                transition.abort();
                this.set('transitionRetry', true);
                if (!this.get('esraService').getProperty('ESRADeleted')) {
                    if (transition.targetName.indexOf('wb-ui-esra') === -1) {
                        let tabsSwitchDirtyConfig = detailConfig().get('tabsSwitchDirtyConfig');
                        this.get('esraService.modalPopUpManager').call(this, tabsSwitchDirtyConfig, transition);
                    } else {
                        // param to hide success popup
                        this.send('saveDraft', true);
                        transition.retry();
                    }
                } else {
                    this.send('proceedRouteAction', transition);
                }
            } else {
                if (!this.get('transitionRetry')) {
                    this.get('esraService').onExit(transition);
                }
                this.set('transitionRetry', false);
            }
        },
        proceedRouteAction(transition) {
            //do rollback
            Ember.Logger.log(transition);
            this.set('transitionRetry', true);
            // this.get('esraService').deleteDealDirtyFiles(this.get('dealDetail'));
            this.get('dealDetail.esraAttachment.files').forEach(item => {
                item.rollbackAll();
            });
            this.get('dealDetail').rollbackAll();
            this.get('esraService').onExit(transition);
            transition.retry();
        },
        cancelRouteAction(transition) {
            //do abort
            Ember.Logger.log(transition);
            this.set('transitionRetry', false);
        }
    }
});
