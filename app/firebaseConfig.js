import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from 'firebase/database';

import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCXW0q86ziq6PgPoSe9O8vQ48C4pvEBas8",
  authDomain: "whatsappwebapplication.firebaseapp.com",
  projectId: "whatsappwebapplication",
  storageBucket: "whatsappwebapplication.appspot.com",
  messagingSenderId: "217792752428",
  appId: "1:217792752428:web:77cde806df60c5ce861a89",
  measurementId: "G-7DYT7D3RM0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const db = getFirestore(app);

const auth = getAuth(app);

 const database = getDatabase(app);

export  {auth,db,storage,database};