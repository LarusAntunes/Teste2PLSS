import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyA0v3nCzW8uIYZVO09BxtFWqRETb88xwHE",
    authDomain: "consultas-4bb88.firebaseapp.com",
    projectId: "consultas-4bb88",
    storageBucket: "consultas-4bb88.appspot.com",
    messagingSenderId: "815549203896",
    appId: "1:815549203896:web:ad0c17e63a456c00ccbb4d",
    measurementId: "G-PDRGE2BCJK"
};

const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp);
const db =getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export {auth, db, storage}