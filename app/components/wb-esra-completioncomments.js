import Ember from 'ember';
import detailConfig from '../utils/detail-config';

const {
    Component,
    computed,
    A,
    inject
} = Ember;

export default Component.extend({
    tagName: '',
    store: Em.inject.service('store'),
    esraCommonService: inject.service(),
    deletePopupconfig: detailConfig().get('deleteAttachments'),
    attachmentList: computed('followupTsk', 'followupTsk.documents', 'followupTsk.completedBy',
        'followupTsk.referredToEsrmBy', 'followupTsk.esrmApprovedBy', 'signoffActivity', {
            get() {
                let followupTsk = this.get('followupTsk'),
                    aoCompletedBy = this.get('followupTsk.completedBy'),
                    referredToEsrmBy = this.get('followupTsk.referredToEsrmBy'),
                    esrmApprovedBy = this.get('followupTsk.esrmApprovedBy'),
                    paramVal = this.get('esraCommonService').getParam(),
                    dealParam = { dealId: paramVal.dealId },
                    signoffActivity = this.get('signoffActivity'),
                    filteredAoAttmnt,
                    filteredReferToEsrmAttmt,
                    filteredEsrmApproverAttmt;
                let attachmentList = Em.Object.create({
                    aoAttachment: Em.A([]),
                    referToEsrmAttachment: Em.A([]),
                    esrmApproverAttachment: Em.A([]),
                });
                this.get('store').query("dealDocument", dealParam).then(dealDoc => {
                    followupTsk.get('documents').forEach(val => {
                        filteredAoAttmnt = (aoCompletedBy) ? dealDoc.filter(deal => {
                            return deal.get('docId') === val.docId.toString() && aoCompletedBy.split('-').get('firstObject').trim() === deal.get('userPsid')
                        }) : Em.A([]);
                        filteredReferToEsrmAttmt = (referredToEsrmBy) ? dealDoc.filter(deal => {
                            return deal.get('docId') === val.docId.toString() && referredToEsrmBy.split('-').get('firstObject').trim() === deal.get('userPsid')
                        }) : Em.A([]);
                        filteredEsrmApproverAttmt = (esrmApprovedBy) ? dealDoc.filter(deal => {
                            return deal.get('docId') === val.docId.toString() && esrmApprovedBy.split('-').get('firstObject').trim() === deal.get('userPsid')
                        }) : Em.A([]);
                        // filteredAttachment = dealDoc.filterBy('docId', val.docId.toString());
                        if (this.get('esraCommonService').isDefined(filteredAoAttmnt)) {
                            let attachmentFile = Em.Object.create(filteredAoAttmnt.get('firstObject').toJSON());
                            if (Em.isEqual(signoffActivity.get('signoffTaskReadonly'), "V") || ["0006"].contains(followupTsk.get('taskStatus')) || this.get('esraActivity.locked')) {
                                attachmentFile.set('isReadOnlyFile', true);
                            }
                            attachmentList.get('aoAttachment').pushObject(attachmentFile);
                        }
                        if (this.get('esraCommonService').isDefined(filteredReferToEsrmAttmt)) {
                            let attachmentFile = Em.Object.create(filteredReferToEsrmAttmt.get('firstObject').toJSON());
                            if (Em.isEqual(signoffActivity.get('signoffTaskReadonly'), "V") || ["0006"].contains(followupTsk.get('taskStatus')) || this.get('esraActivity.locked')) {
                                attachmentFile.set('isReadOnlyFile', true);
                            }
                            attachmentList.get('referToEsrmAttachment').pushObject(attachmentFile);
                        }
                        if (this.get('esraCommonService').isDefined(filteredEsrmApproverAttmt)) {
                            let attachmentFile = Em.Object.create(filteredEsrmApproverAttmt.get('firstObject').toJSON());
                            if (Em.isEqual(signoffActivity.get('signoffTaskReadonly'), "V") || ["0006"].contains(followupTsk.get('taskStatus')) || this.get('esraActivity.locked')) {
                                attachmentFile.set('isReadOnlyFile', true);
                            }
                            attachmentList.get('esrmApproverAttachment').pushObject(attachmentFile);
                        }

                    });
                });
                return attachmentList;
            }
        }),
    actions: {
        deleteFileAction(file) {
            this.sendAction('deleteFileAction', file);
        },
        fileDownload(file) {
            this.sendAction('fileDownload', file);
        }
    }
});
