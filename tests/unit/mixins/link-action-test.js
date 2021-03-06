import Ember from 'ember';
import LinkActionMixin from 'ember-link-action/mixins/link-action';
import { module, test } from 'qunit';

const { Evented } = Ember;

module('Unit | Mixin | link action');

test('it exists', function(assert) {
  assert.expect(1);

  const LinkActionObject = Ember.Object.extend(LinkActionMixin);
  const subject = LinkActionObject.create();

  assert.ok(subject);
});

test('_sendInvokeAction sends `invokeAction` action', function(assert) {
  assert.expect(2);

  const EXPECTED_ACTION_NAME = 'invokeAction';

  const LinkActionObject = Ember.Object.extend(LinkActionMixin);
  const subject = LinkActionObject.create({
    sendAction(actionName) {
      assert.ok(true, 'sendAction is called');
      assert.equal(actionName, EXPECTED_ACTION_NAME);
    }
  });

  subject._sendInvokeAction();
});

test('_attachActionEvent is called on initialization if invokeAction is specified', function(assert) {
  assert.expect(1);

  const LinkActionObject = Ember.Object.extend(LinkActionMixin);

  LinkActionObject.create({
    invokeAction: 'someAction',
    _attachActionEvent() {
      assert.ok(true, 'sendAction is called');
    }
  });
});

test('_detachActionEvent is called when willDestroyElement is called and invokeAction is specified', function(assert) {
  assert.expect(1);

  const LinkActionObject = Ember.Object.extend(LinkActionMixin);
  const subject = LinkActionObject.create({
    invokeAction: 'someAction',
    _attachActionEvent() {},
    _detachActionEvent() {
      assert.ok(true);
    }
  });

  subject.willDestroyElement();
});

test('_attachActionEvent subscribes _sendInvokeAction to `eventName` event', function(assert) {
  assert.expect(1);

  const EXAMPLE_EVENT_NAME = 'click';

  const LinkActionObject = Ember.Object.extend(LinkActionMixin, Evented);
  const subject = LinkActionObject.create({
    eventName: EXAMPLE_EVENT_NAME,
    _sendInvokeAction() {
      assert.ok(true);
    }
  });

  subject.set('invokeAction', 'someAction');
  subject.trigger(EXAMPLE_EVENT_NAME);

  subject._attachActionEvent();
  subject.trigger(EXAMPLE_EVENT_NAME);
});

test('_detachActionEvent unsubscribes _sendInvokeAction from `eventName` event', function(assert) {
  assert.expect(0);

  const EXAMPLE_EVENT_NAME = 'click';

  const LinkActionObject = Ember.Object.extend(LinkActionMixin, Evented);
  const subject = LinkActionObject.create({
    eventName: EXAMPLE_EVENT_NAME,
    _sendInvokeAction() {
      assert.ok(false);
    }
  });

  subject.set('invokeAction', 'someAction');

  subject._attachActionEvent();

  subject._detachActionEvent();

  subject.trigger(EXAMPLE_EVENT_NAME);
});
