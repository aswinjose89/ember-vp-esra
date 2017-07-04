import Ember from 'ember';
import ProgressIndicator from 'wb-ui-core/mixins/progress-indicator';

export default Ember.Component.extend(ProgressIndicator, {
    store: Ember.inject.service(),
    esraService: Ember.inject.service("esra-common-service"),
    picklistService: Ember.inject.service(),
    tagName: '',
    dpConfig: Ember.computed('model.fieldAttributes', {
        get() {
            if (this.get('model.type') === 'wb-dropdown') {
                let config = {
                    content: this.get('model.fieldAttributes.listOptions'),
                    optionLabelPath: 'displayText',
                    optionValuePath: 'value'
                };
                if (this.get('esraService').isDefined(this.get('model.fieldAttributes.componentName'))) {
                    let componentField = Ember.String.pluralize(Ember.String.camelize("get-" + this.get('model.fieldAttributes.componentName')));
                    config = {
                        content: this.picklistService[componentField]().sortBy('description'),
                        optionValuePath: 'code',
                        optionLabelPath: 'description',
                        searchable: true
                    };
                }
                return config;
            }
        }
    }),
    isReadOnly: Ember.computed('model.readOnly', 'form.readOnly', {
        get() {
            return this.get('form.readOnly') || this.get('model.readOnly');
        }
    }),
    sectorLabelDtl: Em.computed('model.label', {
        get() {
            let model = this.get('model'), sectorLabel = Em.Object.create({});
            if (Em.isEqual(model.get('type'), 'wb-label') && model.get('label') && model.get('label').split('##').length > 0) {
                sectorLabel.setProperties({
                    labelName: model.get('label').split('##')[1],
                    labelValue: model.get('label').split('##').get('lastObject')
                });
            }
            return sectorLabel;
        }
    }),
    //TODO: the code need to be removed once test was done
    // onRadioChangeRefresh() {
    //     var st = this.get('store'),
    //         params = this.get('esraService').getParam(),
    //         record = st.peekRecord('assessmentDetail', params.dealId);
    //     this.showLoadingIndicator();
    //     record.save({ adapterOptions: { actionType: 'REFRESH' } }).then((success) => {
    //         let status = success.get("esraActivity.statusDesc");
    //         this.model.setProperties({
    //             navConfig: this.get('esraService').getNavConfig(success.get("esraActivity")),
    //             esraActivityStatus: this.get("esraService").statusActivity(status)
    //         });
    //         this.hideLoadingIndicator();
    //     });
    // },
    actions: {
        onValueChange() {
            if (this.get('model.refreshOnChange') && this.get('model.isFieldDirty')) {
                this.sendAction('doRefresh', '/refresh');
            } else {
                let unAnsweredQuestion = this.get('esraService').getProperty('dealAssessmentDetailsModel').get('fsData.fsFields').filter(item => {
                    if (item.get('visible') && Ember.isEqual(item.get('type'), 'wb-radio') && Ember.isEqual(item.get('value'), null)) {
                        return item;
                    }
                });
                if (!unAnsweredQuestion.length) {
                    this.sendAction('doRefresh', '/refresh');
                }
            }
        }
    }
});
