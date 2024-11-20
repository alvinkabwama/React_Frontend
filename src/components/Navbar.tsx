
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={{ padding: '1rem', backgroundColor: '#f8f9fa' }}>
            <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
            <Link to="/add-policy">Add Policy</Link>
        </nav>
    );
};

export default Navbar;
