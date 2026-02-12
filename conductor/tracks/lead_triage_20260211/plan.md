# Implementation Plan: Implement Core 24/7 Lead Capture and Emergency Triage System

## Phase 1: Core System Setup and Retell AI Integration [checkpoint: 056e72f]

- [x] Task: Set up Node.js Project Structure [ef823ab]
    - [ ] Write tests for initial project setup and dependency management.
    - [ ] Initialize new Node.js project using `npm init`.
    - [ ] Install Express.js and dotenv packages.
    - [ ] Configure `package.json` for basic scripts (start, test).
    - [ ] Implement basic Express server setup with a health check endpoint.
    - [ ] Implement `.env` file for environment variables and API key management.
- [x] Task: Integrate Retell AI SDK [47fead9]
    - [ ] Write tests for Retell AI SDK initialization and basic voice functionality.
    - [ ] Install Retell AI SDK.
    - [ ] Implement Retell AI SDK initialization with API keys from `.env`.
    - [ ] Develop a basic endpoint to receive incoming calls via Retell AI webhook.
    - [ ] Implement initial professional greeting using Retell AI.
- [x] Task: Conductor - User Manual Verification 'Core System Setup and Retell AI Integration' (Protocol in workflow.md) [056e72f]

## Phase 2: Lead Capture and Basic Triage Logic

- [x] Task: Implement Lead Capture Data Model and Storage Placeholder [30f52fe]
    - [ ] Write tests for lead data capture and storage.
    - [ ] Define data structure for captured leads (name, phone, service issue).
    - [ ] Implement a temporary in-memory or file-based storage mechanism for lead data.
    - [ ] Implement functions to store and retrieve lead information.
- [x] Task: Develop Standard Call Intake Flow [6c67495]
    - [ ] Write tests for standard call intake conversational flow.
    - [ ] Design and implement conversational prompts to collect caller name.
    - [ ] Design and implement conversational prompts to collect callback number with validation.
    - [ ] Design and implement conversational prompts to collect service issue details.
    - [ ] Integrate collected data with lead storage placeholder.
- [~] Task: Implement Initial Keyword Detection and Bifurcation
    - [ ] Write tests for keyword detection and call bifurcation logic.
    - [ ] Create a configurable `keywords.json` or similar for "Priority 1" emergency keywords.
    - [ ] Implement real-time audio stream processing to detect emergency keywords.
    - [ ] Implement logic to switch conversational flow based on keyword detection (Standard vs. Emergency).
- [ ] Task: Conductor - User Manual Verification 'Lead Capture and Basic Triage Logic' (Protocol in workflow.md)

## Phase 3: Emergency Protocol and Technician Alerting

- [ ] Task: Develop Emergency Call Flow
    - [ ] Write tests for emergency call conversational flow.
    - [ ] Implement specific prompts for emergency scenarios (e.g., confirming safety).
    - [ ] Prioritize capturing the caller's phone number at the beginning of the emergency flow.
    - [ ] Design and implement conversational prompts to gather critical emergency details.
- [ ] Task: Implement Technician Alerting System (Placeholder)
    - [ ] Write tests for technician alerting trigger.
    - [ ] Define interface for alerting mechanism (e.g., a simple log or mock webhook call).
    - [ ] Implement logic to trigger technician alert upon confirmed emergency.
    - [ ] Capture all relevant emergency details for the alert.
- [ ] Task: Graceful Error Recovery and Active Listening Refinement
    - [ ] Write tests for error recovery scenarios in both standard and emergency flows.
    - [ ] Implement "Verbal Nods" (e.g., "I see," "Understood") in conversational responses.
    - [ ] Implement logic to repeat back key information (e.g., phone numbers, addresses) for confirmation.
    - [ ] Develop clarifying questions for when AI doesn't understand.
- [ ] Task: Conductor - User Manual Verification 'Emergency Protocol and Technician Alerting' (Protocol in workflow.md)

## Phase 4: Security, Compliance, and Modularity

- [ ] Task: Implement Data Minimization and Encryption (Placeholder)
    - [ ] Write tests to ensure sensitive data is not stored unnecessarily.
    - [ ] Ensure all PII collection adheres to data minimization principles.
    - [ ] Implement placeholder for encryption of data at rest (e.g., hashing sensitive fields if stored temporarily).
    - [ ] Verify HTTPS/TLS for data in transit (managed by platform/Express configuration).
- [ ] Task: Develop Modular Triage Engine
    - [ ] Write tests for the standalone triage module.
    - [ ] Refactor triage logic into a separate, modular component.
    - [ ] Ensure triage module can be updated independently.
- [ ] Task: Compliance Ready Features (TCPA)
    - [ ] Write tests for TCPA compliance statements.
    - [ ] Implement clear statements about call recording for quality/scheduling purposes at the start of calls.
- [ ] Task: Conductor - User Manual Verification 'Security, Compliance, and Modularity' (Protocol in workflow.md)
