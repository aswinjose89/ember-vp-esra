import DS from 'ember-data';

export default DS.Model.extend({
    action: DS.attr('string'),
    approvalRoute: DS.attr('string'),
    comments: DS.attr('string'),
    assignee: DS.attr('string'),
    status: DS.attr('string'),
    errors: DS.attr(),
    responseTitle: DS.attr('string'),
    responseMessage: DS.attr('string'),
    showValidationError: DS.attr('boolean'),
    esraActivity: DS.belongsTo('esraActivity')
});

