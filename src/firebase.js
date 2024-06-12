import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBFAaqESsclAxo1pU3H4r-SVfoSwXTTmz0",
  authDomain: "realeastate-f0825.firebaseapp.com",
  projectId: "realeastate-f0825",
  storageBucket: "realeastate-f0825.appspot.com",
  messagingSenderId: "459416394764",
  appId: "1:459416394764:web:95e8742d85c9ebe3f96229"
};

export const app =  initializeApp(firebaseConfig);
export const db = getFirestore()
export const storage = getStorage(app)
