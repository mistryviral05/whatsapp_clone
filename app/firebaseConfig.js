import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from 'firebase/database';

import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "YOur",
  authDomain: "Your",
  projectId: "Your",
  storageBucket: "Your",
  messagingSenderId: "Your",
  appId: "Your",
  measurementId: "Your"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const db = getFirestore(app);

const auth = getAuth(app);

 const database = getDatabase(app);

export  {auth,db,storage,database};
