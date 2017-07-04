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
        let paramVal = JSON.parse(JSON.stringify(this.get('esraService').getParam())),
            isValidate = this.get('esraService').getProperty('isEnableValidation');
        paramVal.enableValidation = Ember.isPresent(isValidate) ? isValidate : false;
        return this.store.queryRecord('assessmentDetail', paramVal).then((data) => {
            this.set('assessmentDtlModel', data);
            return data;
        });
    },
    afterModel(model) {
        this.detailConfig(model);
        this.get('esraService').setProperty('dealAssessmentDetailsModel', model);
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
        saveDraft(serviceURL, hidePopup) {
            var st = this.get('store'),
                record = this.get('assessmentDtlModel'),
                assessAdapter = st.adapterFor('assessmentDetail');
            let config = detailConfig().get('saveDraftConfig');
            this.showLoadingIndicator();
            record.save({ adapterOptions: { actionType: serviceURL ? 'REFRESH' : 'ASSESSMENTDETAIL' } }).then((success) => {
                this.get("esraService").workflowHistory(success.get('esraActivity.workflowHistoryEnabled'));
                if (success.get('firstObject')) {
                    this.detailConfig.call(this, success.get('firstObject'));
                }
                else {
                    this.detailConfig.call(this, success);
                }
                assessAdapter.set('serviceURL', null);
                // hiding indicator based on the condition
                if (!serviceURL && !hidePopup) {
                    this.hideLoadingIndicator();
                    this.get('esraService').modalPopUpAlertManager.call(this, config);
                }
                if (serviceURL) {
                    this.hideLoadingIndicator();
                }
            });
        },
        doRefresh(value) {
            this.send('saveDraft', value);
        },
        willTransition(transition) {
            if (!this.get('assessmentDtlModel.saveDraftDisable') && !this.get('transitionRetry')) {
                transition.abort();
                this.set('transitionRetry', true);
                if (!this.get('esraService').getProperty('ESRADeleted')) {
                    if (transition.targetName.indexOf('wb-ui-esra') === -1) {
                        let tabsSwitchDirtyConfig = detailConfig().get('tabsSwitchDirtyConfig');
                        this.get('esraService.modalPopUpManager').call(this, tabsSwitchDirtyConfig, transition);
                    } else {
                        // param to hide success popup
                        this.send('saveDraft', '', true);
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
            this.get('esraService').getProperty('dealAssessmentDetailsModel').get('fsData.fsFields').forEach(item => {
                item.rollbackAll();
            });
            if (!this.get('esraService').getProperty('ESRADeleted')) {
                this.get('esraService').onClearOpaSession();
            }
            this.get('esraService').getProperty('dealAssessmentDetailsModel').set('assessmentDirtyCheck', true);
            this.get('esraService').onExit(transition);
            transition.retry();
        },
        cancelRouteAction(transition) {
            //do abort
            Ember.Logger.log(transition);
            this.set('transitionRetry', false);
        },
        getAssessment(isEnableValidation) {
            if (Em.isEqual(isEnableValidation, 'true')) {
                let paramVal = JSON.parse(JSON.stringify(this.get('esraService').getParam())),
                    isValidate = this.get('esraService').getProperty('isEnableValidation');
                paramVal.enableValidation = Ember.isPresent(isValidate) ? isValidate : false;
                this.set('paramVal', paramVal);
            }
            else {
                let paramVal = this.get('esraService').getParam();
                this.set('paramVal', paramVal);
            }
            this.store.queryRecord('assessmentDetail', this.get('paramVal')).then((data) => {
                this.set('assessmentDtlModel', data);
                return data;
            });
        }
    }
});
