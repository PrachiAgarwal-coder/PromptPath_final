import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCgValhlkhHp7OPkfW8_ZuFooh2mM1h-4s",
  authDomain: "promptpath-d1ea7.firebaseapp.com",
  projectId: "promptpath-d1ea7",
  storageBucket: "promptpath-d1ea7.firebasestorage.app",
  messagingSenderId: "601428649156",
  appId: "1:601428649156:web:b42b7414f718e57e375591"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);