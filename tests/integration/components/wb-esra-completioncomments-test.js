import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('wb-esra-completioncomments', 'Integration | Component | wb esra completioncomments', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{wb-esra-completioncomments}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#wb-esra-completioncomments}}
      template block text
    {{/wb-esra-completioncomments}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
