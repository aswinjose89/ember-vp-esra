import DS from 'ember-data';

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
    psId: DS.attr('string')
});
