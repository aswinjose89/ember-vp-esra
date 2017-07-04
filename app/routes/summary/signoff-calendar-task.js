import AuthenticatedRoute from 'wb-ui-core/routes/authenticated-route';
import MaterialLayoutHandler from 'wb-ui-md-components/mixins/material-layout-handler';
import Ember from 'ember';
import RouteProgressIndicator from 'wb-ui-core/mixins/route-progress-indicator';
import RouteErrorHandler from 'wb-ui-core/mixins/route-error-handler';

export default AuthenticatedRoute.extend(MaterialLayoutHandler, RouteProgressIndicator, RouteErrorHandler, {
    esraCommonService: Ember.inject.service("esra-common-service"),
    model(param) {
        this.reqId = param.reqId;
        this.taskId = param.taskId;
        this.get('esraCommonService').setProperty('taskHighlight', {
            reqId: this.reqId,
            taskId: this.taskId
        });
        return param;
    },
    redirect() {
        this.transitionTo('wb-ui-esra.summary.signoffReq');
    }
});
