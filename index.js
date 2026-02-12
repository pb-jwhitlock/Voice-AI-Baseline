// Placeholder for lead data storage
let leads = [];

// Placeholder functions for storing and retrieving lead data
const storeLead = (lead) => {
  leads.push(lead);
  return lead;
};

const getLeads = () => {
  return leads;
};

const clearLeads = () => {
  leads = [];
};

module.exports = {
  storeLead,
  getLeads,
  clearLeads,
};