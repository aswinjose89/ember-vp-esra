import DS from 'ember-data';

export default DS.Model.extend({ 
    workflowDetail:DS.hasMany("workflowDetail")
});

