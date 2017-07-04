import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        showToolTip(data) {
            if (Ember.isArray(data)) {
                data = data.map(x => {
                    return `<li>${x.get('psId') +' - '+ x.get('name')}</li>`;
                }).join('');
            }
            this.mdTooltipManager.open({
                label: Ember.String.htmlSafe(`<ul>${data}</ul>`),
                shownOnOverflow: false,
            });
        },
        hideToolTip() {
            this.mdTooltipManager.close();
        },
        showDateToolTip(data) {
            if (Ember.isArray(data)) {
                data = data.map(x => {
                    return `<li>${x}</li>`;
                }).join('');
            }
            this.mdTooltipManager.open({
                label: Ember.String.htmlSafe(`<ul>${data}</ul>`),
                shownOnOverflow: false,
            });
        }
    }
});
