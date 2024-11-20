import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePolicies } from '../context/PolicyContext';
import PageLayout from './PageLayout';

const PolicyList = () => {
    const { policies, currentPage, totalPages, setPage, fetchPolicies } = usePolicies();
    const { user } = useAuth(); // Access user authentication
    const [filterYear, setFilterYear] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filteredPolicies, setFilteredPolicies] = useState(policies);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPolicies(); // Fetch policies on mount
    }, []);

    useEffect(() => {
        // Filter policies based on year and category
        const filtered = policies.filter((policy) => {
            const matchesYear = filterYear
                ? new Date(policy.date).getFullYear().toString() === filterYear
                : true;
            const matchesCategory = filterCategory
                ? policy.category === filterCategory
                : true;
            return matchesYear && matchesCategory;
        });

        // Sort policies by votes in descending order
        filtered.sort((a, b) => b.votes.length - a.votes.length);
        setFilteredPolicies(filtered);
    }, [policies, filterYear, filterCategory]);

    const handleAddPolicyClick = () => {
        if (!user) {
            navigate('/login'); // Redirect to login if not logged in
        } else {
            navigate('/add-policy'); // Redirect to Add Policy form if logged in
        }
    };

    const handleNext = () => setPage(currentPage + 1);
    const handlePrevious = () => setPage(currentPage - 1);

    return (
        <PageLayout title="">
            {/* Filters and Add Policy Button */}
            <div className="mb-6 flex justify-between items-center">
                <div className="flex gap-4">
                    <select
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                        className="border border-gray-300 rounded px-4 py-2"
                    >
                        <option value="">Filter by Year</option>
                        {Array.from(new Set(policies.map((p) => new Date(p.date).getFullYear()))).map(
                            (year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            )
                        )}
                    </select>

                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="border border-gray-300 rounded px-4 py-2"
                    >
                        <option value="">Filter by Category</option>
                        {Array.from(new Set(policies.map((p) => p.category))).map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleAddPolicyClick}
                    className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 transition"
                >
                    Add Policy
                </button>
            </div>

            {/* Policy List */}
            <div className="space-y-6">
                {filteredPolicies.length === 0 ? (
                    <p className="text-center">No policies available.</p>
                ) : (
                    filteredPolicies.map((policy) => (
                        <div
                            key={policy.id}
                            className="bg-white shadow-lg rounded-lg p-6"
                        >
                            <h2 className="text-xl font-bold mb-2">{policy.title}</h2>
                            <p className="text-gray-700 mb-2">
                                {policy.description.substring(0, 100)}...
                            </p>
                            <p className="text-gray-500">
                                <strong>Category:</strong> {policy.category}
                            </p>
                            <p className="text-gray-500">
                                <strong>Owner:</strong> {policy.owner}
                            </p>
                            <p className="text-gray-500">
                                <strong>Date:</strong> {policy.date}
                            </p>
                            <p className="text-gray-500">
                                <strong>Votes:</strong> {policy.votes.length}
                            </p>
                            <button
                                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                                onClick={() => navigate(`/policies/${policy.id}`)} // Navigate to detailed policy page
                            >
                                View More
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between mt-6">
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded ${
                        currentPage === 1
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    Previous
                </button>
                <span className="text-gray-700">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded ${
                        currentPage === totalPages
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    Next
                </button>
            </div>
        </PageLayout>
    );
};

export default PolicyList;
