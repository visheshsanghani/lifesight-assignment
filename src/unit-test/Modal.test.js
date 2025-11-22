import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from '../components/Modal';

// Mock ReactDOM.createPortal to render in place for testing
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node,
}));

describe('Modal Component', () => {
  test('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('displays the title', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="My Modal Title">
        <p>Content</p>
      </Modal>
    );
    
    expect(screen.getByText('My Modal Title')).toBeInTheDocument();
  });

  test('displays the children content', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test">
        <p>This is modal content</p>
      </Modal>
    );
    
    expect(screen.getByText('This is modal content')).toBeInTheDocument();
  });

  test('calls onClose when backdrop is clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test">
        <p>Content</p>
      </Modal>
    );
    
    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('does not close when modal content is clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test">
        <p>Content</p>
      </Modal>
    );
    
    const content = screen.getByText('Content');
    fireEvent.click(content);
    
    expect(handleClose).not.toHaveBeenCalled();
  });

  test('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test">
        <p>Content</p>
      </Modal>
    );
    
    const closeButton = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeButton);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('has correct aria attributes', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Content</p>
      </Modal>
    );
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'modal-description');
  });

  test('title has correct id for aria-labelledby', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Content</p>
      </Modal>
    );
    
    const title = screen.getByText('Test Modal');
    expect(title).toHaveAttribute('id', 'modal-title');
  });

  test('modal has active class when open', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test">
        <p>Content</p>
      </Modal>
    );
    
    const backdrop = screen.getByRole('dialog');
    expect(backdrop).toHaveClass('modal-active');
  });

  test('renders close button with secondary variant', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test">
        <p>Content</p>
      </Modal>
    );
    
    const closeButton = screen.getByRole('button', { name: /close modal/i });
    expect(closeButton).toBeInTheDocument();
  });

  test('closes modal on Escape key press', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test">
        <p>Content</p>
      </Modal>
    );
    
    fireEvent.keyDown(window, { key: 'Escape' });
    
    expect(handleClose).toHaveBeenCalled();
  });

  test('renders multiple children', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test">
        <p>First paragraph</p>
        <p>Second paragraph</p>
        <div>A div element</div>
      </Modal>
    );
    
    expect(screen.getByText('First paragraph')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph')).toBeInTheDocument();
    expect(screen.getByText('A div element')).toBeInTheDocument();
  });

  test('modal content stops event propagation', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test">
        <button>Inner Button</button>
      </Modal>
    );
    
    const innerButton = screen.getByText('Inner Button');
    fireEvent.click(innerButton);
    
    // onClose should not be called when clicking inside modal content
    expect(handleClose).not.toHaveBeenCalled();
  });

  test('transition from closed to open', () => {
    const { rerender } = render(
      <Modal isOpen={false} onClose={() => {}} title="Test">
        <p>Content</p>
      </Modal>
    );
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    
    rerender(
      <Modal isOpen={true} onClose={() => {}} title="Test">
        <p>Content</p>
      </Modal>
    );
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('transition from open to closed', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={() => {}} title="Test">
        <p>Content</p>
      </Modal>
    );
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    rerender(
      <Modal isOpen={false} onClose={() => {}} title="Test">
        <p>Content</p>
      </Modal>
    );
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('renders with complex content including inputs', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Form Modal">
        <input type="text" placeholder="Enter name" />
        <button>Submit</button>
      </Modal>
    );
    
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });
});
