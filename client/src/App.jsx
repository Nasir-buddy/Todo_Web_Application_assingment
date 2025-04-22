import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TodoProvider } from './context/TodoContext';
import { AdminProvider } from './context/AdminContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import TodoList from './pages/TodoList';
import AdminDashboard from './pages/AdminDashboard';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Home page that redirects based on authentication
const Home = () => {
  const { user } = useContext(AuthContext);
  return <Navigate to={user ? '/todos' : '/login'} />;
};

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/todos"
          element={
            <ProtectedRoute>
              <TodoList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <TodoProvider>
          <AdminProvider>
            <AppContent />
          </AdminProvider>
        </TodoProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;