import { moduleForModel, test } from 'ember-qunit';

moduleForModel('deal-team-member', 'Unit | Serializer | deal team member', {
  // Specify the other units that are required for this test.
  needs: ['serializer:deal-team-member']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
