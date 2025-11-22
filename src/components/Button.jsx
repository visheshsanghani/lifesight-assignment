import React from 'react';
import TEXT from '../constant/text.json';

/**
 * Configurable Button Component.
 * @param {string} variant - 'primary' or 'secondary'.
 * @param {string} size - 'sm', 'md', or 'lg'.
 * @param {boolean} disabled - Whether the button is disabled.
 * @param {function} onClick - Click handler.
 * @param {string} children - Button content.
 */
const Button = React.forwardRef(({ variant = 'primary', size = 'md', disabled = false, onClick, children, ...props }, ref) => {
  const className = `btn btn-${variant} btn-${size}`;

  return (
    <button
      ref={ref}
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-label={typeof children === 'string' ? children : TEXT.button.ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
