import Ember from 'ember';
import RouteProgressIndicator from 'wb-ui-core/mixins/route-progress-indicator';
import RouteErrorHandler from 'wb-ui-core/mixins/route-error-handler';
import esraMixin from '../mixins/wb-esra-mixin';

export default Ember.Component.extend(RouteProgressIndicator, RouteErrorHandler, esraMixin, {
    tagName: '',
    esraPicklistService: Ember.inject.service(),
    wbAjax: Ember.inject.service(),
    esraService: Ember.inject.service("esra-common-service"),
    wbFlashMessages: Ember.inject.service(),
    store: Ember.inject.service(),
    tabSelectedIndex: 0,
    isTabEnabled: true,
    sectors: Ember.A([]),
    getHeader: Ember.computed('model.fsFields.[]', function () {
        return this.get('model.fsFields') && this.get('model.fsFields.firstObject');
    }),
    isAddDisabled: Ember.computed('getHeader.opaObject.properties', function () {
        if (this.get('getHeader.properties')) {
            let addProp = this.get('getHeader.properties').filterBy("key", "show_add");
            return !addProp[0].text;
        }
        return false;
    }),
    tabs: Ember.computed('getHeader.opaObject.entityInstances.[]', function () {
        return this.setupTabs();
    }),
    setupTabs() {
        let tabs = Ember.A([]), instanceId = "", sectors = [], tabSections = this.get('tabSections');
        if (this.get('getHeader')) {
            if (this.get('getHeader.opaObject.entityInstances') && this.get('getHeader.opaObject.entityInstances.length') > 0) {
                this.get('getHeader.opaObject.entityInstances').forEach((data) => {
                    instanceId = data.instanceId.indexOf('|') > -1 ? data.instanceId.split("|")[0] : data.instanceId;
                    sectors.push(instanceId);
                    if (this.get('esraPicklistService').getSectorTypes().findBy('code', instanceId)) {
                        let selectedTab = (tabSections && tabSections.filter(x => x.get('layout') === "tab" && x.get('visible') === true && x.get('label').split('|').contains(instanceId)).length > 0) ? tabSections.filter(x => x.get('layout') === "tab" && x.get('visible') === true && x.get('label').split('|').contains(instanceId)) : null;
                        let errorFlag = (selectedTab && selectedTab.length > 0) ? selectedTab.get('firstObject.label').split('|').contains("true") : null;
                        // (selectedTab && selectedTab.length > 0) ? selectedTab.get('firstObject.fsFields').forEach(field => {
                        //     let sectorEmptyMsg = (field.get('label')) ? field.get('label').split('##') : field.get('label');
                        //     if (sectorEmptyMsg && Em.isEqual(sectorEmptyMsg.get('firstObject'), 'label')) {
                        //         field.set('type',"empty-label");
                        //     }
                        // }) : null;
                        if (Em.isEqual(instanceId, "0016")) {
                            this.set('isAddDisabled', true);
                        }
                        tabs.pushObject(Ember.Object.create({ label: this.get('esraPicklistService').getSectorTypes().findBy('code', instanceId).get('longDescription'), isError: errorFlag ,isReadOnly:this.get('screenReadOnly')}));
                    }
                    this.set('sectors', this.setSectors(sectors));
                });
            } else {
                this.set('sectors', this.setSectors(sectors));
            }
        }
        this.setProperties({
            'tabSelectedIndex': ((tabs.length > 0) && (this.get('ESRAHEADER.SAVETRIGGER') || this.get('ESRAHEADER.SAVEDRAFTTRIGGER') || this.get('ESRAHEADER.SUBMITTRIGGER', true))) ? tabs.length - 1 : this.get('tabSelectedIndex'),
            'isAddDisabled': (this.get('ESRAHEADER.SAVETRIGGER') || this.get('ESRAHEADER.SAVEDRAFTTRIGGER') || this.get('ESRAHEADER.SUBMITTRIGGER', true)) ? (sectors && sectors.includes('0016')) : this.get('isAddDisabled')
        });
        return tabs;
    },
    setSectors(instances) {
        var sectors = this.get('esraPicklistService').getSectorTypes(),
            lists = sectors.toArray(),
            remSectors = [];
        lists.forEach((sector) => {
            if (!instances.contains(sector.get('code')) && ((instances.length > 0) ? sector.get('code') !== "0016" : true)) {
                remSectors.push(sector);
            }
        });
        if (remSectors.length <= 0) {
            this.set('isAddDisabled', true);
        }
        return remSectors;
    },
    actions: {
        addNewSector() {
            this.get('tabs').pushObject(Ember.Object.create({ label: 'SECTOR 1', id: 'new' }));
            this.setProperties({
                'isAddDisabled': true,
                'ESRAHEADER.SAVEDRAFTTRIGGER': false,
                'ESRAHEADER.SUBMITTRIGGER': false,
                'ESRAHEADER.SAVETRIGGER': false
            });
            this.get('tabSections').pushObject(Ember.Object.create({ layout: 'new', id: 'new' }));
            this.set('tabSelectedIndex', this.get('tabs').length - 1);
            this.setupTabs();
            this.get('esraService').set('disableSaveDraft', false);
            this.get('esraService').getProperty('dealAssessmentDetailsModel').set('saveDraftDisable', false);
        },
        createSector() {
            let selectedSector = this.get('selectedSector'),
                params = this.get('esraService').getParam();
            if (selectedSector && selectedSector.get instanceof Function && selectedSector.get('code')) {
                this.showLoadingIndicator();
                var st = this.get('store'),
                    record = st.peekRecord('assessmentDetail', params.dealId),
                    assessAdapter = st.adapterFor('assessmentDetail');
                record.set('sector', selectedSector.get('code'));
                this.showLoadingIndicator();
                this.setProperties({
                    selectedSector: {},
                    isTabEnabled: false
                });
                record.save({ adapterOptions: { actionType: 'ADDSECTOR' } }).then(() => {
                    this.setProperties({
                        'isAddDisabled': false,
                        'ESRAHEADER.SAVEDRAFTTRIGGER': false,
                        'ESRAHEADER.SUBMITTRIGGER': false,
                        'ESRAHEADER.SAVETRIGGER': false
                    });                   
                    delete record.sector;
                    this.set('isTabEnabled', true);
                    this.send('doRefresh');
                    this.hideLoadingIndicator();
                });
            }
        },
        deleteSector(sector, tabContent) {
            if (this.get('tabSections')[sector] && typeof this.get('tabSections')[sector].get('label') === 'undefined') {
                this.setProperties({
                    'isAddDisabled': false,
                    'ESRAHEADER.SAVEDRAFTTRIGGER': false,
                    'ESRAHEADER.SUBMITTRIGGER': false,
                    'ESRAHEADER.SAVETRIGGER': false
                });
                if (!this.get('esraService').get('disableSaveDraft')) {
                    this.get('esraService').set('disableSaveDraft', false);
                    this.get('esraService').getProperty('dealAssessmentDetailsModel').set('saveDraftDisable', false);
                } else {
                    this.get('esraService').set('disableSaveDraft', true);
                    this.get('esraService').getProperty('dealAssessmentDetailsModel').set('saveDraftDisable', true);
                }
            }
            if (this.get('tabSections')[sector] && this.get('tabSections')[sector].get('label')) {
                let params = this.get('esraService').getParam(),
                    st = this.get('store'),
                    record = st.peekRecord('assessmentDetail', params.dealId),
                    assessAdapter = st.adapterFor('assessmentDetail');
                record.set('sector', this.get('tabSections')[sector].get('label'));
                this.showLoadingIndicator();
                this.set('selectedSector', {});
                this.set('isTabEnabled', false);
                record.save({ adapterOptions: { actionType: 'DELETESECTOR' } }).then(() => {
                    this.set('isAddDisabled', false);
                    if (tabContent.get('isActive')) {
                        this.get('tabSections').removeAt(sector);
                        this.set('tabSelectedIndex', this.get('tabs').length - 1);
                    }
                    else {
                        this.get('tabSections').removeAt(sector);
                    }
                    this.send('doRefresh');
                    delete record.sector;
                    this.set('isTabEnabled', true);
                    this.hideLoadingIndicator();
                });
            }
        },
        doRefresh() {
            this.sendAction('doRefresh', '/refresh');
        }
    }
});
