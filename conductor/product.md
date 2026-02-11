# Product Definition: B2B Voice AI for Plumbing/Roofing Trades

## Initial Concept
A B2B Voice AI for Plumbing/Roofing trades, focusing on 24/7 lead capture and emergency triage using Retell AI.

## Primary Goal
To provide a specialized Voice AI solution for plumbing and roofing contractors, enabling 24/7 lead capture, efficient emergency call triage, and automated technician alerting, thereby preventing lost business due to unanswered calls and ensuring rapid response to critical situations.

## Target Users
The primary audience consists of small independent plumbing and roofing contractors who are often working in the field and cannot answer the phone. These are B2B clients looking for a reliable way to capture leads and prioritize emergency service calls (triage) 24/7.

## Essential Features
*   **24/7 Automated Call Reception:** Professional greeting for trade businesses.
*   **Lead Capture & Validation:** Capturing caller names, callback numbers, and job types.
*   **Emergency Triage Logic:** Listening for "Priority 1" keywords (flood, gas leak, burst pipe).
*   **Retell AI Integration:** Low-latency conversational voice engine.
*   **Technician Alerting:** Immediate notification system for high-priority emergencies.
*   **CRM Integration Placeholder:** Preparing data to be sent to tools like Jobber or ServiceTitan.

## Unique Selling Propositions
*   **Trade-Specific Triage:** Unlike generic assistants, this is purpose-built to recognize trade emergencies (e.g., distinguishing a "leaky faucet" from a "burst pipe").
*   **Sub-Second Latency (Retell AI):** Provides a near-human conversational experience that prevents "hang-up" frustration during high-stress emergencies.
*   **Immediate Speed-to-Lead:** Captures and validates lead data instantly, ensuring contractors never lose a job to a competitor while they are "on the tools."
*   **Automated Technician Escalation:** Bypasses manual dispatching by instantly alerting the crew to high-priority "Priority 1" keywords.

## Technical Requirements & Constraints
*   **Node.js Environment:** The project must run within the Node.js runtime (v18 or higher).
*   **Retell AI SDK Integration:** Primary voice processing and LLM orchestration must use the Retell AI libraries.
*   **Websocket & Webhook Support:** The system must be capable of handling real-time audio streams and status callbacks.
*   **Scalable Configuration:** Use environment variables (.env) for all API keys to allow for easy "cloning" for different LLC clients.
*   **Stateless Triage Logic:** Emergency keyword detection must be performed in real-time during the conversation.
*   **Walled Garden Security:** All data and code must remain within the specific project directory to maintain privacy and isolation.
