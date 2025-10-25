# ShelfPilot MVP

A lightweight web app for Whatnot (and other live-sellers) to:
- Pre-register items with optional names and QR codes
- Scan item right before auction
- Assign winner → auto-assign shelf/bin (custom names, default A1)
- Keep buyer items grouped for easy packing
- Export packing sheet PDF

## Live Tech
- React (Create React App)
- Firebase Auth (Email/Password)
- Firestore (real-time)
- react-qr-reader (camera scanning)
- qrcode.react (printable labels)
- jsPDF (packing PDF)

## Run Locally
```bash
npm install
npm start
```
App runs at http://localhost:3000

## Deploy (Vercel)
- Create new project → Import from GitHub (this folder)
- Build command: `npm run build`
- Output dir: `build`

## Firebase
The file `src/firebase.js` is already configured with your project keys.
Make sure you enabled:
- Authentication → Email/Password
- Firestore Database (production)
- Collections: items, buyers, shelves

Enjoy! ✨
