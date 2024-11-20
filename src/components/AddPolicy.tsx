import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePolicies } from '../context/PolicyContext';
import categories from '../data/categories'; 

const AddPolicy = () => {
    const { user } = useAuth();
    const { addPolicy } = usePolicies();
    const navigate = useNavigate();

    const [formValue, setFormValue] = useState({
        title: '',
        description: '',
        category: '',
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormValue({ ...formValue, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation: Check if all fields have been submitted
        if (!formValue.title.trim() || !formValue.description.trim() || !formValue.category.trim()) {
            setError('All fields are required.');
            return;
        }

        if (!user) {
            navigate('/login'); // Redirect if not logged in
            return;
        }

        try {
            await addPolicy({
                title: formValue.title,
                description: formValue.description,
                category: formValue.category,
            });
            navigate('/'); // Redirect to home after adding the policy
        } catch (err) {
            setError('Failed to add the policy. Please try again.');
        }
    };

    return (
        <PageLayout title="">
            <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded shadow-lg">
                <h1 className="text-2xl font-bold mb-6">Add New Policy</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formValue.title}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formValue.description}
                            onChange={handleChange}
                            className="w-full h-32 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">Category</label>
                        <select
                            name="category"
                            value={formValue.category}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                    >
                        Add Policy
                    </button>
                </form>
            </div>
        </PageLayout>
    );
};

export default AddPolicy;
