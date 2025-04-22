import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TodoContext } from '../context/TodoContext';
import Input from './Input';
import Button from './Button';

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

  // Status colors and styles
  const statusStyles = {
    'completed': {
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
      icon: '✓',
      iconBg: 'bg-emerald-500'
    },
    'in-progress': {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      icon: '▶',
      iconBg: 'bg-amber-500'
    },
    'pending': {
      bg: 'bg-sky-100',
      text: 'text-sky-800',
      icon: '⏱',
      iconBg: 'bg-sky-500'
    }
  };

  const currentStatus = todo.status || 'pending';
  const statusStyle = statusStyles[currentStatus] || statusStyles.pending;

  const handleEdit = () => {
    setIsEditing(true);
    setSaveError('');
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveError('');
      
      const result = await updateTodo(todo._id, {
        title: editedTitle,
        description: editedDescription,
        status: editedStatus
      });
      
      if (result?.success) {
        setIsEditing(false);
        setSaveSuccess(true);
        // Update the local todo status
        todo.status = editedStatus;
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

  const canEdit = 
    user?.role === 'admin' || 
    user?._id === todo?.userId || 
    user?._id === todo?.user || 
    user?.id === todo?.userId || 
    user?.id === todo?.user;

  return (
    <>
      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <h3 className="text-xl font-bold text-gray-800">Edit Todo</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {saveError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{saveError}</p>
                  </div>
                </div>
              </div>
            )}

            <Input
              label="Title"
              name="title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Enter title"
              required
            />

            <Input
              label="Description"
              name="description"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Enter description"
              as="textarea"
              rows={3}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={editedStatus}
                onChange={(e) => setEditedStatus(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                color="secondary"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </div>
                ) : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Todo Card */}
      <div className="bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-100 overflow-hidden mb-5 transform hover:-translate-y-1">
        {saveSuccess && (
          <div className="bg-green-500 text-white px-4 py-2 text-center animate-pulse">
            Todo updated successfully!
          </div>
        )}
        
        <div className="relative">
          {/* Status badge */}
          <div className="absolute top-4 right-4">
            <div className={`flex items-center rounded-full ${statusStyle.bg} ${statusStyle.text} px-3 py-1 text-xs font-medium`}>
              <span className={`flex items-center justify-center h-4 w-4 rounded-full mr-1 ${statusStyle.iconBg} text-white`}>
                {statusStyle.icon}
              </span>
              <span className="capitalize">{currentStatus}</span>
            </div>
          </div>

          <div className="p-5">
            <h3 className="text-xl font-bold text-gray-800 mb-3 pr-24">{todo.title}</h3>
            <p className="text-gray-600 mb-5 whitespace-pre-line">{todo.description}</p>
            
            {canEdit && (
              <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-100">
                <Button
                  onClick={handleEdit}
                  className="flex-1 sm:flex-none"
                >
                  <span className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit
                  </span>
                </Button>
                <Button
                  color="danger"
                  onClick={handleDelete}
                  className="flex-1 sm:flex-none"
                >
                  <span className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </span>
                </Button>
              </div>
            )}
            {!canEdit && (
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="px-3 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm text-center">
                  View Only
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TodoCard; 