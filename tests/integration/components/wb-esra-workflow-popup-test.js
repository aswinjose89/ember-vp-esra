import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('wb-esra-workflow-popup', 'Integration | Component | wb esra workflow popup', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{wb-esra-workflow-popup}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#wb-esra-workflow-popup}}
      template block text
    {{/wb-esra-workflow-popup}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
