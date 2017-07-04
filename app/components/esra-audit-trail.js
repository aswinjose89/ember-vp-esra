import Ember from 'ember';
import Constants from '../utils/esra-constant';
import ProgressIndicator from 'wb-ui-core/mixins/progress-indicator';

export default Ember.Component.extend(Constants, ProgressIndicator, {
    componentConfig: Ember.computed.reads('config.componentConfig'),
    tagName: '',
    store: Ember.inject.service(),
    getEsraAuditTrailInfo (tabName) {
        this.showLoadingIndicator();
        this.get('store').query('esra-audit-trail', {
            dealId: this.get('componentConfig.dealId'),
            version: this.get('componentConfig.version'),
            tabName: tabName
        }).then((res) => {
            if (!Ember.isEmpty(res)) {
                this.set('tableContent', res);
            } else {
                this.set('tableContent', null);
            }
            this.hideLoadingIndicator();
        });
    },
    getConfig: Ember.computed(function () {
        this.getEsraAuditTrailInfo('DEAL_DETAILS');
        this.setProperties({
            'esraAuditTrailTabContent': Constants.esraAuditTrailTabContent,
            'tabSelectedIndex': 0,
            'esraAuditTrailTableConfig': Constants.esraAuditTrailTableConfig,
            'isTriggerClickOnLoad': false
        });
    }),
    actions: {
        esraAuditTabClick (selectedTabIndex) {
            let tabs = ['DEAL_DETAILS', 'ATTACHMENT', 'ASSESSMENT', 'SIGNOFF_REQUIREMENTS'];
            this.getEsraAuditTrailInfo(tabs[selectedTabIndex]);
        },
        closeDialog () {
            Ember.Logger.log('esra close dialog');
            this.get('config.onClose').call(...this.get('config.callbackContext'));
        }
    }
});
