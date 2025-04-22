import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [allTodos, setAllTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAdmin: userIsAdmin } = useContext(AuthContext);

  // Fetch all users (admin only)
  const fetchUsers = async () => {
    if (!userIsAdmin()) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3000/api/admin/users');
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Failed to fetch users';
      setError(message);
    }
  };

  // Fetch all todos (admin only)
  const fetchAllTodos = async () => {
    if (!userIsAdmin()) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3000/api/admin/todos');
      setAllTodos(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Failed to fetch all todos';
      setError(message);
    }
  };

  // Change user role (admin only)
  const changeUserRole = async (userId, newRole) => {
    if (!userIsAdmin()) return { success: false, message: 'Not authorized' };
    
    try {
      setLoading(true);
      setError(null);
      const response = await axios.patch(`http://localhost:3000/api/admin/users/${userId}/role`, { role: newRole });
      
      // Update local state
      setUsers(users.map(user => 
        user._id === userId ? response.data : user
      ));
      
      setLoading(false);
      return { success: true, user: response.data };
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Failed to change user role';
      setError(message);
      return { success: false, message };
    }
  };

  // Clear users and todos when user logs out
  useEffect(() => {
    if (!user || !userIsAdmin()) {
      setUsers([]);
      setAllTodos([]);
    }
  }, [user]);

  return (
    <AdminContext.Provider
      value={{
        users,
        allTodos,
        loading,
        error,
        fetchUsers,
        fetchAllTodos,
        changeUserRole
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}; 