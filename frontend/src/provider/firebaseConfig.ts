import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCYcmi4e_AnqnwTP4igorCBxbvp05O6VU8",
  authDomain: "real-estate-law-firm.firebaseapp.com",
  projectId: "real-estate-law-firm",
  storageBucket: "real-estate-law-firm.firebasestorage.app",
  messagingSenderId: "664031943019",
  appId: "1:664031943019:web:8b0dbc5ba8730a48e6942e",
  measurementId: "G-FQ61XBK3GN",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
