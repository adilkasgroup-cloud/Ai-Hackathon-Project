# Crop Doctor Malawi

Instant pest and disease diagnosis for smallholder farmers in Malawi. A farmer photographs a sick maize, tobacco or groundnut plant, gets an AI diagnosis with low-risk cultural solutions, and can escalate the case to a Ministry of Agriculture extension officer (EPA / AEDO) when the AI is unsure.

This repository contains the demo of my web app submission for the AI hackathon.

## Screenshots

### Diagnose a crop
Farmers can take a photo or upload one from their phone, with no account required. Choosing a crop type and adding field notes is optional.

![Home screen](docs/screenshots/01-home.png)

![Optional crop type and field notes](docs/screenshots/02-crop-details.png)

### Try a sample case
Four preloaded Malawi field samples let anyone see how a diagnosis works. The low-clarity sample demonstrates the mandatory extension officer review.

![Sample field photos](docs/screenshots/03-sample-photos.png)

### AI diagnosis
The result shows the most likely problem, a confidence score, and what the AI sees in the photo.

![Diagnosis result](docs/screenshots/04-diagnosis-result.png)

### Escalate to an extension officer
Contact details come from the farmer's profile, so there is no re-entry. The farmer adds observations and gives consent before the phone number and photos are shared.

![Send to extension officer](docs/screenshots/05-send-to-extension-officer.png)

### Sign in
Farmers sign in to see replies from their extension officer, using Google, phone number or email.

![Sign in](docs/screenshots/06-sign-in.png)

### Extension officer queue
Verified officers see incoming farmer cases, filterable by district and status, with AI confidence, severity and the farmer's contact details.

![Extension officer queue](docs/screenshots/07-extension-officer-queue.png)
