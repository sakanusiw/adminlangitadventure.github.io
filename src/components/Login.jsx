import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const auth = getAuth();

    const Auth = async (e) => {
        e.preventDefault();

        try {
            // Sign in with Firebase Auth
            await signInWithEmailAndPassword(auth, email, password);

            // Redirect user after successful login
            navigate('/dashboard');
        } catch (error) {
            setMsg("Failed to sign in. Please check your email and password.");
            console.error("Error signing in: ", error);
        }
    };

    return (
        <>
            {/* Login Form UI */}
            <html className="flex items-center justify-center min-h-screen bg-slate-700">
                <body className="h-full">
                    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-slate-100 rounded-lg">
                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                Sign in to your account
                            </h2>
                            <p className='mt-5 text-center text-2l leading-9 tracking-tight text-red-500'>{msg}</p>
                        </div>

                        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                            <form onSubmit={Auth} className="space-y-6">
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

                                <div className="flex justify-end">
                                    <a href="/forgotPassword" className="text-indigo-600">
                                        Forgot password?
                                    </a>
                                </div>

                                <div>
                                    <button type="submit" className="w-full bg-indigo-600 text-white rounded-md px-3 py-1.5">
                                        Sign in
                                    </button>
                                </div>
                            </form>

                            <p className="mt-10 text-center">
                                Don't have an account? <a href="/dashboard" className="text-indigo-600">Register</a>
                            </p>
                        </div>
                    </div>
                </body>
            </html>
        </>
    );
};

export default Login;
