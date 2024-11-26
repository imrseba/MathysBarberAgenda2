import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDtdv8AykGJqRhLcVyimwlLDQZ0by7G5oY",
    authDomain: "mathysbarberagenda.firebaseapp.com",
    projectId: "mathysbarberagenda",
    storageBucket: "mathysbarberagenda.firebasestorage.app",
    messagingSenderId: "924712914296",
    appId: "1:924712914296:web:519449e17353db9249cc8d",
    measurementId: "G-3EW12DZPHN"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);