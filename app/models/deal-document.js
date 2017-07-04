import DS from 'ember-data';

export default DS.Model.extend({
    description: DS.attr('string'),
    fileName: DS.attr('string'),
    documentId: DS.attr('string'),
    docCategory: DS.attr('string'),
    userPsid: DS.attr('string'),
    userName: DS.attr('string'),
    updatedDt: DS.attr('number'),
    overWriteFlag: DS.attr('string'),
    dealId: DS.attr('string'),
    updatedDtValue: DS.attr('string'),
    userDisplay: DS.attr('string'),
    activityId: DS.attr('string'),
    activityList: DS.attr('string'),
    activityTransactionId: DS.attr('string'),
    countryCode: DS.attr('string'),
    dealName: DS.attr('string'),
    docCategoryStr: DS.attr('string'),
    docType: DS.attr('string'),
    fileNetDocId: DS.attr('string'),
    maxSizeExceed: DS.attr('string'),
    operation: DS.attr('string'),
    sequence: DS.attr('string'),
    transactionId: DS.attr('string'),
    updatedAt: DS.attr('number'),
    updatedBy: DS.attr('string'),
    uploadPath: DS.attr('string'),
    docId: DS.attr('string')
});