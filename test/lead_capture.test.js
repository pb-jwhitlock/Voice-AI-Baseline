const assert = require('assert');

const { storeLead, getLeads, clearLeads } = require('../index');

describe('Lead Capture Data Model and Storage Placeholder', () => {
  beforeEach(() => {
    clearLeads(); // Clear leads before each test
  });

  it('should define a data structure for captured leads', () => {
    const lead = {
      name: 'John Doe',
      phone: '123-456-7890',
      serviceIssue: 'Burst Pipe'
    };
    assert.ok(lead.name, 'Lead should have a name property');
    assert.ok(lead.phone, 'Lead should have a phone property');
    assert.ok(lead.serviceIssue, 'Lead should have a serviceIssue property');
  });

  it('should be able to store a new lead', () => {
    const initialCount = getLeads().length;
    const lead = {
      name: 'Jane Smith',
      phone: '987-654-3210',
      serviceIssue: 'Leaky Faucet'
    };
    const storedLead = storeLead(lead);
    assert.strictEqual(getLeads().length, initialCount + 1, 'Lead count should increase by 1');
    assert.deepStrictEqual(storedLead, lead, 'Stored lead should match the input lead');
    assert.ok(getLeads().includes(lead), 'The new lead should be in the storage');
  });

  it('should be able to retrieve all stored leads', () => {
    const lead1 = { name: 'Lead One', phone: '111', serviceIssue: 'Issue One' };
    const lead2 = { name: 'Lead Two', phone: '222', serviceIssue: 'Issue Two' };
    storeLead(lead1);
    storeLead(lead2);
    const retrievedLeads = getLeads();
    assert.strictEqual(retrievedLeads.length, 2, 'Should retrieve 2 leads');
    assert.deepStrictEqual(retrievedLeads, [lead1, lead2], 'Retrieved leads should match stored leads');
  });

  it('should clear all leads', () => {
    const lead = { name: 'Lead One', phone: '111', serviceIssue: 'Issue One' };
    storeLead(lead);
    assert.strictEqual(getLeads().length, 1, 'Should have 1 lead before clearing');
    clearLeads();
    assert.strictEqual(getLeads().length, 0, 'Should have 0 leads after clearing');
  });
});
