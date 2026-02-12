const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const fs = require('fs');

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

// Load emergency keywords
const emergencyKeywords = JSON.parse(fs.readFileSync('./config/keywords.json', 'utf8')).emergencyKeywords.map(k => k.toLowerCase());

// Conversational state for each call
const callStates = {};

// Helper function to detect emergency keywords
const detectEmergency = (text) => {
  const lowerText = text.toLowerCase();
  return emergencyKeywords.some(keyword => lowerText.includes(keyword));
};

// Placeholder for technician alerting system
// ANSI escape codes for styling
const RESET = "\x1b[0m";
const BG_RED = "\x1b[41m";
const FG_WHITE = "\x1b[37m";
const BRIGHT = "\x1b[1m";

const triggerTechnicianAlert = (emergencyDetails) => {
  const details = JSON.stringify(emergencyDetails, null, 2);
  const lines = details.split('\n');
  const maxLength = lines.reduce((max, line) => Math.max(max, line.length), 0);
  const border = '***' + '*'.repeat(maxLength) + '***';

  console.log(BG_RED + FG_WHITE + BRIGHT + border + RESET);
  console.log(BG_RED + FG_WHITE + BRIGHT + `*** EMERGENCY ALERT ***` + ' '.repeat(maxLength - 17) + '***' + RESET);
  console.log(BG_RED + FG_WHITE + BRIGHT + border + RESET);
  lines.forEach(line => {
    console.log(BG_RED + FG_WHITE + BRIGHT + `* ${line}` + ' '.repeat(maxLength - line.length + 1) + '*' + RESET);
  });
  console.log(BG_RED + FG_WHITE + BRIGHT + border + RESET);
  // In a real system, this would also send an SMS, email, webhook, etc.
};


const handleRetellWebhook = async (req, res) => {
  const event = req.body;
  const callId = event.call_id;

  if (!callStates[callId]) {
    callStates[callId] = {
      state: 'COLLECT_NAME',
      name: '',
      phone: '',
      serviceIssue: '',
      emergencyDetected: false,
      emergencyAddress: '', // Initialize emergency address
      initialEmergencyReason: '', // To store the initial phrase that triggered emergency
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

      // Check for emergency keywords first (only if not already in emergency flow)
      if (!currentCallState.emergencyDetected && detectEmergency(userText)) {
        currentCallState.emergencyDetected = true;
        currentCallState.initialEmergencyReason = userText; // Capture the reason
        currentCallState.state = 'EMERGENCY_CONFIRMATION';
        botResponse.text = 'I understand this is an emergency. Can you confirm your current location and is it safe?';
        res.json(botResponse);
        return;
      }

      switch (currentCallState.state) {
        case 'COLLECT_NAME':
          const nameMatch = userText.match(/(?:my name is|i am)\s+([a-zA-Z\s]+)/i);
          if (nameMatch) {
            currentCallState.name = nameMatch[1].trim();
            currentCallState.state = 'COLLECT_PHONE';
            botResponse.text = `Thank you ${currentCallState.name}. And what is your callback number?`;
          } else {
            botResponse.text = 'I did not catch your name. Can you please state your name?';
            // state remains COLLECT_NAME
          }
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

        case 'EMERGENCY_CONFIRMATION':
          // Assume user confirms safety/location and asks for address
          currentCallState.emergencySafetyConfirmation = userText; // Store confirmation
          currentCallState.state = 'EMERGENCY_COLLECT_ADDRESS';
          botResponse.text = 'Thank you for confirming. Can you provide the exact address of the emergency?';
          break;

        case 'EMERGENCY_COLLECT_ADDRESS':
          currentCallState.emergencyAddress = userText;
          module.exports.triggerTechnicianAlert({
            name: currentCallState.name,
            phone: currentCallState.phone, // Phone might not be collected yet
            serviceIssue: currentCallState.initialEmergencyReason, // Use the initial reason for service issue
            emergencyAddress: currentCallState.emergencyAddress,
            emergencyDetected: currentCallState.emergencyDetected,
            safetyConfirmation: currentCallState.emergencySafetyConfirmation,
          });
          botResponse.text = `Thank you. We have the address as ${currentCallState.emergencyAddress}. Help will be dispatched immediately.`;
          currentCallState.state = 'COMPLETED_EMERGENCY';
          break;

        case 'COMPLETED':
          // Conversation is completed, perhaps just acknowledge or end the call
          botResponse.text = 'Your request has been noted. Goodbye.';
          break;
        
        case 'COMPLETED_EMERGENCY':
          botResponse.text = 'Thank you. Help is on the way. Goodbye.';
          break;


        default:
          botResponse.text = 'I am sorry, I do not understand. Could you please start over?';
          break;
      }
      break;

    default:
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
  callStates,
  triggerTechnicianAlert, // Export for testing
};

const PORT = process.env.PORT || 8080;
if (require.main === module) {
  app.post('/webhooks/retell', handleRetellWebhook);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}