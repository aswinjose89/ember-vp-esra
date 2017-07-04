import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
    fileName: DS.attr('array-transform'),
    description: DS.attr('string'),
    uploadedBy: DS.attr('string'),
    categoryType: DS.attr('string'),
    deleted: DS.attr('boolean', {
      defaultValue: false
    }),
    updated: DS.attr('boolean', {
      defaultValue: false
    })
});
