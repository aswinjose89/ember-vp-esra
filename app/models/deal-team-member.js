import DS from 'ember-data';

export default DS.Model.extend({
    totalRecords:DS.attr('string'),
    members:DS.hasMany('member')
});
