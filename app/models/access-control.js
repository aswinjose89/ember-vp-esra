import DS from 'ember-data';

export default DS.Model.extend({
    saveDraftEnabled: DS.attr('string'),
    submitEnabled: DS.attr('string'),
    recallEnabled: DS.attr('string'),
    approveEnabled: DS.attr('string'),
    rejectEnabled: DS.attr('string'),
    referbackEnabled: DS.attr('string'),
    withdrawEnabled: DS.attr('string'),
    reopenEnabled: DS.attr('string'),
    deleteEnabled: DS.attr('string')
});
