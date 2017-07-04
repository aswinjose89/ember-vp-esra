import DS from 'ember-data';
import EmberValidations from 'ember-validations';
import Ember from 'ember';

export default DS.Model.extend(EmberValidations, {
    description: DS.attr('string'),
    dealTeamMember: DS.belongsTo('dealTeamMember'),
    esraAttachment: DS.belongsTo('esra-attachment'),
    esraActivity: DS.belongsTo('esraActivity'),
    validations: {
        description: {
            presence: true
        }
    },
    isDescriptionInValid: Ember.computed.not('isValid', function () {
        return (Ember.isEqual(this.get('isDirty'), true)) ? this.get('isValid') : true;
    })
});
