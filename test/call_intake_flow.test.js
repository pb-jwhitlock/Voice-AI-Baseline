const assert = require('assert');
const sinon = require('sinon');
// const { createRetellClient } = require('../utils/retellClient'); // Not needed for direct bot response generation
const { handleRetellWebhook, getLeads, clearLeads, callStates } = require('../index'); // Import callStates

describe('Standard Call Intake Flow', () => {
  let leadsBefore;

  beforeEach(() => {
    // Save leads state before each test
    leadsBefore = [...getLeads()];
    clearLeads(); // Clear leads for a clean slate
    // Clear callStates for a clean slate
    for (const key in callStates) {
      delete callStates[key];
    }
  });

  afterEach(() => {
    sinon.restore(); // Restore all stubs and mocks after each test if any were made in a test

    // Restore leads state after each test
    clearLeads();
    getLeads().push(...leadsBefore);
    // Clear callStates after each test as well to prevent interference
    for (const key in callStates) {
      delete callStates[key];
    }
  });

  it('should initiate a call with a professional greeting', async () => {
    const req = {
      body: {
        event_type: 'call_started',
        call_id: 'test_call_id',
      },
    };
    const res = {
      json: sinon.stub(),
    };

    await handleRetellWebhook(req, res);

    assert.ok(res.json.calledOnce, 'Response should be sent');
    assert.deepStrictEqual(res.json.getCall(0).args[0], {
      response_type: 'response_type_text',
      text: 'Hello, thank you for calling. May I have your name?',
    });
  });

  it('should collect caller name', async () => {
    const res = { json: sinon.stub() };

    // Simulate call_started
    await handleRetellWebhook({ body: { event_type: 'call_started', call_id: 'test_call_id' } }, { json: () => {} });

    // Simulate turn_ended with user name
    const reqUserName = {
      body: {
        event_type: 'turn_ended',
        call_id: 'test_call_id',
        transcript: [{ role: 'user', content: 'My name is John Doe' }],
      },
    };
    await handleRetellWebhook(reqUserName, res);

    assert.ok(res.json.calledOnce, 'Response should be sent');
    assert.deepStrictEqual(res.json.getCall(0).args[0], {
      response_type: 'response_type_text',
      text: 'Thank you John Doe. And what is your callback number?',
    });
    assert.strictEqual(callStates['test_call_id'].name, 'John Doe', 'Name should be stored in callState');
  });

  it('should collect and validate callback number', async () => {
    const res = { json: sinon.stub() };

    // Simulate call_started -> COLLECT_NAME
    await handleRetellWebhook({ body: { event_type: 'call_started', call_id: 'test_call_id' } }, { json: () => {} });
    await handleRetellWebhook({ body: { event_type: 'turn_ended', call_id: 'test_call_id', transcript: [{ role: 'user', content: 'My name is Jane' }] } }, { json: () => {} });

    // Simulate turn_ended with user phone
    const reqUserPhone = {
      body: {
        event_type: 'turn_ended',
        call_id: 'test_call_id',
        transcript: [{ role: 'user', content: 'My number is 555-123-4567' }],
      },
    };
    await handleRetellWebhook(reqUserPhone, res);

    assert.ok(res.json.calledOnce, 'Response should be sent');
    assert.deepStrictEqual(res.json.getCall(0).args[0], {
      response_type: 'response_type_text',
      text: 'Thank you. And what is the nature of your service issue?',
    });
    assert.strictEqual(callStates['test_call_id'].phone, '555-123-4567', 'Phone should be stored in callState');
  });

  it('should collect service issue details and store lead', async () => {
    const res = { json: sinon.stub() };

    // Simulate call_started -> COLLECT_NAME -> COLLECT_PHONE
    await handleRetellWebhook({ body: { event_type: 'call_started', call_id: 'test_call_id' } }, { json: () => {} });
    await handleRetellWebhook({ body: { event_type: 'turn_ended', call_id: 'test_call_id', transcript: [{ role: 'user', content: 'My name is Alice' }] } }, { json: () => {} });
    await handleRetellWebhook({ body: { event_type: 'turn_ended', call_id: 'test_call_id', transcript: [{ role: 'user', content: '555-987-6543' }] } }, { json: () => {} });

    // Simulate turn_ended with service issue
    const reqUserIssue = {
      body: {
        event_type: 'turn_ended',
        call_id: 'test_call_id',
        transcript: [{ role: 'user', content: 'My toilet is overflowing' }],
      },
    };
    await handleRetellWebhook(reqUserIssue, res);

    assert.ok(res.json.calledOnce, 'Response should be sent');
    const storedLeads = getLeads();
    assert.strictEqual(storedLeads.length, 1, 'A lead should have been stored');
    assert.deepStrictEqual(storedLeads[0], {
      name: 'Alice',
      phone: '555-987-6543',
      serviceIssue: 'My toilet is overflowing',
    });
    assert.strictEqual(callStates['test_call_id'].serviceIssue, 'My toilet is overflowing', 'Service issue should be stored in callState');
  });

  it('should handle invalid phone number input', async () => {
    const res = { json: sinon.stub() };

    // Simulate call_started -> COLLECT_NAME
    await handleRetellWebhook({ body: { event_type: 'call_started', call_id: 'test_call_id' } }, { json: () => {} });
    await handleRetellWebhook({ body: { event_type: 'turn_ended', call_id: 'test_call_id', transcript: [{ role: 'user', content: 'My name is Bob' }] } }, { json: () => {} });

    // Simulate turn_ended with invalid phone
    const reqInvalidPhone = {
      body: {
        event_type: 'turn_ended',
        call_id: 'test_call_id',
        transcript: [{ role: 'user', content: 'invalid phone' }],
      },
    };
    await handleRetellWebhook(reqInvalidPhone, res);

    assert.ok(res.json.calledOnce, 'Response should be sent');
    assert.deepStrictEqual(res.json.getCall(0).args[0], {
      response_type: 'response_type_text',
      text: 'I did not catch that. Could you please repeat your 10-digit callback number?',
    });
    assert.strictEqual(getLeads().length, 0, 'No lead should be stored for invalid phone');
    assert.strictEqual(callStates['test_call_id'].state, 'COLLECT_PHONE', 'State should remain COLLECT_PHONE');
  });

  it('should handle call_ended event and clear state', async () => {
    // Simulate a call that has progressed
    await handleRetellWebhook({ body: { event_type: 'call_started', call_id: 'test_call_id_end' } }, { json: () => {} });
    await handleRetellWebhook({ body: { event_type: 'turn_ended', call_id: 'test_call_id_end', transcript: [{ role: 'user', content: 'My name is Eve' }] } }, { json: () => {} });

    // Ensure state exists before ending
    assert.ok(callStates['test_call_id_end'], 'Call state should exist before call_ended');

    const req = {
      body: {
        event_type: 'call_ended',
        call_id: 'test_call_id_end',
      },
    };
    const res = { json: sinon.stub() };

    await handleRetellWebhook(req, res);

    assert.ok(res.json.calledOnce, 'Response should be sent');
    assert.strictEqual(callStates['test_call_id_end'], undefined, 'Call state should be cleared after call_ended');
  });
});
