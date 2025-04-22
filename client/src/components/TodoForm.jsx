import { useState, useContext } from 'react';
import { TodoContext } from '../context/TodoContext';
import Input from './Input';
import Button from './Button';

const TodoForm = ({ todo, onComplete }) => {
  const isEditMode = !!todo;
  const { addTodo, updateTodo } = useContext(TodoContext);
  
  const [formData, setFormData] = useState({
    title: todo?.title || '',
    description: todo?.description || '',
    dueDate: todo?.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '',
    category: todo?.category || 'Non-Urgent',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      let result;
      
      if (isEditMode) {
        result = await updateTodo(todo._id, formData);
      } else {
        result = await addTodo(formData);
      }
      
      if (result.success) {
        if (onComplete) onComplete();
        // Reset form if not redirecting
        if (!onComplete) {
          setFormData({
            title: '',
            description: '',
            dueDate: '',
            category: 'Non-Urgent'
          });
        }
      } else {
        setErrors({ general: result.message });
      }
    } catch (err) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className='mb-10' onSubmit={handleSubmit}>
      {errors.general && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-10">
          {errors.general}
        </div>
      )}
      
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Enter todo title"
        error={errors.title}
        required
      />
      
      <Input
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Enter description (optional)"
        error={errors.description}
        as="textarea"
        rows={3}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input
          label="Due Date"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
        />
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Non-Urgent">Non-Urgent</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4 mt-6">
        {onComplete && (
          <Button
            type="button"
            color="secondary"
            onClick={onComplete}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Todo' : 'Add Todo'}
        </Button>
      </div>
    </form>
  );
};

export default TodoForm; 