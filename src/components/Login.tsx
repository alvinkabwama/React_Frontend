import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import PageLayout from './PageLayout';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formValue, setFormValue] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValue({ ...formValue, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const success = await login(formValue.username, formValue.password);
            if (success) {
                navigate('/'); // Redirect to home page on successful login
            } else {
                setError('Invalid email or password.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <PageLayout title="">
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-lg">
                <h1 className="text-2xl font-bold mb-4">Login</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            Email <span className="text-sm text-gray-500">(used as your username)</span>
                        </label>
                        <input
                            type="email" // Ensures input validation for email
                            name="username"
                            value={formValue.username}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formValue.password}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-gray-700">Don't have an account?</p>
                    <Link
                        to="/signup"
                        className="text-blue-500 hover:underline font-medium"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </PageLayout>
    );
};

export default Login;
