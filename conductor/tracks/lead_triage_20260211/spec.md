# Track Specification: Implement Core 24/7 Lead Capture and Emergency Triage System

## Overview
This track focuses on developing the foundational components of the B2B Voice AI solution for plumbing and roofing trades. The primary objective is to establish a robust system capable of 24/7 automated call reception, intelligent lead capture, and immediate, trade-specific emergency triage, leveraging Retell AI for low-latency conversational experiences. This system will ensure that no potential customer calls are missed and critical emergencies are escalated without delay.

## Features to be Implemented

### 1. Automated Call Reception & Professional Greeting
*   **Description:** Implement the Voice AI to answer incoming calls 24/7 with a professional, empathetic, and urgent greeting tailored for plumbing and roofing businesses.
*   **Key Aspects:**
    *   Initialize Retell AI for call handling.
    *   Configure initial conversational prompts.

### 2. Lead Capture & Validation
*   **Description:** Systematically capture essential caller information including name, callback number, and the nature of the service request. Validate critical information to ensure accuracy.
*   **Key Aspects:**
    *   Design conversational flows to elicit required information.
    *   Implement validation logic for phone numbers.
    *   Store captured lead data for future CRM integration.

### 3. Emergency Triage Logic
*   **Description:** Develop and integrate a stateless triage engine capable of real-time detection of "Priority 1" keywords to differentiate between standard service requests and emergencies. This logic should allow for non-linear conversational flows.
*   **Key Aspects:**
    *   Implement immediate keyword scanning upon call start.
    *   Define and manage a configurable list of emergency keywords (e.g., flood, gas leak, burst pipe, roof collapse, sewage backup).
    *   Develop a bifurcated conversational flow: Standard intake vs. Emergency Protocol.
    *   Prioritize capturing callback number in emergency scenarios.
    *   Include safety confirmation prompts for emergencies (e.g., "Is the water shut off?").

### 4. Retell AI SDK Integration & Conversational Experience
*   **Description:** Deep integration with the Retell AI SDK to power a low-latency, near-human conversational experience, designed to prevent caller frustration and facilitate efficient information gathering.
*   **Key Aspects:**
    *   Utilize Retell AI for primary voice processing and LLM orchestration.
    *   Ensure sub-second latency for natural dialogue.
    *   Implement active listening and confirmation (verbal nods, repeating info).
    *   Develop graceful error recovery mechanisms for misunderstood speech.

### 5. Technician Alerting for High-Priority Emergencies
*   **Description:** Implement an immediate notification system to alert technicians or relevant personnel when a high-priority emergency is detected, bypassing manual dispatching.
*   **Key Aspects:**
    *   Define alerting mechanism (e.g., webhook, direct message, API call).
    *   Trigger alerts based on confirmed "Priority 1" emergencies.

### 6. Configuration Management for Flexibility
*   **Description:** Implement a robust configuration system using environment variables and potentially a `config.json` for managing dynamic elements like keyword lists and API keys, allowing for easy client cloning and updates.
*   **Key Aspects:**
    *   Centralize keyword lists and service offerings in configuration.
    *   Ensure all API keys are managed via `.env` or `config.json`.

## Technical Considerations

*   **Node.js Environment:** The entire solution must operate within a Node.js runtime (v18 or higher).
*   **Express.js Framework:** Leverage Express.js for building robust APIs and handling webhook/websocket communication.
*   **Websocket & Webhook Support:** Essential for real-time audio streams and status callbacks, particularly with Retell AI.
*   **ES6 JavaScript:** Adhere to modern JavaScript standards for all development.
*   **Walled Garden Security:** All data and code must remain within the specific project directory for privacy and isolation.
*   **Data Privacy:** Implement data minimization, encryption (at rest and in transit), access control (least privilege), 30-day audio retention policy, and TCPA compliance.

## Success Criteria
*   Voice AI successfully answers calls 24/7 with professional greeting.
*   Accurate capture of caller name, phone number, and service issue for non-emergencies.
*   Reliable detection of "Priority 1" keywords in real-time.
*   Correct bifurcation of calls into Standard and Emergency flows.
*   Immediate notification of technicians for confirmed emergencies.
*   Conversational experience feels natural with minimal latency.
*   All critical configurations managed externally via `.env` or `config.json`.
*   Solution operates securely within Node.js, respecting data privacy guidelines.
