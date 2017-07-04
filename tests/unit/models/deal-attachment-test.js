import { moduleForModel, test } from 'ember-qunit';

moduleForModel('deal-attachment', 'Unit | Model | deal attachment', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
