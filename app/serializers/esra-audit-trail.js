import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    esraCommonService: Em.inject.service(),
    normalizeQueryResponse(store, clazz, payload) {
        return this._super(store, clazz, {
            esraAuditTrail: payload.auditInfo
        });
    },
    normalize(modelClass, resourceHash) {
        resourceHash.oldValue = this.auditTrialDateEval(resourceHash.oldValue);
        resourceHash.newValue = this.auditTrialDateEval(resourceHash.newValue);
        return this._super(...arguments);
    },
    auditTrialDateEval(val) {
        let dataList = (val) ? val.split('$$') : val;
        if (dataList && dataList.contains('DATE')) {
            return this.get('esraCommonService.dateFormat')(Number(dataList.get('firstObject')), 'DD MMM YYYY');
        }
        return val;
    }
});
