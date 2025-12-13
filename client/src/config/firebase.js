import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAfe0viRjFRnAHlDmCnkHwUCAgtUC0ythg",
  authDomain: "billinghabit-v1.firebaseapp.com",
  projectId: "billinghabit-v1",
  storageBucket: "billinghabit-v1.firebasestorage.app",
  messagingSenderId: "1079725882394",
  appId: "1:1079725882394:web:2af962dbf233ba3dbc65a3",
  measurementId: "G-80PC1XXLCE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();