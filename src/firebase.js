// Import Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your LockNChat Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfOg08m4KFZtF9l4orI484CvMaVlnQzWw",
  authDomain: "locknchat-b32f6.firebaseapp.com",
  projectId: "locknchat-b32f6",
  storageBucket: "locknchat-b32f6.firebasestorage.app",
  messagingSenderId: "416670420615",
  appId: "1:416670420615:web:25d8f2b4a58d4043ecf222"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth & firestore for use in the app
export const auth = getAuth(app);
export const db = getFirestore(app);
