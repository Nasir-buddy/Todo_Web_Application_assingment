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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          {showAllTodos ? 'All Users\' Todos' : 'My Todos'}
        </h1>
        <div className="flex space-x-4">
          {userIsAdmin() && (
            <Button
              color="secondary"
              onClick={toggleShowAll}
            >
              {showAllTodos ? 'Show My Todos' : 'Show All Todos'}
            </Button>
          )}
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add New Todo'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Todo</h2>
          <TodoForm onComplete={() => setShowAddForm(false)} />
        </div>
      )}

      {todos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-600">No todos found</h3>
          <p className="text-gray-500 mt-2">
            {showAddForm ? 'Fill out the form above to create your first todo!' : 'Click the "Add New Todo" button to get started!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {todos.map(todo => (
            <TodoCard key={todo._id} todo={todo} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList; 