import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from './Button';

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex p-10 justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600 ml-10">TodoApp</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/todos"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  My Todos
                </Link>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700 text-sm">
                    Welcome, {user.username}!
                  </span>
                  <Button
                    onClick={handleLogout}
                    color="secondary"
                    className="text-sm py-1.5"
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex space-x-3 px-4 w-fit gap-5 justify-between ">
                <Link to="/login">
                  <Button 
                    color="secondary" 
                    className="text-sm  py-2 px-4 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    className="text-sm py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
