import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
    namespace: '/api/esra',
    pathForType(){
        return 'audit';
    }
});
