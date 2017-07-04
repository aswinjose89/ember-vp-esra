import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('wb-esra-workflow-history', 'Integration | Component | wb esra workflow history', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{wb-esra-workflow-history}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#wb-esra-workflow-history}}
      template block text
    {{/wb-esra-workflow-history}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
