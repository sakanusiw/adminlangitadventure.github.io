import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; // Import Firebase Auth
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
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
const db = getFirestore(app);
const auth = getAuth(app);  // Initialize Firebase Authentication

const Index = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const RegisterUser = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMsg("Passwords do not match");
            return;
        }

        try {
            // Create user with Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store user details in Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: email,
                createdAt: new Date(),
                userId: user.uid
            });

            // Redirect user to login page after successful registration
            setMsg("Registration successful! Redirecting to login...");
            navigate('/login');
        } catch (error) {
            setMsg("Failed to register user. Please try again.");
            console.error("Error registering user: ", error);
        }
    };

    return (
        <>
            {/* Registration Form UI */}
            <html className="flex items-center justify-center min-h-screen bg-slate-700">
                <body className="h-full">
                    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-slate-100 rounded-lg">
                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                Create a new account
                            </h2>
                            <p className='mt-5 text-center text-2l leading-9 tracking-tight text-red-500'>{msg}</p>
                        </div>

                        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                            <form onSubmit={RegisterUser} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                        Email address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        className="block w-full rounded-md border-0 px-2 py-1.5"
                                        value={email} onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        className="block w-full rounded-md border-0 px-2 py-1.5"
                                        value={password} onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        required
                                        className="block w-full rounded-md border-0 px-2 py-1.5"
                                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <button type="submit" className="w-full bg-indigo-600 text-white rounded-md px-3 py-1.5">
                                        Register
                                    </button>
                                </div>
                            </form>

                            <p className="mt-10 text-center">
                                Already have an account? <a href="/login" className="text-indigo-600">Sign in</a>
                            </p>
                        </div>
                    </div>
                </body>
            </html>
        </>
    );
};

export default Index;
