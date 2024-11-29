import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; // Import Firebase Auth
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const Dashboard = () => {
    return (
        <html>
            <p>Hello World</p>
        </html>
    )
}

export default Dashboard;