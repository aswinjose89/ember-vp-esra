import { moduleForModel, test } from 'ember-qunit';

moduleForModel('esra-audit-trail', 'Unit | Serializer | esra audit trail', {
  // Specify the other units that are required for this test.
  needs: ['serializer:esra-audit-trail']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
