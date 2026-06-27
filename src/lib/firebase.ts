import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC_WHnXy2AnN-Ph8e531eclW2a81QqVQtw",
  authDomain: "sajhashare.firebaseapp.com",
  projectId: "sajhashare",
  storageBucket: "sajhashare.firebasestorage.app",
  messagingSenderId: "811231341458",
  appId: "1:811231341458:web:a502fa61b7ed11f3fd6f4b",
  measurementId: "G-X2Y52NBBGV"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
