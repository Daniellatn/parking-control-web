import { initializeApp, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

let app

try {
  app = getApp()
} catch (error) {
  const firebaseConfig = {
    apiKey: "AIzaSyDOQRzWEFs5CyvFNKM5cqUdXPGGvkMGm94",
    authDomain: "parking-control-a0c1d.firebaseapp.com",
    databaseURL: "https://parking-control-a0c1d-default-rtdb.firebaseio.com",
    projectId: "parking-control-a0c1d",
    storageBucket: "parking-control-a0c1d.appspot.com",
    messagingSenderId: "872207620135",
    appId: "1:872207620135:web:6f2704c2c2bb9556cb5602"
  };

  app = initializeApp(firebaseConfig)
}

const dataBase = getDatabase(app)
const storage = getStorage(app)
const dataBaseFirestore = getFirestore(app)

export { dataBase, dataBaseFirestore, storage }