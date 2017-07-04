import DS from 'ember-data';

export default DS.Model.extend({
    fsData: DS.belongsTo('fsData'),
    esraActivity: DS.belongsTo('esraActivity'),
    assessmentDirtyCheck: DS.attr('boolean')
});
