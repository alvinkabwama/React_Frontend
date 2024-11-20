import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { jwtDecode }  from 'jwt-decode';

interface AuthContextType {
    token: string | null; // The JWT token
    user: string | null; // The logged-in user's full name decoded from the token
    login: (username: string, password: string) => Promise<boolean>; // Login function
    signup: (username: string, password: string, firstName: string, lastName: string) => Promise<boolean>; // Signup function
    logout: () => void; // Logout function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('token'); // Initialize state from localStorage
    });
    const [user, setUser] = useState<string | null>(null);

    // Decode the token to extract the user's name
    const decodeToken = (jwtToken: string): string | null => {
        try {
            const decoded: { name: string } = jwtDecode(jwtToken); // Decodes the JWT
            return decoded.name;
        } catch (err) {
            console.error('Error decoding token:', err);
            return null;
        }
    };

    // Set the token and decode the user's name
    const handleTokenUpdate = (jwtToken: string | null) => {
        setToken(jwtToken);
        if (jwtToken) {
            const decodedName = decodeToken(jwtToken);
            setUser(decodedName);
        } else {
            setUser(null);
        }
    };

    // Login function
    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login Response:', data); // Debug API response
                handleTokenUpdate(data.token); // Save and decode the token
                localStorage.setItem('token', data.token); // Persist token in localStorage
                return true;
            } else {
                console.log('Login failed:', await response.json()); // Log failure reason
                return false;
            }
        } catch (err) {
            console.error('Error logging in:', err);
            return false;
        }
    };

    // Signup function
    const signup = async (
        username: string,
        password: string,
        firstName: string,
        lastName: string
    ): Promise<boolean> => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, firstName, lastName }),
            });

            if (response.ok) {
                return true; // Signup successful
            } else {
                return false; // Signup failed
            }
        } catch (err) {
            console.error('Error signing up:', err);
            return false;
        }
    };

    // Logout function
    const logout = () => {
        handleTokenUpdate(null);
        localStorage.removeItem('token'); // Clear token from localStorage
    };

    // Synchronize state with localStorage on component mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            handleTokenUpdate(storedToken);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ token, user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
