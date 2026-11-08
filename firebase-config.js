// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// TODO: Replace with your actual Firebase project configuration from Step 1.2
const firebaseConfig = {
//   apiKey: "AIzaSyD-YOUR-API-KEY-HERE",
//   authDomain: "budget-tracker-xxxxx.firebaseapp.com",
//   projectId: "budget-tracker-xxxxx",
//   storageBucket: "budget-tracker-xxxxx.appspot.com",
//   messagingSenderId: "123456789012",
//   appId: "1:123456789012:web:xxxxxx"
  apiKey: "AIzaSyCkmzgezyap15-mYXvSvGb5SUJusR_VB98",
  authDomain: "budget-tracker-aa19b.firebaseapp.com",
  projectId: "budget-tracker-aa19b",
  storageBucket: "budget-tracker-aa19b.firebasestorage.app",
  messagingSenderId: "317333561135",
  appId: "1:317333561135:web:ef9678ee7896f549958bda",
  measurementId: "G-NJ4STZCFEQ"


};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();