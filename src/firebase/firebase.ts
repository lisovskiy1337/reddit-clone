import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBoA4y_TwAvYteLWW0VVqw2Ig2Yx19Y6_M",
  authDomain: "reddit-clone-27120.firebaseapp.com",
  projectId: "reddit-clone-27120",
  storageBucket: "reddit-clone-27120.appspot.com",
  messagingSenderId: "175517653614",
  appId: "1:175517653614:web:58eb264a6dc017272e247f",
  measurementId: "G-XE3LQ5DK1V",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, firestore, auth, storage };
