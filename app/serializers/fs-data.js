import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    attrs: {
        fsFields: { embedded: 'always' },
        fsForm: { embedded: 'always' },
        fsPages: { embedded: 'always' },
        fsSections: { embedded: 'always' }
    }

});
