import Ember from 'ember';
import WbEsraMixinMixin from 'wb-ui-esra/mixins/wb-esra-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | wb esra mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let WbEsraMixinObject = Ember.Object.extend(WbEsraMixinMixin);
  let subject = WbEsraMixinObject.create();
  assert.ok(subject);
});
