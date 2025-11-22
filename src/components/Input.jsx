import React from 'react';

/**
 * Input component with validation/error states.
 * @param {string} label
 * @param {string} type
 * @param {string} value
 * @param {function} onChange
 * @param {string} errorMessage
 */
const Input = ({ label, type = 'text', value, onChange, errorMessage, ...props }) => {
  const isError = !!errorMessage;
  const inputId = `input-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className={`input-group ${isError ? 'input-error' : ''}`}>
      <label htmlFor={inputId} className="input-label">
        {label}
      </label>
      <input
        id={inputId}
        className="input-field"
        type={type}
        value={value}
        onChange={onChange}
        aria-invalid={isError ? 'true' : 'false'}
        aria-describedby={isError ? `${inputId}-error` : undefined}
        {...props}
      />
      {isError && (
        <p id={`${inputId}-error`} role="alert" className="input-error-message">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default Input;
