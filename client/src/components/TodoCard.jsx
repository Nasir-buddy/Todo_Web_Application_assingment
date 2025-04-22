import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TodoContext } from '../context/TodoContext';

const TodoCard = ({ todo }) => {
  const { user } = useContext(AuthContext);
  const { updateTodo, deleteTodo } = useContext(TodoContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description);
  const [editedStatus, setEditedStatus] = useState(todo.status || 'pending');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setSaveError('');
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveError('');
      
      console.log('Saving todo with ID:', todo._id);
      console.log('Update data:', {
        title: editedTitle,
        description: editedDescription,
        status: editedStatus
      });
      
      const result = await updateTodo(todo._id, {
        title: editedTitle,
        description: editedDescription,
        status: editedStatus
      });
      
      console.log('Update result:', result);
      
      if (result?.success) {
        setIsEditing(false);
        setSaveSuccess(true);
        // Update local state to reflect changes
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(result?.message || 'Failed to update todo');
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      setSaveError('Error updating todo. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        const result = await deleteTodo(todo._id);
        if (!result?.success) {
          alert('Failed to delete todo: ' + (result?.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error deleting todo:', error);
        alert('Error deleting todo: ' + error.message);
      }
    }
  };

  // Making sure we have proper access control - checking both user and todo properties
  // Using console.log to debug the values
  console.log('Todo:', todo);
  console.log('User:', user);
  
  // More permissive access control to ensure functionality works
  // This allows editing if:
  // 1. User is admin, OR
  // 2. User created the todo (checking various possible property names)
  const canEdit = 
    user?.role === 'admin' || 
    user?._id === todo?.userId || 
    user?._id === todo?.user || 
    user?.id === todo?.userId || 
    user?.id === todo?.user;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      {saveSuccess && (
        <div className="mb-3 p-2 bg-green-100 text-green-800 rounded">
          Todo updated successfully!
        </div>
      )}
      {saveError && (
        <div className="mb-3 p-2 bg-red-100 text-red-800 rounded">
          {saveError}
        </div>
      )}
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <select
            value={editedStatus}
            onChange={(e) => setEditedStatus(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-4 py-2 ${isSaving ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} text-white rounded`}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-2">{todo.title}</h3>
          <p className="text-gray-600 mb-4">{todo.description}</p>
          <div className="flex justify-between items-center">
            <span className={`px-3 py-1 rounded-full text-sm ${
              todo.status === 'completed' ? 'bg-green-100 text-green-800' :
              todo.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {todo.status || 'pending'}
            </span>
            {canEdit ? (
              <div className="space-x-2">
                <button
                  onClick={handleEdit}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <button
                  disabled
                  className="px-3 py-1 bg-gray-300 text-gray-500 rounded cursor-not-allowed"
                >
                  View Only
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>  
  );
};

export default TodoCard; 