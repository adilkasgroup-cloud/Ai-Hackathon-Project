# Crop Doctor Malawi

## Problem

Smallholder farmers in Malawi can lose a large part of their maize or tobacco harvest when a pest or disease is identified too late. Agricultural extension officers are few, so most farmers have no quick way to get expert help. Advice that does exist is often hard to reach for farmers in remote areas.

## Solution

Crop Doctor lets a farmer photograph a sick leaf, stem or cob and get an AI diagnosis in seconds. The app names the most likely disease or pest, shows how confident it is, and gives practical, safe next steps and prevention tips. When the AI is unsure, the farmer can send the case to a human **extension officer** and read the reply in the app.

Safety is built in: advice starts with low-risk practices, the app never gives pesticide doses, and low-confidence results always point the farmer to an expert.

> Crop Doctor is a decision-support tool, not a replacement for an agricultural expert. Always follow product labels and local extension advice.

## Features

- **Free photo diagnosis, no account needed.** Upload a crop photo and get the likely problem, a confidence score, treatment steps and prevention tips.
- **Safety filter.** Every result is checked before it is shown: dose and mixing instructions are removed, a licensed agro-dealer reminder is added, and low confidence triggers expert referral.
- **Send to an extension officer.** Signed-in farmers can escalate uncertain cases and see the officer's reply under "My Case Replies".
- **Officer portal.** Approved officers see a queue of cases (photo, AI summary, confidence, farmer's district) and reply to farmers.
- **Secure accounts and roles.** Sign in with Google, email and password, or phone number and password (an SMS code confirms the number once, at sign-up or password reset). Everyone starts as a farmer, officers must be approved by an admin, and users cannot change their own role.
- **AI crop chat.** Ask follow-up farming questions, with optional Google Search grounding.
- **Bioscience workbench.** Reference profiles of common Malawian crop pests and diseases.
- **Demo mode.** Works with sample cases when no API key is set.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js with Express (`server.ts`)
- **Auth and database:** Firebase Authentication and Cloud Firestore, with security rules
- **AI:** Google Gemini API via the `@google/genai` SDK

## AI / API Usage

- **Gemini vision (`gemini-3.8-flash`)** powers photo diagnosis. The server sends the crop photo to Gemini, which returns structured JSON: crop, problem, category, severity, confidence score, treatment steps, prevention and a safety note.
- **Gemini chat** answers follow-up questions in the AI Chat tab. The model can be switched between `gemini-3.8-flash`, `gemini-3.1-flash-lite` and `gemini-4-argon`, and **Google Search grounding** can be turned on to cite sources.
- **Safety layer (`src/utils/safetyFilter.ts`).** Not AI. Rules applied to every Gemini result to strip dosages and force escalation when confidence is low.
- **Firebase Authentication.** Verifies identity. The server checks each user's token and reads their role from Firestore before allowing officer-only actions (`serverAuth.ts`).
- The Gemini API key stays on the server and is never sent to the browser.

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/adilkasgroup-cloud/Ai-Hackathon-Project.git
   cd Ai-Hackathon-Project
   ```
2. **Install dependencies** (needs [Bun](https://bun.sh), or Node.js with npm)
   ```bash
   bun install
   ```
3. **Add environment variables.** Copy `.env.example` to `.env` and fill in your own values. **Do not commit real keys.** `.env` is already in `.gitignore`.
   ```
   GEMINI_API_KEY="your-gemini-api-key"
   ```
   Also put your Firebase web config in `firebase-applet-config.json`, and in the Firebase console:
   - Enable **Google**, **Email/Password** and **Phone** under Authentication > Sign-in method.
   - Add your domain under Authentication > Settings > Authorized domains, and allow Malawi (+265) in the SMS region policy for phone sign-in.
   - Publish the security rules: `firebase deploy --only firestore:rules` (or paste `firestore.rules` into the console).
   - Create your first admin by setting `role` to `admin` on your own document in the `users` collection.
4. **Run the app**
   ```bash
   bun run dev
   ```
   Open http://localhost:3000. Without a Gemini key the app runs in Demo mode.

Other commands: `bun run lint` (type check) and `bun run build` (production build).

## Screenshots

(Add images here)

<!--
Suggested shots: photo upload screen, a diagnosis result,
the sign in page, the "Send to extension officer" dialog, the officer queue.
Save images in a /screenshots folder and link them like:
![Diagnosis result](screenshots/diagnosis.png)
-->

## Team Contributions

- Name: role and what they built *(add your team members here)*
