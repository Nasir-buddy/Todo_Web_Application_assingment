import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllTodos, setShowAllTodos] = useState(false); // For admin view
  const { user, isAdmin: userIsAdmin } = useContext(AuthContext);

  // Fetch todos when component mounts or when showAllTodos changes
  useEffect(() => {
    if (user) {
      fetchTodos();
    } else {
      setTodos([]);
      setLoading(false);
    }
  }, [user, showAllTodos]);

  // Fetch todos from API
  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = showAllTodos && userIsAdmin() 
        ? 'http://localhost:3000/api/todos?showAll=true' 
        : 'http://localhost:3000/api/todos';
      
      const response = await axios.get(url);
      setTodos(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Failed to fetch todos';
      setError(message);
    }
  };

  // Add new todo
  const addTodo = async (todoData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('http://localhost:3000/api/todos', todoData);
      setTodos([...todos, response.data]);
      setLoading(false);
      return { success: true, todo: response.data };
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Failed to add todo';
      setError(message);
      return { success: false, message };
    }
  };

  // Update todo
  const updateTodo = async (id, todoData) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Sending update request for todo ${id} with data:`, todoData);
      
      const response = await axios.put(`http://localhost:3000/api/todos/${id}`, todoData);
      console.log('Server response:', response.data);
      
      // Update local state
      const updatedTodos = todos.map(todo => 
        todo._id === id ? {...todo, ...todoData} : todo
      );
      
      setTodos(updatedTodos);
      console.log('Updated todos state:', updatedTodos);
      
      setLoading(false);
      return { success: true, todo: response.data };
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Failed to update todo';
      setError(message);
      console.error('Update error:', err);
      return { success: false, message };
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`http://localhost:3000/api/todos/${id}`);
      
      // Update local state
      setTodos(todos.filter(todo => todo._id !== id));
      
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Failed to delete todo';
      setError(message);
      return { success: false, message };
    }
  };

  // Toggle todo completion status
  const toggleComplete = async (id, completed) => {
    try {
      const todo = todos.find(todo => todo._id === id);
      if (!todo) return { success: false, message: 'Todo not found' };
      
      return await updateTodo(id, { completed: !completed });
    } catch (error) {
      console.error('Error toggling todo status:', error);
      return { success: false, message: 'Failed to toggle todo status' };
    }
  };

  // Toggle between showing all todos and user's todos (admin only)
  const toggleShowAll = () => {
    if (userIsAdmin()) {
      setShowAllTodos(!showAllTodos);
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        error,
        showAllTodos,
        fetchTodos,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleComplete,
        toggleShowAll
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}; 