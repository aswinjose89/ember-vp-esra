import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    attrs: {
        dealTeamMember: { embedded: 'always' },
        esraAttachment: { embedded: 'always' },
        esraActivity: { embedded: 'always' }
    },
    serializeIntoHash (hash, type, record, options) {
        var dealDetail = this.serialize(record, options);
        this.get('store').unloadAll('file');
        Ember.merge(hash, {
            dealDetail
        });
    }
});
