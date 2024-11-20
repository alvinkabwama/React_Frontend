import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePolicies } from '../context/PolicyContext';
import PageLayout from './PageLayout';

interface Policy {
    id: string;
    title: string;
    description: string;
    owner: string;
    date: string;
    category: string;
    votes: string[]; // Array of usernames who voted
}

const PolicyDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const { upvotePolicy } = usePolicies();
    const [policy, setPolicy] = useState<Policy | null>(null);
    const navigate = useNavigate();

    const fetchPolicyDetails = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/policies/${id}`);
            if (response.ok) {
                const data = await response.json();
                setPolicy(data.policy); // Update policy state
            } else {
                navigate('/'); // Redirect if policy not found
            }
        } catch (error) {
            console.error('Error fetching policy details:', error);
            navigate('/'); // Redirect in case of error
        }
    };

    useEffect(() => {
        fetchPolicyDetails(); // Fetch policy details on component mount
    }, [id]); // Re-run if the `id` changes

    const handleUpvote = async () => {
        if (!user) {
            navigate('/login'); // Redirect to login if not logged in
        } else if (policy && !policy.votes.includes(user)) {
            try {
                await upvotePolicy(policy.id); // Upvote the policy
                fetchPolicyDetails(); // Fetch updated policy details
            } catch (error) {
                console.error('Error during upvote:', error);
            }
        }
    };

    if (!policy) {
        return (
            <PageLayout title="">
                <div className="text-center mt-10">Loading policy details...</div>
            </PageLayout>
        );
    }

    return (
        <PageLayout title="">
            <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
                <h1 className="text-3xl font-bold mb-4">{policy.title}</h1>
                <p className="text-gray-700 mb-4">{policy.description}</p>
                <div className="text-gray-600 mb-4">
                    <p>
                        <strong>Category:</strong> {policy.category}
                    </p>
                    <p>
                        <strong>Owner:</strong> {policy.owner}
                    </p>
                    <p>
                        <strong>Date:</strong> {new Date(policy.date).toLocaleDateString()}
                    </p>
                    <p>
                        <strong>Votes:</strong> {policy.votes.length}
                    </p>
                </div>
                <button
                    className={`px-4 py-2 rounded text-white ${
                        !!user && policy.votes.includes(user)
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    disabled={!!user && policy.votes.includes(user)}
                    onClick={handleUpvote}
                >
                    {user && policy.votes.includes(user) ? 'Already Voted' : 'Upvote'}
                </button>
            </div>
        </PageLayout>
    );
};

export default PolicyDetail;
