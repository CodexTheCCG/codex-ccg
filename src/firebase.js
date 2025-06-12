// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATHB2opviWlJeXiA1rOO8FOJHEYUHVkCo",
  authDomain: "codex-ccg.firebaseapp.com",
  projectId: "codex-ccg",
  storageBucket: "codex-ccg.firebasestorage.app",
  messagingSenderId: "734354071832",
  appId: "1:734354071832:web:c05c7fe274ae8b0844be6d",
  measurementId: "G-ML80SFN3CM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);