import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';
import TEXT from '../constant/text.json';
import './Modal.css';

/**
 * Accessible Modal component with focus trap and backdrop click handling.
 * @param {boolean} isOpen
 * @param {function} onClose
 * @param {string} title
 * @param {React.ReactNode} children
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef(null);

  // Focus Trap and Accessibility
  useEffect(() => {
    if (!isOpen) return;

    const modalElement = modalRef.current;
    if (!modalElement) return;

    // Set focus to the modal container
    modalElement.focus();

    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstFocusable) {
            lastFocusable?.focus();
            e.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastFocusable) {
            firstFocusable?.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Use ReactDOM.createPortal for proper z-indexing and focus management
  return ReactDOM.createPortal(
    <div 
      className={`modal-backdrop ${isOpen ? 'modal-active' : ''}`}
      onClick={onClose} // Backdrop click to close
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div 
        ref={modalRef}
        className="modal-content"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
        tabIndex={-1} // Make modal container focusable
      >
        <h2 id="modal-title" className="modal-title">{title}</h2>
        <div id="modal-description">
        {children}
        </div>
        <div className="modal-actions">
            <Button variant="secondary" onClick={onClose} aria-label="Close modal">{TEXT.modal.close}</Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
