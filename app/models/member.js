import DS from 'ember-data';
import Ember from 'ember';
import { pickListHelper } from '../helpers/picklist-value';
import Constants from '../utils/esra-constant';

const {
    computed,
    inject
} = Ember,
    [dealTeamRoleHash, dealAccessHash] = [
        { type: 'DLPLTEAMROLE' },
        { type: 'DLPLACCESS' }
    ];

export default DS.Model.extend({
    esraCommonService: inject.service(), /*Service to embed the scope in 'this' keyword */
    memberName: DS.attr('string'),
    businessArea: DS.attr('string'),
    dealTeamRole: DS.attr('string'),
    dealAccess: DS.attr('string'),
    memberType: DS.attr('string'),
    dealTeamRoleDesc: computed('dealTeamRole', {
        get() {
            return (this.get('dealTeamRole')) ? pickListHelper.picklistMapping.call(this, this.get('dealTeamRole'), dealTeamRoleHash) : this.get('dealTeamRole');
        }
    }),
    dealAccessDesc: computed('dealAccess', {
        get() {
            return (this.get('dealAccess')) ? pickListHelper.picklistMapping.call(this, this.get('dealAccess'), dealAccessHash) : this.get('dealAccess');
        }
    }),
    memberTypeDesc: computed('memberType', {
        get() {
            let memberType = Constants.memberType.get(this.get('memberType'));
            return (memberType) ? memberType : this.get('memberType');
        }
    }),
    memberNameDesc: computed('memberName','id', {
        get() {
            let memberNameId =`${this.get('id')} - ${this.get('memberName')}`;
            return memberNameId;
        }
    })
});
