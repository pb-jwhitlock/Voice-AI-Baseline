# Product Guidelines: B2B Voice AI for Plumbing/Roofing Trades

## Tone and Voice
The Voice AI should project a tone that is Empathetic, Professional, and Urgent. It should embody the demeanor of a calm emergency dispatcher, capable of instilling confidence while efficiently managing critical situations.

*   **Empathetic:** The AI should acknowledge the caller's stress and emotional state, for example, by statements such as, 'I understand you have a leak, let's get this sorted out,' to show understanding and reassurance.
*   **Professional:** The interaction should convey competence and reliability, using phrases like, 'I am capturing your details for our lead technician now,' to establish authority and efficiency.
*   **Urgent:** During emergency calls, the AI must prioritize gathering critical facts quickly, avoiding unnecessary small talk to ensure a swift resolution.

## Conversational Flow and User Experience Principles
The design of the conversational flow and user experience should adhere to principles that optimize for speed, accuracy, and caller satisfaction, especially during high-stress situations.

*   **Speed to Solution:** Minimize introductory fluff. The AI must identify the caller's need (whether it's a Standard request or an Emergency) within the first two exchanges of the conversation.
*   **Active Listening & Confirmation:** Employ 'Verbal Nods' (e.g., 'I see,' 'Understood') to indicate active listening. Crucially, the AI should repeat back key information such as phone numbers and addresses to the caller to ensure accuracy.
*   **Non-Linear Triage:** If a caller explicitly states an emergency early in the conversation (e.g., 'My basement is flooding!'), the AI must immediately skip any standard intake procedures and jump directly to the 'Emergency Protocol.'
*   **Graceful Error Recovery:** When the AI encounters a phrase it doesn't understand, it should ask a simple, clarifying question (e.g., 'I'm sorry, did you say you have a leak or a full burst pipe?') instead of entering a repetitive loop.

## Handling Emergency vs. Standard Calls
The Voice AI must have a clear bifurcated strategy for distinguishing and managing emergency calls from standard service requests to ensure appropriate and timely responses.

*   **Keyword Detection:** Immediately upon call initiation, the AI must scan for 'Priority 1' keywords such as 'flood,' 'burst,' 'gas leak,' 'roof collapse,' or 'sewage backup.'
*   **Bifurcated Flow:**
    *   **Standard:** If no priority keywords are detected, the AI will proceed with a standard intake process, collecting Name, Address, and Service needed, and then offer to book an estimate.
    *   **Emergency:** If a priority keyword is detected, the AI will interrupt the standard flow, confirm safety with the caller (e.g., 'Is the water shut off?'), and immediately trigger a high-priority alert to the relevant technician.
*   **Validation:** In emergency scenarios, the AI must prioritize capturing the caller's phone number first. This ensures the contractor can call back promptly if the connection is lost.

## Data Privacy, Security, and Compliance
Strict guidelines must be followed for data privacy, security, and compliance to protect sensitive caller information and maintain trust.

*   **Data Minimization:** Only necessary Personally Identifiable Information (PII) should be collected, including Name, Phone, Address, and Service Issue. The AI must never request or store sensitive financial data like credit card information or social security numbers.
*   **Encryption:** All call transcripts and lead data must be encrypted both at rest (when stored) and in transit (during transmission), utilizing secure protocols like HTTPS/TLS.
*   **Access Control:** The principle of 'Least Privilege' must be enforced. Only the authorized contractor (client) and designated system administrators should have access to lead data.
*   **Retention Policy:** An automated 30-day retention policy should be implemented for all audio recordings. Recordings will be automatically deleted after this period unless specifically flagged for a legitimate business need, thereby reducing liability.
*   **Compliance Ready:** The conversational workflow must clearly state that the call is being recorded for quality or scheduling purposes, ensuring adherence to TCPA (Telephone Consumer Protection Act) guidelines.

## Managing Updates and Changes
A robust system for managing updates and changes to the triage logic, keyword detection, and service offerings is essential for continuous improvement and adaptability.

*   **Configuration-Driven Logic:** Keyword lists and service offerings must be externalized and stored in separate configuration files (e.g., `config.json` or `.env`). This approach enables dynamic updates to the 'Emergency' list without requiring modifications to the core engine.
*   **Modular Triage Engine:** The triage logic should be developed as a standalone module. This modularity ensures that changes to how the AI 'decides' an emergency do not inadvertently affect other functionalities like 'Lead Capture' or 'API Integration' modules.
*   **Versioned Deployments:** Utilize Git branching strategies for managing logic changes. New keyword detection algorithms or conversational flows must be thoroughly tested in a 'Staging' environment before being deployed to a live contractor's phone line.
*   **Iterative Refinement:** Establish a 'Feedback Loop' mechanism where call transcripts are regularly reviewed (e.g., weekly). This process aims to identify new keywords or phrases callers use during crises, which can then be iteratively added to the configuration to enhance the AI's detection capabilities.
