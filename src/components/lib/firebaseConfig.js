// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider,FacebookAuthProvider} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8fGaj2jFZjiMBq1rYBbHZjZjAbtmh-8M",
  authDomain: "login-e1c8b.firebaseapp.com",
  projectId: "login-e1c8b",
  storageBucket: "login-e1c8b.appspot.com",
  messagingSenderId: "55213842909",
  appId: "1:55213842909:web:36693cc182dd8bc5f0d634",
  measurementId: "G-8ZFLJB6PB1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();
const googleProvider = new GoogleAuthProvider;
const facebookProvider = new FacebookAuthProvider;
export{auth,storage,db,googleProvider,facebookProvider};