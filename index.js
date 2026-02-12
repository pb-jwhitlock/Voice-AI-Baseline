const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

// The createRetellClient is not directly used for generating bot responses in this conversational model.
// It would be used for API calls to Retell (e.g., registering calls, updating agent status),
// but for direct response generation in the webhook, we're building the response ourselves.
// const { createRetellClient } = require('./utils/retellClient');

const app = express();
app.use(bodyParser.json());

// const client = createRetellClient(); // No longer needed for direct bot response generation

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

// Conversational state for each call
const callStates = {};

const handleRetellWebhook = async (req, res) => {
  const event = req.body;
  const callId = event.call_id;

  if (!callStates[callId]) {
    callStates[callId] = {
      state: 'COLLECT_NAME',
      name: '',
      phone: '',
      serviceIssue: '',
    };
  }

  const currentCallState = callStates[callId];

  let botResponse = {
    response_type: 'response_type_text',
    text: 'I am sorry, I do not understand. Could you please start over?', // Default response
  };

  switch (event.event_type) {
    case 'call_started':
      botResponse.text = 'Hello, thank you for calling. May I have your name?';
      break;

    case 'call_ended':
      delete callStates[callId];
      // Here you might trigger follow-up actions like sending lead to CRM
      break;

    case 'turn_ended': // Retell sends 'turn_ended' when bot or user finishes speaking
      const lastUserUtterance = event.transcript && event.transcript.findLast(t => t.role === 'user');
      const userText = lastUserUtterance ? lastUserUtterance.content : '';

      switch (currentCallState.state) {
        case 'COLLECT_NAME':
          // Extract name from userText
          const nameMatch = userText.match(/(?:my name is|i am)\s+([a-z\s]+)/i);
          currentCallState.name = nameMatch ? nameMatch[1].trim() : 'there'; // Default to 'there' if name not found
          currentCallState.state = 'COLLECT_PHONE';
          botResponse.text = `Thank you ${currentCallState.name}. And what is your callback number?`;
          break;

        case 'COLLECT_PHONE':
          const phoneMatch = userText.match(/(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/);
          if (phoneMatch) {
            currentCallState.phone = phoneMatch[1];
            currentCallState.state = 'COLLECT_ISSUE';
            botResponse.text = 'Thank you. And what is the nature of your service issue?';
          } else {
            botResponse.text = 'I did not catch that. Could you please repeat your 10-digit callback number?';
          }
          break;

        case 'COLLECT_ISSUE':
          currentCallState.serviceIssue = userText;
          storeLead({
            name: currentCallState.name,
            phone: currentCallState.phone,
            serviceIssue: currentCallState.serviceIssue,
          });
          currentCallState.state = 'COMPLETED';
          botResponse.text = `Thank you, ${currentCallState.name}. We have recorded your issue as ${currentCallState.serviceIssue}. Someone will contact you shortly.`;
          break;

        case 'COMPLETED':
          // Conversation is completed, perhaps just acknowledge or end the call
          botResponse.text = 'Your request has been noted. Goodbye.';
          break;

        default:
          botResponse.text = 'I am sorry, I do not understand. Could you please start over?';
          break;
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.event_type}`);
      botResponse.text = 'I am sorry, I do not understand. Could you please start over?';
      break;
  }

  res.json(botResponse);
};

// Export app and handleRetellWebhook for server setup and testing
module.exports = {
  storeLead,
  getLeads,
  clearLeads,
  handleRetellWebhook,
  app,
  callStates, // Export callStates for testing
};

const PORT = process.env.PORT || 8080;
if (require.main === module) {
  app.post('/webhooks/retell', handleRetellWebhook);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}