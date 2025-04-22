import { forwardRef } from 'react';

const Input = forwardRef(({
  type = 'text',
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = '',
  icon,
  as = 'input',
  ...props
}, ref) => {
  const inputClasses = `
    w-full px-4 py-3 rounded-lg border-2
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    transition-all duration-200
    ${error ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'}
    ${icon ? 'pl-11' : ''}
    ${className}
  `;

  const InputComponent = as === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <InputComponent
          ref={ref}
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={inputClasses}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

export default Input; 