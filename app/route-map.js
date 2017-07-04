var RouteMap = function () {
    this.route('summary', {path: '/:dealId'}, function() {
        this.route('details');
        this.route('assessment');
        this.route('signoffReq');
        this.route('signoffCalendarTask', {path: '/signoffReq/:reqId/:taskId'});
        this.route('workflowHistory');
    });
};

export default RouteMap;
