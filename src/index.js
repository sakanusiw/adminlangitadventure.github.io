import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/assets/css/index.css';
import App from './App';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLviB4xzfZ-eFkIm7X0_39cNmE17mYfLs",
  authDomain: "camp-rental-84848.firebaseapp.com",
  projectId: "camp-rental-84848",
  storageBucket: "camp-rental-84848.appspot.com",
  messagingSenderId: "926167421876",
  appId: "1:926167421876:web:bb15efc69cec6c4a3198e1",
  measurementId: "G-MHETFDYVB9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

