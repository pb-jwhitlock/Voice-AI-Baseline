const assert = require('assert');
const sinon = require('sinon');
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

    // Simulate turn_ended with service issue (non-emergency)
    const reqUserIssue = {
      body: {
        event_type: 'turn_ended',
        call_id: 'test_call_id',
        transcript: [{ role: 'user', content: 'I have a clogged drain' }], // Changed to non-emergency
      },
    };
    await handleRetellWebhook(reqUserIssue, res);

    assert.ok(res.json.calledOnce, 'Response should be sent');
    const storedLeads = getLeads();
    assert.strictEqual(storedLeads.length, 1, 'A lead should have been stored');
    assert.deepStrictEqual(storedLeads[0], {
      name: 'Alice',
      phone: '555-987-6543',
      serviceIssue: 'I have a clogged drain',
    });
    assert.strictEqual(callStates['test_call_id'].serviceIssue, 'I have a clogged drain', 'Service issue should be stored in callState');
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

  it('should detect emergency keywords and switch to emergency flow', async () => {
    const res = { json: sinon.stub() };

    // Simulate call_started
    await handleRetellWebhook({ body: { event_type: 'call_started', call_id: 'test_call_id' } }, { json: () => {} });

    // Simulate turn_ended with emergency keyword
    const reqEmergency = {
      body: {
        event_type: 'turn_ended',
        call_id: 'test_call_id',
        transcript: [{ role: 'user', content: 'I have a burst pipe!' }],
      },
    };
    await handleRetellWebhook(reqEmergency, res);

    assert.ok(res.json.calledOnce, 'Response should be sent');
    assert.deepStrictEqual(res.json.getCall(0).args[0], {
      response_type: 'response_type_text',
      text: 'I understand this is an emergency. Can you confirm your current location and is it safe?',
    });
    assert.strictEqual(callStates['test_call_id'].state, 'EMERGENCY_CONFIRMATION', 'State should switch to EMERGENCY_CONFIRMATION');
    assert.strictEqual(callStates['test_call_id'].emergencyDetected, true, 'Emergency should be detected');
  });

  it('should continue emergency flow by asking for address', async () => {
    const res = { json: sinon.stub() };

    // Simulate call_started -> EMERGENCY_CONFIRMATION
    await handleRetellWebhook({ body: { event_type: 'call_started', call_id: 'test_call_id' } }, { json: () => {} });
    await handleRetellWebhook({ body: { event_type: 'turn_ended', call_id: 'test_call_id', transcript: [{ role: 'user', content: 'I have a gas leak!' }] } }, { json: () => {} });

    // Simulate turn_ended with user confirming safety/location
    const reqConfirmSafety = {
      body: {
        event_type: 'turn_ended',
        call_id: 'test_call_id',
        transcript: [{ role: 'user', content: 'Yes, it is safe. I am at 123 Main St.' }],
      },
    };
    await handleRetellWebhook(reqConfirmSafety, res);

    assert.ok(res.json.calledOnce, 'Response should be sent');
    assert.deepStrictEqual(res.json.getCall(0).args[0], {
      response_type: 'response_type_text',
      text: 'Thank you for confirming. Can you provide the exact address of the emergency?',
    });
    assert.strictEqual(callStates['test_call_id'].state, 'EMERGENCY_COLLECT_ADDRESS', 'State should move to EMERGENCY_COLLECT_ADDRESS');
  });

  it('should not detect emergency keywords and continue with standard flow', async () => {
    const res = { json: sinon.stub() };

    // Simulate call_started
    await handleRetellWebhook({ body: { event_type: 'call_started', call_id: 'test_call_id' } }, { json: () => {} });

    // Simulate turn_ended with no emergency keyword
    const reqStandard = {
      body: {
        event_type: 'turn_ended',
        call_id: 'test_call_id',
        transcript: [{ role: 'user', content: 'I need a new faucet installed.' }],
      },
    };
    await handleRetellWebhook(reqStandard, res);

    assert.ok(res.json.calledOnce, 'Response should be sent');
    assert.deepStrictEqual(res.json.getCall(0).args[0], {
      response_type: 'response_type_text',
      text: 'I did not catch your name. Can you please state your name?',
    });
    assert.strictEqual(callStates['test_call_id'].state, 'COLLECT_NAME', 'State should remain COLLECT_NAME');
    assert.strictEqual(callStates['test_call_id'].emergencyDetected, false, 'Emergency should not be detected');
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