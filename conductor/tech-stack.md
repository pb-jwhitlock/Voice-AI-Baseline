# Tech Stack: B2B Voice AI for Plumbing/Roofing Trades

## Overview
This project will leverage a Node.js environment with the Express framework for building the core application. The Retell AI SDK will be integrated for voice processing and conversational AI capabilities. Configuration and sensitive data management will be handled via dotenv (.env) files, adhering to ES6 JavaScript syntax standards.

## Core Technologies

*   **Runtime Environment:** Node.js (v18 or higher)
    *   **Rationale:** Provides a robust and scalable environment for server-side JavaScript execution, suitable for real-time applications like voice AI.
*   **Web Framework:** Express.js
    *   **Rationale:** A fast, unopinionated, minimalist web framework for Node.js, ideal for building APIs and handling webhook/websocket connections efficiently.
*   **Voice AI/LLM Orchestration:** Retell AI SDK
    *   **Rationale:** Chosen for its low-latency conversational voice engine, which is critical for providing a near-human interaction experience and minimizing caller frustration.
*   **Language Standard:** ES6 JavaScript
    *   **Rationale:** Modern JavaScript features enhance code readability, maintainability, and developer productivity.
*   **Configuration Management:** dotenv (.env)
    *   **Rationale:** Facilitates secure and scalable configuration by externalizing API keys and other environment-specific variables, enabling easy "cloning" for different LLC clients and promoting secure development practices.

## Data Management
*   **Approach:** Stateless Triage Logic, focusing on real-time processing during conversations.
*   **Sensitive Data:** Handled via environment variables.

## Integration Points
*   **Websocket & Webhook Support:** Essential for real-time audio streams and status callbacks from the Retell AI platform.
*   **CRM Integration (Placeholder):** Designed to prepare and format lead data for future integration with CRM tools like Jobber or ServiceTitan.
