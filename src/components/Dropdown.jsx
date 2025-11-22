import React, { useState, useCallback, useRef, useEffect } from 'react';
import Button from './Button';

/**
 * Keyboard Accessible Dropdown component.
 * @param {string} label - Button label
 * @param {Array<{label: string, value: string}>} items - List of dropdown items
 * @param {function} onSelect - Handler for item selection
 * @param {string} ariaLabel - Accessibility label for the dropdown
 */
const Dropdown = ({ label, items, onSelect, 'aria-label': ariaLabel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const toggleOpen = useCallback(() => setIsOpen(prev => !prev), []);
  const handleSelect = useCallback((item) => {
    onSelect(item);
    setIsOpen(false);
    buttonRef.current?.focus(); // Return focus to the button
  }, [onSelect]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;

    const list = items;

    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        buttonRef.current?.focus();
        e.preventDefault();
        break;
      case 'ArrowDown':
        setFocusedIndex(prev => (prev < list.length - 1 ? prev + 1 : 0));
        e.preventDefault();
        break;
      case 'ArrowUp':
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : list.length - 1));
        e.preventDefault();
        break;
      case 'Enter':
      case ' ':
        if (focusedIndex >= 0) {
          handleSelect(list[focusedIndex]);
        }
        e.preventDefault();
        break;
      default:
        break;
    }
  }, [isOpen, focusedIndex, items, handleSelect]);

  // Handle focus changes outside the component
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && menuRef.current) {
      const itemElement = menuRef.current.children[focusedIndex];
      if (itemElement) {
        itemElement.focus();
      }
    }
  }, [isOpen, focusedIndex]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <div className="dropdown-container" onKeyDown={handleKeyDown}>
      <Button 
        ref={buttonRef}
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-controls="dropdown-menu"
        aria-haspopup="true"
        aria-label={ariaLabel || label}
        variant="secondary"
      >
        {label} {isOpen ? '▲' : '▼'}
      </Button>

      {isOpen && (
        <ul 
          ref={menuRef}
          id="dropdown-menu"
          className="dropdown-menu"
          role="menu"
          tabIndex={-1} // Make the list container focusable
          onBlur={(e) => {
            // Check if the related target is outside the dropdown container
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setIsOpen(false);
            }
          }}
        >
          {items.map((item, index) => (
            <li
              key={item.value}
              className={`dropdown-item ${index === focusedIndex ? 'focus-visible' : ''}`}
              onClick={() => handleSelect(item)}
              role="menuitem"
              tabIndex={0}
              onFocus={() => setFocusedIndex(index)}
              onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                      handleSelect(item);
                      e.preventDefault();
                  }
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
