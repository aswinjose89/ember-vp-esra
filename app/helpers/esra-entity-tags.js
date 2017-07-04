import Ember from 'ember';

export function esraEntityTags(params/*, hash*/) {
    if(typeof params[0] !== "undefined"){
        var splitEntityTags = params[0].split('|');
        var arr = splitEntityTags.reduce(function(result, obj) {
            result.push({
                key: obj
            });
            return result;
        }, []);
        return arr;
    } else {
        return Ember.Object.create({});
    }
}

export default Ember.Helper.helper(esraEntityTags);
