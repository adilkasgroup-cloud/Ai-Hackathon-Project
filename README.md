@@ -0,0 +1,100 @@
# Crop Doctor Malawi

AI-powered crop disease and pest diagnosis for smallholder farmers in Malawi, in **English, Chichewa and Tumbuka**.

A farmer photographs a sick leaf, stem or cob. The app identifies the most likely disease or pest, shows how confident it is, and gives practical, safe next steps. When the AI is unsure, the farmer can send the case to a human **extension officer**.

> Built for an AI hackathon. Crop Doctor is a decision-support tool, not a replacement for an agricultural expert. Always follow product labels and local extension advice.

## The problemAdd a comment on line R9Add diff commentMarkdown input:  edit mode selected.WritePreviewHeadingBold(control b) control⌃ bBItalic(control i) control⌃ iIQuote(control shift right angle bracket) control⌃ shift⇧ right angle bracket>Code(control e) control⌃ eELink(control k) control⌃ kKUnordered list(control 8) control⌃ 88Numbered list(control shift ampersand) control⌃ shift⇧ ampersand&Task list(control shift l) control⌃ shift⇧ lLMentionReferenceMore itemsSaved repliesAdd FilesPaste, drop, or click to add filesCancelComment

A farmer can lose a large part of a maize or tobacco harvest when a pest or disease is spotted too late. Extension officers are few, and advice is often not available in the farmer's own language.

## Features

1. **Photo diagnosis (free, no account needed).** Upload a crop photo and get the likely problem, a confidence score, treatment steps and prevention tips, in the farmer's language.
2. **Safety first.** Advice starts with low-risk practices (scouting, hand-picking, crop rotation). The app never gives pesticide doses, and a safety filter checks every result. Low confidence or unclear photos always point the farmer to an expert.
3. **Send to an extension officer.** Farmers with an account can send uncertain cases to an officer and see the reply in **My Case Replies**.

Also included: an AI crop chat assistant and a bioscience pathogen workbench.

## How the AI works

- The photo is sent to the **Gemini API** from the app's own server (the API key never reaches the browser).
- Gemini returns a structured result: crop, problem, category, severity, confidence, steps, prevention and a safety note, written in the chosen language.
- A safety layer (`src/utils/safetyFilter.ts`) then checks the result before it is shown: it removes dose-like instructions and forces expert referral when confidence is low.
- With no API key set, the app runs in **Demo mode** with sample cases, so it can always be tried.

## Accounts and roles

Anyone can diagnose a crop without signing up. An account is only needed to send cases to an officer and see replies.

- **Sign in / sign up** with Google, email and password, or phone number (SMS code).
- **Farmer** is the default role for everyone.
- **Extension officer** accounts must be **approved by an administrator**. Choosing "Extension officer" at sign-up files a request; until approved, the person has farmer access.
- **Admin** is set by hand in Firestore. It can never be granted from the app.
- Users cannot change their own role. This is enforced in `firestore.rules` and again on the server (`serverAuth.ts`).

## Tech stack

React 19, TypeScript, Vite, Tailwind CSS, Express (Node), Firebase Authentication and Firestore, Google Gemini API.

## Getting started

You need [Bun](https://bun.sh) (or Node.js with npm) and a Firebase project.

```bash
git clone https://github.com/adilkasgroup-cloud/Ai-Hackathon-Project.git
cd Ai-Hackathon-Project
bun install
```

Create a `.env` file (see `.env.example`):

```
GEMINI_API_KEY="your-gemini-api-key"
```

Start the app:

```bash
bun run dev
```

Open http://localhost:3000. Without a Gemini key the app runs in Demo mode.

Other commands: `bun run lint` (type check) and `bun run build` (production build).

## Firebase setup

1. Put your Firebase web config in `firebase-applet-config.json`.
2. In **Authentication > Sign-in method**, enable **Google**, **Email/Password** and **Phone**.
3. In **Authentication > Settings > Authorized domains**, add the domain you deploy to. For phone sign-in, also allow Malawi (+265) under **SMS region policy**.
4. Publish the security rules: `firebase deploy --only firestore:rules` (or paste `firestore.rules` into the Firebase console).
5. Create your first admin by setting `role` to `admin` on your own document in the `users` collection.

## Project structure

```
server.ts                 Express server: Gemini calls, escalation and chat APIs
serverAuth.ts             Verifies Firebase tokens and enforces roles on the API
firestore.rules           Database security rules (role locking)
src/context/AuthContext   Sign-in, sign-up and role state
src/components/           UI: photo upload, diagnosis result, officer portal, auth page
src/utils/safetyFilter.ts Safety checks applied to every diagnosis
src/data/                 Translations, sample cases and consent text
```

## Limitations and next steps

- Chichewa and Tumbuka text is AI-generated and should be **reviewed by native speakers** before real farmers rely on it.
- Diagnosis from a single photo is uncertain. Many problems look alike, which is why confidence scores and officer escalation exist.
- Ideas: SMS or WhatsApp delivery, offline support, outbreak maps for officers, and feeding officer corrections back to improve the AI.

## Privacy

The app stores the name, phone number, district and photos that users choose to submit, and only so an officer can respond about their crop. Users give consent when they create an account.

## License

No license has been chosen yet. 