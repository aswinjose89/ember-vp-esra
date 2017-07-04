import Ember from 'ember';
import fileAttachment from '../mixins/wb-esra-attachment';
import Constants from '../utils/esra-constant';

export default Ember.Mixin.create({
    store: Em.inject.service(),
    esraCommonService: Em.inject.service(),
    esraActivityPeekRecord: function () {
        return this.get('esraCommonService').peekEsraActivity();
    }.on('activate'),
    ESRAHEADER: {
        'SAVEDRAFTTRIGGER': false,
        'SUBMITTRIGGER': false,
        'SAVETRIGGER': false
    }
});
