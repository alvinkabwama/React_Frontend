
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PolicyProvider } from './context/PolicyContext';
import PolicyList from './components/PolicyList';
import PolicyDetail from './components/PolicyDetail';
import Login from './components/Login';
import AddPolicy from './components/AddPolicy';
import SignUp from './components/SignUp';

const App = () => {
    return (
        <AuthProvider>
            <PolicyProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<PolicyList />} />
                        <Route path="/policies/:id" element={<PolicyDetail />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/add-policy" element={<AddPolicy />} />
                        <Route path="/signup" element={<SignUp />} />
                    </Routes>
                </Router>
            </PolicyProvider>
        </AuthProvider>
    );
};

export default App;
