import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
    esraCommonService: Ember.inject.service(),
    updatedBy: DS.attr('string'),
    action: DS.attr('string'),
    beforeStatus: DS.attr('string'),
    afterStatus: DS.attr('string'),
    comments: DS.attr('string'),
    updatedOn: DS.attr('number'),
    formattedUpdatedOn: Ember.computed('updatedOn', function () {
        return `${this.get('esraCommonService').dateFormat(this.get('updatedOn'), 'DD MMM YYYY HH:mm', true)} GMT`
    })
});
