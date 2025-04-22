import { useContext, useState } from 'react';
import { TodoContext } from '../context/TodoContext';
import { AuthContext } from '../context/AuthContext';
import TodoCard from '../components/TodoCard';
import Button from '../components/Button';
import TodoForm from '../components/TodoForm';

const TodoList = () => {
  const { todos, loading, error, showAllTodos, toggleShowAll } = useContext(TodoContext);
  const { isAdmin: userIsAdmin } = useContext(AuthContext);
  const [showAddForm, setShowAddForm] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-lg text-gray-500">Loading todos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {showAllTodos ? 'All Users\' Todos' : 'My Todos'}
          </h1>
          <div className="flex flex-wrap gap-3">
            {userIsAdmin() && (
              <Button
                color="secondary"
                onClick={toggleShowAll}
                className="whitespace-nowrap"
              >
                {showAllTodos ? 'Show My Todos' : 'Show All Todos'}
              </Button>
            )}
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="whitespace-nowrap"
            >
              {showAddForm ? 'Cancel' : 'Add New Todo'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-md mb-6">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {showAddForm && (
          <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Todo</h2>
            <TodoForm onComplete={() => setShowAddForm(false)} />
          </div>
        )}

        {todos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No todos found</h3>
            <p className="text-gray-600">
              {showAddForm ? 'Fill out the form above to create your first todo!' : 'Click the "Add New Todo" button to get started!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {todos.map(todo => (
              <TodoCard key={todo._id} todo={todo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList; 