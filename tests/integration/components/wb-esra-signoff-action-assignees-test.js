import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('wb-esra-signoff-action-assignees', 'Integration | Component | wb esra signoff action assignees', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{wb-esra-signoff-action-assignees}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#wb-esra-signoff-action-assignees}}
      template block text
    {{/wb-esra-signoff-action-assignees}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
