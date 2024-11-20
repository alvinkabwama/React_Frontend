import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from './PageLayout';

const Signup = () => {
    const navigate = useNavigate();
    const [formValue, setFormValue] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValue({ ...formValue, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation
        if (!formValue.firstName || !formValue.lastName || !formValue.username || !formValue.password) {
            setError('All fields are required.');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formValue),
            });

            if (response.ok) {
                setSuccess('User registered successfully! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to register. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <PageLayout title="">
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-lg">
                <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formValue.firstName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formValue.lastName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email (Username)</label>
                        <input
                            type="email"
                            name="username"
                            placeholder="Enter your email"
                            value={formValue.username}
                            onChange={handleChange}
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
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </PageLayout>
    );
};

export default Signup;
