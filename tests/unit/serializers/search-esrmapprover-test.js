import { moduleForModel, test } from 'ember-qunit';

moduleForModel('search-esrmapprover', 'Unit | Serializer | search esrmapprover', {
  // Specify the other units that are required for this test.
  needs: ['serializer:search-esrmapprover']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
