import DS from 'ember-data';
import Ember from 'ember';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    store: Ember.inject.service(),
    esraCommonService: Ember.inject.service(),
    attrs: {
        fsData: { embedded: 'always' },
        esraActivity: { embedded: 'always' }
    },
    serializeIntoHash (hash, type, snapshot) {
        var pageModel = snapshot.record, formModel = pageModel.get('fsData.fsForm'),
                fsSections = pageModel.get('fsData.fsSections') || [], formData = [],
                consumerPayload = formModel.get('fsHeader.consumerPayload'),
                fsProperties = formModel.get('fsProperties'),
                esraActivity = this.get('esraCommonService').peekEsraActivity();

        fsSections.forEach(function (fsSection) {
            var fsFields = fsSection.get('fsFields') || [];
            fsFields.forEach(function (field) {

                var fieldData = field.toJSON();

                if (fieldData.type !== 'wb-label') {
                    delete fieldData.fieldAttributes;
                    formData.push(fieldData);
                }
            });
        });
        //this.get('store').unloadAll('fsField');
        var requestData = {
            fsData: {
                consumerPayload: consumerPayload,
                targetScreen: null,
                id: formModel.get('id'),
                formData: formData,
                fsProperties: fsProperties
            },
            esraActivity: esraActivity
        };
        if(pageModel.sector){
            var sector = (pageModel.sector.indexOf('|')> -1) ? pageModel.sector.split("|")[0] : pageModel.sector;
            requestData.sector = sector;
        }
        Ember.merge(hash, {
            assessmentDetail: requestData
        });
    }

});
