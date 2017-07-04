import DS from 'ember-data';

export default DS.Model.extend({
    details: DS.hasMany('signoff-detail'),
    signoffActivity: DS.belongsTo('signoff-activity')
});
