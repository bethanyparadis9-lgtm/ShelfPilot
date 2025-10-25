import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDYmN50R6FPXfmGZAhtEw-26Htwvx0_6gk",
  authDomain: "shelfpilot-8b167.firebaseapp.com",
  projectId: "shelfpilot-8b167",
  storageBucket: "shelfpilot-8b167.appspot.com",
  messagingSenderId: "736462025321",
  appId: "1:736462025321:web:cc4c82b0b6af3c8a4ea8f8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
