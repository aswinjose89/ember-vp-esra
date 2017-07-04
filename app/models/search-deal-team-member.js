import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
    /**
   * @property name
   * @type String
   */
    name: DS.attr('string'),

    /**
     * @property emailId
     * @type String
     */
    emailId: DS.attr('string'),

    /**
     * @property psId
     * @type String
     */
    psId: DS.attr('string'),
    /**
     * @property codeDesc
     * @type String
     */
    codeDesc: Ember.computed('psId', 'name', {
        get() {
            let psId = this.get('psId'), name = this.get('name');
            return psId.concat('-').concat(name);
        }
    })
});
