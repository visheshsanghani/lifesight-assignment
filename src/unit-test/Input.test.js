import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Input from '../components/Input';

describe('Input Component', () => {
  test('renders input with label', () => {
    render(<Input label="Username" value="" onChange={() => {}} />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  });

  test('renders with correct default type', () => {
    render(<Input label="Test Input" value="" onChange={() => {}} />);
    const input = screen.getByLabelText(/test input/i);
    expect(input).toHaveAttribute('type', 'text');
  });

  test('renders with specified type', () => {
    render(<Input label="Email" type="email" value="" onChange={() => {}} />);
    const input = screen.getByLabelText(/email/i);
    expect(input).toHaveAttribute('type', 'email');
  });

  test('displays the provided value', () => {
    render(<Input label="Name" value="John Doe" onChange={() => {}} />);
    const input = screen.getByLabelText(/name/i);
    expect(input).toHaveValue('John Doe');
  });

  test('calls onChange handler when input changes', () => {
    const handleChange = jest.fn();
    render(<Input label="Test" value="" onChange={handleChange} />);
    
    const input = screen.getByLabelText(/test/i);
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('shows error message when errorMessage prop is provided', () => {
    render(
      <Input 
        label="Email" 
        value="" 
        onChange={() => {}} 
        errorMessage="Invalid email format" 
      />
    );
    
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email format');
  });

  test('does not show error message when errorMessage is not provided', () => {
    render(<Input label="Email" value="" onChange={() => {}} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('applies error class when errorMessage is present', () => {
    const { container } = render(
      <Input 
        label="Email" 
        value="" 
        onChange={() => {}} 
        errorMessage="Error" 
      />
    );
    
    const inputGroup = container.querySelector('.input-group');
    expect(inputGroup).toHaveClass('input-error');
  });

  test('sets aria-invalid to true when error is present', () => {
    render(
      <Input 
        label="Email" 
        value="" 
        onChange={() => {}} 
        errorMessage="Error" 
      />
    );
    
    const input = screen.getByLabelText(/email/i);
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('sets aria-invalid to false when no error', () => {
    render(<Input label="Email" value="" onChange={() => {}} />);
    const input = screen.getByLabelText(/email/i);
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  test('links error message with aria-describedby when error exists', () => {
    render(
      <Input 
        label="Email" 
        value="" 
        onChange={() => {}} 
        errorMessage="Error" 
      />
    );
    
    const input = screen.getByLabelText(/email/i);
    const errorId = input.getAttribute('aria-describedby');
    expect(errorId).toBeTruthy();
    expect(document.getElementById(errorId)).toHaveTextContent('Error');
  });

  test('generates correct input id from label', () => {
    render(<Input label="First Name" value="" onChange={() => {}} />);
    const input = screen.getByLabelText(/first name/i);
    expect(input).toHaveAttribute('id', 'input-first-name');
  });

  test('applies additional props to input element', () => {
    render(
      <Input 
        label="Test" 
        value="" 
        onChange={() => {}} 
        placeholder="Enter text"
        disabled
      />
    );
    
    const input = screen.getByLabelText(/test/i);
    expect(input).toHaveAttribute('placeholder', 'Enter text');
    expect(input).toBeDisabled();
  });

  test('handles multiple onChange events', () => {
    const handleChange = jest.fn();
    render(<Input label="Test" value="" onChange={handleChange} />);
    
    const input = screen.getByLabelText(/test/i);
    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.change(input, { target: { value: 'ab' } });
    fireEvent.change(input, { target: { value: 'abc' } });
    
    expect(handleChange).toHaveBeenCalledTimes(3);
  });

  test('renders password type correctly', () => {
    render(<Input label="Password" type="password" value="" onChange={() => {}} />);
    const input = screen.getByLabelText(/password/i);
    expect(input).toHaveAttribute('type', 'password');
  });

  test('error message has correct id format', () => {
    render(
      <Input 
        label="Username" 
        value="" 
        onChange={() => {}} 
        errorMessage="Required field" 
      />
    );
    
    const errorElement = screen.getByRole('alert');
    expect(errorElement).toHaveAttribute('id', 'input-username-error');
  });
});
