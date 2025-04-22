import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from './Button';

const Navbar = () => {
  const { user, logout, isAdmin: userIsAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-600">
            TodoApp
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700">
                  Welcome, <span className="font-medium">{user.username}</span>
                  {userIsAdmin() && <span className="ml-1 text-xs text-blue-600">(Admin)</span>}
                </span>
                
                <Link to="/todos" className="text-gray-600 hover:text-blue-600">
                  My Todos
                </Link>
                
                {userIsAdmin() && (
                  <Link to="/admin" className="text-gray-600 hover:text-blue-600">
                    Admin Dashboard
                  </Link>
                )}
                
                <Button
                  color="secondary"
                  onClick={handleLogout}
                  className="text-sm"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600">
                  Login
                </Link>
                <Link to="/register">
                  <Button color="primary" className="text-sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 