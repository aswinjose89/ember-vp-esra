import Ember from 'ember';
import AuthenticatedRoute from 'wb-ui-core/routes/authenticated-route';
import MaterialLayoutHandler from 'wb-ui-md-components/mixins/material-layout-handler';
import Constants from '../utils/esra-constant';
import detailConfig from '../utils/detail-config';
import RouteProgressIndicator from 'wb-ui-core/mixins/route-progress-indicator';
import RouteErrorHandler from 'wb-ui-core/mixins/route-error-handler';
import GoBackHandler from 'wb-ui-gadgets/mixins/go-back';

const {inject} = Ember;

export default AuthenticatedRoute.extend(RouteProgressIndicator, RouteErrorHandler, MaterialLayoutHandler, GoBackHandler, {
    esraService: inject.service("esra-common-service"),
    esraPicklistService: inject.service(),
    beforeModel() {
        this._super.apply(this, arguments);
        return this.get('esraPicklistService').prefetchAll();
    },
    model(params) {
        this.get('esraService').setParam(params);
        this.showLoadingIndicator();
        return this.store.findRecord('dealHeader', params.dealId, { reload: true }).then(data => {
            if (data) {
                let domicileCountryDesc = data.get("domicileCountry") ? this.get("esraService").getDealCountries(data.get("domicileCountry"), "description") : '-';
                let dealExecutionCountryDesc = data.get("dealExecutionCountry") ? this.get("esraService").getDealCountries(data.get("dealExecutionCountry"), "description") : '-';
                data.set("domicileCountry", domicileCountryDesc.length > 1 ? domicileCountryDesc : (data.get("domicileCountry") && data.get("domicileCountry").length > 1) ? data.get("domicileCountry").toUpperCase() : '-');
                data.set("dealExecutionCountry", dealExecutionCountryDesc);
                params.version = data.get('esraActivity').get('version');
                this.get('esraService').setBusinessArea((data.get('businessArea')) ?
                    data.get('businessArea') : null);
                this.hideLoadingIndicator();
                if (Ember.isEqual(data.get('esraActivity.userRole'), '0092') && !data.get('esraActivity.status')) {
                    const config = detailConfig().get('dtlLoginAlertConfig'),
                        modalPopUpManager = this.get('esraService').modalPopUpManager;
                    modalPopUpManager.call(this, config);
                }
                return data;
            } else {
                this.get('esraService').exception("summary", "No Record Found");
            }
        });
    },
    afterModel(model) {
        let status = model.get("esraActivity.statusDesc");
        model.set("esraActivityStatus", this.get("esraService").statusActivity(status, model.get("esraActivity")));
        this.get("esraService").workflowHistory(model.get("esraActivity.workflowHistoryEnabled"));
        this.get("esraService").set('disableSaveDraft', true);
        this.get("esraService").setProperty('ESRADeleted', false);
    },
    renderTemplate(controller, model) {
        this._super(...arguments);
        this.render('esra-header-section', Constants.templates.headerTemplate);
        model.set('navConfig', this.get('esraService').getNavConfig(model.get("esraActivity")));
        this.render('esra-side-bar', Constants.templates.sideBar(model));
    },
    navigateToPreviousRoute(paramVal) {
        if (this.get('previousTransition') && this.get('previousTransition.routeName')) {
            this.navigateBack();
            return;
        }

        if (!this.navigateBack()) {
            this.transitionTo(Constants.routeObjects.get('dealHome'), paramVal.dealId);
        }
    },
    actions: {
        // error(error, transition) {
        //     this.get('esraService').exception("summary", error, transition);
        // },
        deleteESRA() {
            var st = this.store,
                params = this.get('esraService').getParam(),
                record = this.get('esraService').peekEsraActivity(),
                assessAdapter = st.adapterFor('esraActivity');
            assessAdapter.set('serviceURL', `${assessAdapter.get("namespace")}/esraActivities?dealId=${params.dealId}&version=${params.version}`);
            record.deleteRecord();
            record.save();
        },
        goBack() {
            this.send('backToDeal');
        },
        backToDeal() {
            let paramVal = this.get('esraService').getParam();
            this.navigateToPreviousRoute(paramVal);
        },
        openAuditTrail() {
            let param = this.get('esraService').getParam();
            this.mdDialogManager.popup({
                componentName: 'esra-audit-trail',
                dealId: param.dealId,
                version: param.version
            });
        },
        willTransition(transition) {
            this.get('esraService').onExit(transition);
        }
    }
});
