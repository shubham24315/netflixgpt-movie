// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMCpS_dmGra5wFeTZeWHvrlepXPlQPHbE",
  authDomain: "netflixgpt-c0ccf.firebaseapp.com",
  projectId: "netflixgpt-c0ccf",
  storageBucket: "netflixgpt-c0ccf.appspot.com",
  messagingSenderId: "341089804092",
  appId: "1:341089804092:web:04e54c334c1c2c7a508839",
  measurementId: "G-QWDZ2K3W4Q"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth=getAuth()