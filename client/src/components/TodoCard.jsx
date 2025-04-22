import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TodoContext } from '../context/TodoContext';

const TodoCard = ({ todo }) => {
  const { user } = useContext(AuthContext);
  const { updateTodo, deleteTodo } = useContext(TodoContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description);
  const [editedStatus, setEditedStatus] = useState(todo.status);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateTodo(todo._id, {
        title: editedTitle,
        description: editedDescription,
        status: editedStatus
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodo(todo._id);
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  };

  const canEdit = user.role === 'admin' || user._id === todo.userId;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
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
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
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
              {todo.status}
            </span>
            {canEdit && (
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
            )}
          </div>
        </div>
      )}
    </div>  
  );
};

export default TodoCard; 