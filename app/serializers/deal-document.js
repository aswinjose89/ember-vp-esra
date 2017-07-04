import DS from 'ember-data';

export default DS.RESTSerializer.extend({
	primaryKey: 'docId',
	normalize(model, hash) {
		hash.description = hash.desc;
		hash.documentId = hash.docId;
		return this._super(...arguments);

	}
});
