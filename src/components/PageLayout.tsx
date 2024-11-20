import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PageLayoutProps {
    title: string; // Page-specific title
    children: React.ReactNode;
}

const PageLayout = ({ title, children }: PageLayoutProps) => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-blue-100">
            {/* Header */}
            <header className="bg-blue-600 text-white py-4 px-8 shadow-md flex justify-between items-center">
                {/* Title Section */}
                <h1 className="text-2xl font-bold">
                    Maharishi International University Student Policies
                </h1>

                {/* User Section */}
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <span className="text-lg">Welcome, {user}</span>
                            <button
                                onClick={logout}
                                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mr-2"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </header>

            {/* Page-specific Title */}
            <div className="text-center mt-8 mb-4">
                <h2 className="text-xl font-semibold">{title}</h2>
            </div>

            {/* Page Content */}
            <main className="max-w-3xl mx-auto">{children}</main>
        </div>
    );
};

export default PageLayout;
