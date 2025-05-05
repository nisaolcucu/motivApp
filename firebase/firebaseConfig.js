// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyCHHiNlMZm8pZXJMRJi_7cUIUIADS_kVow",
  authDomain: "homework-7ca7b.firebaseapp.com",
  projectId: "homework-7ca7b",
  storageBucket: "homework-7ca7b.firebasestorage.app",
  messagingSenderId: "929731973330",
  appId: "1:929731973330:web:53b8aca794d018495e1d0b",
  measurementId: "G-YKWM3JFL5P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


const auth = getAuth(app);
export const db = getFirestore(app);
// export et
export { auth };