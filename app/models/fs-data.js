import DS from 'ember-data';

export default DS.Model.extend({
    fsFields: DS.hasMany('fsField'),
    fsForm: DS.belongsTo('fsForm'),
    fsPages: DS.hasMany('fsPage'),
    fsSections: DS.hasMany('fsSection')
});
