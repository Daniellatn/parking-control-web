import { initializeApp, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

let app

try {
  app = getApp()
} catch (error) {
  const firebaseConfig = {
    apiKey: process.env.PUBLIC_NEXT_FIREBASE_API_KEY,
    authDomain: process.env.PUBLIC_NEXT_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.PUBLIC_NEXT_FIREBASE_DATABASE_URL,
    projectId: process.env.PUBLIC_NEXT_FIREBASE_PROJECT_ID,
    storageBucket: process.env.PUBLIC_NEXT_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.PUBLIC_NEXT_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.PUBLIC_NEXT_FIREBASE_APP_ID
  };

  app = initializeApp(firebaseConfig)
}

const dataBase = getDatabase(app)
const storage = getStorage(app)
const dataBaseFirestore = getFirestore(app)

export { dataBase, dataBaseFirestore, storage }