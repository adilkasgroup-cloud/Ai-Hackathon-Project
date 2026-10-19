# Crop Doctor Malawi

## Problem

Smallholder farmers in Malawi can lose a large part of their maize or tobacco harvest when a pest or disease is identified too late. Agricultural extension officers are few, so most farmers have no quick way to get expert help. Advice that does exist is often hard to reach for farmers in remote areas.

## Solution

Crop Doctor lets a farmer photograph a sick leaf, stem or cob and get an AI diagnosis in seconds. The app names the most likely disease or pest, shows how confident it is, and gives practical, safe next steps and prevention tips. When the AI is unsure, the farmer can send the case to a human **extension officer** and read the reply in the app.

Safety is built in: advice starts with low-risk practices, the app never gives pesticide doses, and low-confidence results always point the farmer to an expert.

> Crop Doctor is a decision-support tool, not a replacement for an agricultural expert. Always follow product labels and local extension advice.

## Features

- **Free photo diagnosis, no account needed.** Upload a crop photo (or pick a sample case) and get the likely problem, a confidence score, treatment steps and prevention tips.
- **Safety filter.** Every result is checked before it is shown: dose and mixing instructions are removed, a licensed agro-dealer reminder is added, and low confidence triggers expert referral.
- **Send to an extension officer.** Signed-in farmers can escalate uncertain cases and see the officer's reply under "Cases & Replies".
- **Officer portal.** Extension officers see a queue of cases (photo, AI summary, confidence, farmer's district), filter by district, and reply to farmers.
- **Accounts.** Sign up or sign in with:
  - **Phone number and password.** An SMS code confirms the number once, when the account is created (or the password is reset). After that, the number and password are enough, with no code.
  - **Email and password**, with password reset by email.
  - **Google.**
- **Extension officer sign-up with a 4-digit code.** Anyone who has the officer code can create an officer account. There is no admin approval step. The code is checked by the Firestore security rules, not by the browser.
- **Locked roles.** Everyone else is a farmer, and nobody can change their own role after sign-up.
- **AI crop chat.** Ask follow-up farming questions, with optional Google Search grounding.
- **Bioscience workbench.** Reference profiles of common Malawian crop pests and diseases.
- **Demo mode.** Works with sample cases and demo officer cases when no Gemini API key is set.

## Demo Accounts

Use these to try the app without real accounts. Both phone numbers are Firebase "test phone numbers", so no real SMS is sent.

| Account | Phone number | SMS code | Other |
|---|---|---|---|
| **Demo farmer** | `0999000111` (also written `+265 999 000 111`) | `654321` | Choose **Farmer** on the details form |
| **Demo extension officer** | `0980686893` (also written `+265 980 686 893`) | `123456` | Choose **Extension officer** and enter the officer code `4827` |

**Try it as a farmer**
1. Click **Sign up**, choose **Phone number**, and enter `0999000111`.
2. Enter the code `654321`, then choose a password.
3. Fill in your details and choose **Farmer**.
4. Diagnose a sample crop photo, then use **Send to extension officer** to create a case.
5. Next time, click **Sign in**, enter `0999000111` and your password. No code is asked.

**Try it as an extension officer**
1. Click **Sign up**, choose **Phone number**, and enter `0980686893`. Enter the code `123456`, then choose a password.
2. On the details form choose **Extension officer**, enter the officer code `4827` and your EPA.
3. You land on the officer queue, which already has two demo cases (a maize stalk borer and a tobacco wildfire case) to review and reply to. The case the demo farmer sent also shows up here.

> A phone number can only belong to one account, so each demo number is used for one role. To try the same role twice, use an email address or another number.

**These demo values only work after the setup below.** The phone numbers and codes are Firebase test numbers that you add yourself in step 3 of Setup. The officer code is set in `firestore.rules` (function `officerCode()`). **Change or remove all of them before using the app with real people**, because they are public in this README.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js with Express (`server.ts`, run with `tsx`)
- **Auth and database:** Firebase Authentication (phone, email/password, Google) and Cloud Firestore, protected by security rules (`firestore.rules`)
- **AI:** Google Gemini API via the `@google/genai` SDK

### Project layout

| Path | What it does |
|---|---|
| `server.ts` | Express server: diagnosis, chat, escalation and officer APIs, demo data, serves the web app |
| `serverAuth.ts` | Checks the user's Firebase login token and reads their role, so officer-only routes are enforced on the server |
| `firestore.rules` | Database security rules, including the extension officer code check |
| `src/App.tsx` | App shell and tabs |
| `src/context/AuthContext.tsx` | Sign-in, sign-up, phone + password, roles |
| `src/components/` | Screens: photo upload, diagnosis result, sign in/up page, escalation dialog, officer portal, farmer replies, chat, bioscience workbench |
| `src/data/sampleCases.ts` | The four sample cases and their ready-made results |
| `src/utils/safetyFilter.ts` | Rules that strip dosages and force escalation on low confidence |
| `public/samples/`, `public/demo/` | Sample photos and the photos used in the demo officer cases |
| `src/assets/samples/ATTRIBUTION.md` | Where to credit photo sources |

## AI Methodology and Implementation

Crop Doctor does not train or fine-tune a model. It uses a general Gemini model, gives it strict instructions, and then checks its answer with plain rules before a farmer sees it.

1. **Photo in.** The farmer uploads a photo (and may pick the crop). The browser sends it to our server, never directly to Gemini.
2. **Instructions.** The server sends the photo to Gemini with a system instruction that says: describe only what is physically visible in the photo, give low-risk practices first (scouting, hand-picking, removing infected plants, crop rotation), mention chemicals only as a later option, never give doses, and say so when the photo is unclear.
3. **Structured answer.** Gemini is asked for JSON in a fixed shape (crop, category, diagnosis, visual observations, two alternative diagnoses with how to tell them apart, severity, confidence score, treatment steps, prevention, safety note). The temperature is low (0.2) so answers stay consistent. If the reply is not clean JSON, the server pulls the JSON out of the text.
4. **Safety rules (not AI).** `src/utils/safetyFilter.ts` runs on every result:
   - removes dose and mixing instructions with pattern matching, and adds a reminder to buy registered products from a licensed agro-dealer and follow the label;
   - adds a protective-gear safety note if one is missing;
   - sets the confidence level (high from 80, medium from 65, otherwise low);
   - **forces escalation to a human** when confidence is under 70%, the photo is unclear, or severity is critical.
5. **Human in the loop.** The farmer can send the case, with the photo and the AI summary, to an extension officer. The officer's reply appears in the farmer's "Cases & Replies" tab.
6. **Demo mode.** Without a Gemini API key the server returns the ready-made sample results, so the whole flow can be shown offline.

The AI chat uses the same idea: a system instruction that adapts to the user's role (farmer or extension officer), with optional Google Search grounding so answers can cite sources.

## AI Models and API Usage

| Where | Model | API | What it does |
|---|---|---|---|
| Photo diagnosis (`POST /api/diagnose`) | `gemini-3.8-flash` | Gemini API (`@google/genai`), image input, JSON output | Identifies the likely disease or pest from the photo |
| AI chat (`POST /api/chat`) | `gemini-3.8-flash` (default), switchable to `gemini-3.1-flash-lite` or `gemini-4-argon` | Gemini API, optional Google Search grounding | Answers follow-up farming questions |
| Sign-in | Not AI | Firebase Authentication | Verifies identity. The server checks each user's token and reads their role from Firestore before allowing officer-only actions (`GET /api/escalations`, `PATCH /api/escalations/:id`) |
| Officer cases | Not AI | `POST /api/escalate`, `GET /api/farmer-cases` | Kept in the server's memory, so they reset when the server restarts. Fine for a demo, not for production |

The Gemini API key stays on the server (in `.env`) and is never sent to the browser.

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
3. **Set up Firebase** (console.firebase.google.com). Put your Firebase web config in `firebase-applet-config.json`, then:
   - **Authentication > Sign-in method:** enable **Google**, **Email/Password** and **Phone**. Phone sign-in also needs Email/Password switched on, because phone + password uses it.
   - **Authentication > Sign-in method > Phone > Phone numbers for testing:** add both demo numbers from the Demo Accounts table: `+265999000111` with code `654321` (farmer) and `+265980686893` with code `123456` (officer). This avoids sending real SMS.
   - **Authentication > Settings > Authorized domains:** add the domain you run the app on (`localhost` is there by default). For real phone numbers, allow Malawi (+265) in the SMS region policy.
   - **Firestore Database:** create the database, then publish the security rules: `firebase deploy --only firestore:rules` (or paste `firestore.rules` into the Rules tab). **The officer code only works once the rules are published.**
4. **Add environment variables.** Copy `.env.example` to `.env` and fill in your own values. **Do not commit real keys.** `.env` is already in `.gitignore`.
   ```
   GEMINI_API_KEY="your-gemini-api-key"
   ```
   Without a key the app runs in Demo mode.
5. **Run the app**
   ```bash
   bun run dev
   ```
   Open http://localhost:3000.

Other commands: `bun run lint` (type check) and `bun run build` (production build).

### Changing the extension officer code

Open `firestore.rules`, edit the 4 digits in `officerCode()`, and publish the rules again. A 4-digit code has only 10,000 possibilities, so treat it as a simple gate for a demo, not as strong security. For a real deployment, use admin approval or longer one-time invite codes.

## Screenshots

*Screenshots still need to be added.* Run the app, take these shots, save them in a `screenshots/` folder with these names, then replace this note with the images.

| File to add | What to capture |
|---|---|
| `docs/screenshots/01-home.png` | Home screen with the photo upload and sample cases |
| `docs/screenshots/04-diagnosis-result.png` | A diagnosis result with the confidence score and safety note |
| `docs/screenshots/02-crop-details.png` | Sample showing crop details |
| `docs/screenshots/06-sign-in.png` | The sign-in page (phone + password) |
| `docs/screenshots/05-send-to-extension-officer.png` | The "Send to extension officer" dialog |
| `docs/screenshots/07-extension-officer-queue.png` | The officer queue with a case open |


## Team Contributions
r
- Name: Hamida Dzanjalimodzi: Team Lead
Frontend Developer
Backend Developer
AI/ML Engineer
UI/UX Designer
Emmanuel Manda: Documentation and research
