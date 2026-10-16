# Expert Agricultural Assistant & Diagnostic Guidance System

A practical, high-utility agricultural guidance architecture ensuring farmers receive immediate, direct answers, numbered step-by-step agronomic solutions, seamless text-and-voice consultation without requiring photos, and safe, conservative expert referral protocols.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Key Operational Principles**:
> - **Zero-Photo Diagnostic Capability**: Farmers can describe symptoms via text or voice in the Crop Doctor / Scanner; the system diagnoses immediately without blocking on an image.
> - **Direct Answers First**: Immediate actionable guidance is presented at the top of every response before any follow-ups or background explanations.
> - **Numbered Action Steps**: All multi-step instructions (fertilizer dose calculations, spray schedules, bio-pesticide concoctions, irrigation routines) are rendered as numbered action checklists.
> - **Conservative Crop Scan Recommendation**: Taking a photo is suggested only as a secondary confirmation when symptoms are ambiguous, never as a prerequisite.
> - **Actionable First-Aid Before Referral**: Immediate damage mitigation is always provided before offering any hotline or expert consultation escalation.

---

### 1. Overview & Core Concept

- **What It Does**: Upgrades all farmer-facing AI modules (Crop Scanner/Doctor, Voice Assistant, Livestock Care, Soil Analysis, and Field Chat) to adhere strictly to practical, high-yield agronomic advisory protocols.
- **Target Audience**: Indian farmers managing crops (cotton, sugarcane, soybean, wheat, onion, vegetables) and livestock across varying connectivity conditions, reading or listening in Marathi, Hindi, and English.
- **Key Value**: Eliminates dead-ends where farmers without a clear photo were previously blocked from receiving diagnosis, replacing academic jargon with direct, step-by-step remedies that can be executed in the field today.

---

### 2. User Experience & Visual Design

Following mobile touch-first principles ($44\text{px}+$ touch hitboxes, clear typography hierarchy, zero-pill metadata formatting):

```
+--------------------------------------------------------------+
|  [X]  Crop Doctor & Agronomy Guide                           |
+--------------------------------------------------------------+
|  Active Field: [ विहिरीजवळचे शेत (ऊस) ▾ ]                     |
|                                                              |
|  [ 📷 Upload / Take Photo ]    or    [ ✍️ Describe Symptoms ]  |
|  +--------------------------------------------------------+  |
|  | "Leaves have yellow spots with concentric rings..."    |  |
|  +--------------------------------------------------------+  |
|  [ 🎤 Speak Query ]                      [ 🔍 Get Solution ] |
|                                                              |
|  ==================== DIAGNOSIS RESULT ====================  |
|  DIRECT ANSWER:                                              |
|  Early Blight (अल्टरनेरिया करपा) detected on your crop.      |
|                                                              |
|  STEP-BY-STEP ACTION PLAN:                                   |
|  1. Spray Mancozeb 75% WP @ 2.5 g per liter of water.        |
|  2. Remove and bury severely infected lower leaves.          |
|  3. Avoid overhead sprinkler irrigation during evening.      |
|                                                              |
|  OPTIONAL CONFIRMATION:                                      |
|  📷 If unsure, tap here to upload a leaf photo to verify.    |
|                                                              |
|  [ 🔊 Listen to Advice ]     [ 💾 Save to Farm Diary ]       |
+--------------------------------------------------------------+
```

#### Key User Flows:
1. **Direct Symptom Inquiry (No Photo Needed)**:
   - Farmer opens Crop Doctor or Voice Assistant.
   - Enters symptoms by typing or speaking in Marathi, Hindi, or English.
   - Immediate diagnosis appears with direct verdict, confidence level, and numbered remediation steps.
2. **Ambiguous Symptom & Secondary Photo Prompt**:
   - If symptoms could match multiple pests/diseases, the AI answers directly with the most likely causes and first-aid steps, then gently suggests: *"To confirm between bacterial blight and leaf spot, you can also upload a clear photo of the leaf underside."*
3. **Emergency & Expert Escalation**:
   - If severe toxicity, sudden wilting, or unknown outbreak is detected, the AI provides immediate first-aid steps (e.g., flush soil, isolate plants, cease chemical spray), followed by an optional button to call Kisan Call Center (1800-180-1551) or a local agronomist.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Text-and-Voice Symptom Mode in Crop Scanner**:
  - *Approach*: Add a dual-input mode in `CropScannerModal` allowing farmers to analyze either an uploaded photo OR a typed/voice-dictated symptom description.
  - *Why*: In rural areas, cameras may be scratched, lighting poor, or the problem described over a phone call from a family member. Eliminating photo requirement unlocks 100% accessibility.
  - *Alternative Considered*: Forcing farmers to switch to a separate chatbot was rejected because it fragments diagnostic records and confuses the farmer.

- **Decision 2: Structured Direct-Answer Output Architecture**:
  - *Approach*: Enforce strict JSON schema in `/api/crop/analyze` and `/api/ai/voice-assistant` returning:
    - `directAnswer`: Immediate 1-2 sentence core diagnosis and conclusion.
    - `stepByStepSteps`: Array of clear numbered action points.
    - `recommendedScanReason`: Optional string only populated if visible ambiguity exists.
    - `immediateFirstAid`: Practical emergency steps before any expert contact.
  - *Why*: Prevents AI from rambling with conversational preambles or burying actionable doses in dense paragraphs.

---

### 4. Technical Architecture & Data Strategy

```
┌───────────────────────────────────────────────────────────────┐
│                    Farmer Client (React 19)                   │
│   ┌───────────────────────────┐   ┌───────────────────────┐   │
│   │     CropScannerModal      │   │  VoiceAssistantModal  │   │
│   │  (Photo OR Symptom Text)  │   │   (Voice & Q&A Chat)  │   │
│   └─────────────┬─────────────┘   └───────────┬───────────┘   │
└─────────────────┼─────────────────────────────┼───────────────┘
                  │ POST /api/crop/analyze      │ POST /api/ai/voice-assistant
                  ▼                             ▼
┌───────────────────────────────────────────────────────────────┐
│                 Express Backend Proxy (server.ts)             │
│   ┌───────────────────────────────────────────────────────┐   │
│   │  Agricultural Guidance System Prompts:                │   │
│   │  - Direct Answers First                               │   │
│   │  - Numbered Steps Formatter                           │   │
│   │  - Secondary Photo Prompt Gate                        │   │
│   │  - First-Aid Pre-Escalation Gate                      │   │
│   └───────────────────────────┬───────────────────────────┘   │
│                               │ @google/genai SDK             │
│                               ▼                               │
│              ┌─────────────────────────────────┐              │
│              │    Gemini 3.8 Flash (Multimodal) │              │
│              └─────────────────────────────────┘              │
└───────────────────────────────────────────────────────────────┘
```

#### Files to be Updated:
1. `server.ts`:
   - Update `/api/crop/analyze` to accept `symptomsText` without requiring `imageBase64`.
   - Update system prompts for `/api/crop/analyze`, `/api/ai/voice-assistant`, and `/api/ai/crop-problem` to enforce Direct Answers First, Numbered Steps, and strict rules for photo recommendation and expert escalation.
2. `src/components/CropScannerModal.tsx`:
   - Add dual-tab / toggle for "Photo Scan" and "Symptom Diagnosis" (voice & text input).
   - Display direct answer banner, numbered step list, and contextual scan prompt.
3. `src/components/VoiceAssistantModal.tsx`:
   - Enhance response rendering to cleanly format numbered steps and separate immediate first-aid from expert hotline triggers.
4. `src/locales/translations.ts`:
   - Add localized labels for symptom input, numbered steps, and agricultural guidance in Marathi, Hindi, and English.
