import AuthenticatedRoute from 'wb-ui-core/routes/authenticated-route';
import MaterialLayoutHandler from 'wb-ui-md-components/mixins/material-layout-handler';
import Ember from 'ember';
import RouteProgressIndicator from 'wb-ui-core/mixins/route-progress-indicator';
import RouteErrorHandler from 'wb-ui-core/mixins/route-error-handler';
import RSVP from 'rsvp';

const {inject} = Ember;

export default AuthenticatedRoute.extend(MaterialLayoutHandler, RouteProgressIndicator, RouteErrorHandler, {
    esraService: inject.service("esra-common-service"),
    hideSecondaryNav: true,
    model() {
        let paramVal = this.get('esraService').getParam();
        this.showLoadingIndicator();
        return RSVP.hash({
            workflowHistory: this.store.queryRecord('workflowHistory', paramVal, {
                reload: true
            }).then(data => {
                this.hideLoadingIndicator();
                return data;
            })
        });
    },
    redirect() {
        this.get('esraService').getWorkflowHistory(this.routeName);
    },
    actions: {
        error(error, transition) {
            this.get('esraService').exception("details", error, transition);
        }
    }
});
