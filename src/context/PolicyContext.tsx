import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Define the Policy interface
export interface Policy {
    id: string;
    title: string;
    description: string;
    owner: string;
    date: string;
    category: string;
    votes: string[]; // Array of usernames who voted
}

// Define the type for PolicyContext
interface PolicyContextType {
    policies: Policy[];
    currentPage: number;
    totalPages: number;
    setPage: (page: number) => void;
    fetchPolicies: () => Promise<void>;
    addPolicy: (policy: Omit<Policy, 'id' | 'votes' | 'owner' | 'date'>) => Promise<void>;
    upvotePolicy: (id: string) => Promise<void>; // Added upvotePolicy here
}

// Create the context with an undefined initial value
const PolicyContext = createContext<PolicyContextType | undefined>(undefined);

export const PolicyProvider = ({ children }: { children: ReactNode }) => {
    const [allPolicies, setAllPolicies] = useState<Policy[]>([]);
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const { user } = useAuth();
    const totalPages = Math.ceil(allPolicies.length / itemsPerPage);

    // Fetch all policies from the backend
    const fetchPolicies = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/policies/all`);
            if (response.ok) {
                const data = await response.json();
                setAllPolicies(data.policies || []);
            } else {
                console.error('Failed to fetch policies');
            }
        } catch (error) {
            console.error('Error fetching policies:', error);
        }
    };

    // Add a new policy
    const addPolicy = async (policy: Omit<Policy, 'id' | 'votes' | 'owner' | 'date'>) => {
        if (!user) {
            console.error('User is not logged in.');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/policies/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(policy),
            });

            if (response.ok) {
                const data = await response.json();
                setAllPolicies((prev) => [...prev, data.policy]);
            } else {
                console.error('Failed to add policy');
            }
        } catch (error) {
            console.error('Error adding policy:', error);
        }
    };

    // Upvote a policy
    const upvotePolicy = async (id: string) => {
        if (!user) {
            console.error('User is not logged in.');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/policies/upvote/${id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setAllPolicies((prev) =>
                    prev.map((policy) =>
                        policy.id === id ? { ...policy, votes: data.policy.votes } : policy
                    )
                );
            } else {
                console.error('Failed to upvote policy');
            }
        } catch (error) {
            console.error('Error upvoting policy:', error);
        }
    };

    // Update policies based on the current page
    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setPolicies(allPolicies.slice(startIndex, endIndex));
    }, [allPolicies, currentPage]);

    const setPage = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <PolicyContext.Provider
            value={{
                policies,
                currentPage,
                totalPages,
                setPage,
                fetchPolicies,
                addPolicy,
                upvotePolicy, // Added upvotePolicy here
            }}
        >
            {children}
        </PolicyContext.Provider>
    );
};

// Hook to use the PolicyContext
export const usePolicies = () => {
    const context = useContext(PolicyContext);
    if (!context) {
        throw new Error('usePolicies must be used within a PolicyProvider');
    }
    return context;
};
