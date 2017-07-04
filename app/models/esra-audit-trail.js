import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
    fieldName: DS.attr('string'),
    oldValue: DS.attr('string'),
    newValue: DS.attr('string'),
    updatedBy : DS.attr('string'),
    updatedOn:  DS.attr('string'),
    formattedUpdatedOn: Ember.computed('updatedOn', function () {
        let timeStamp = Number(this.get('updatedOn'));
        if (!Ember.isEmpty(this.get('updatedOn'))) {
            return moment(timeStamp).format('DD MMM YYYY HH:mm a');
        }
    })
});
