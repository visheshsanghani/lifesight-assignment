import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dropdown from '../components/Dropdown';

const mockItems = [
  { label: 'Option 1', value: 'opt1' },
  { label: 'Option 2', value: 'opt2' },
  { label: 'Option 3', value: 'opt3' }
];

describe('Dropdown Component', () => {
  test('renders dropdown button with label', () => {
    render(<Dropdown label="Select Option" items={mockItems} onSelect={() => {}} />);
    expect(screen.getByRole('button', { name: /select option/i })).toBeInTheDocument();
  });

  test('dropdown menu is closed by default', () => {
    render(<Dropdown label="Select Option" items={mockItems} onSelect={() => {}} />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('opens dropdown menu when button is clicked', () => {
    render(<Dropdown label="Select Option" items={mockItems} onSelect={() => {}} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  test('closes dropdown menu when button is clicked again', () => {
    render(<Dropdown label="Select Option" items={mockItems} onSelect={() => {}} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    fireEvent.click(button);
    
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('displays all menu items when open', () => {
    render(<Dropdown label="Select Option" items={mockItems} onSelect={() => {}} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  test('calls onSelect when an item is clicked', () => {
    const handleSelect = jest.fn();
    render(<Dropdown label="Select Option" items={mockItems} onSelect={handleSelect} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const option1 = screen.getByText('Option 1');
    fireEvent.click(option1);
    
    expect(handleSelect).toHaveBeenCalledWith(mockItems[0]);
  });

  test('closes dropdown after selecting an item', () => {
    const handleSelect = jest.fn();
    render(<Dropdown label="Select Option" items={mockItems} onSelect={handleSelect} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const option1 = screen.getByText('Option 1');
    fireEvent.click(option1);
    
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('shows down arrow when closed', () => {
    render(<Dropdown label="Select" items={mockItems} onSelect={() => {}} />);
    expect(screen.getByText(/▼/)).toBeInTheDocument();
  });

  test('shows up arrow when open', () => {
    render(<Dropdown label="Select" items={mockItems} onSelect={() => {}} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(screen.getByText(/▲/)).toBeInTheDocument();
  });

  test('button has correct aria-expanded attribute when closed', () => {
    render(<Dropdown label="Select" items={mockItems} onSelect={() => {}} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('button has correct aria-expanded attribute when open', () => {
    render(<Dropdown label="Select" items={mockItems} onSelect={() => {}} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  test('closes dropdown on Escape key', () => {
    render(<Dropdown label="Select" items={mockItems} onSelect={() => {}} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const container = screen.getByRole('menu').parentElement;
    fireEvent.keyDown(container, { key: 'Escape' });
    
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('navigates down with ArrowDown key', () => {
    render(<Dropdown label="Select" items={mockItems} onSelect={() => {}} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const container = screen.getByRole('menu').parentElement;
    fireEvent.keyDown(container, { key: 'ArrowDown' });
    
    // First item should have focus-visible class
    const items = screen.getAllByRole('menuitem');
    expect(items[0]).toHaveClass('focus-visible');
  });

  test('navigates up with ArrowUp key', () => {
    render(<Dropdown label="Select" items={mockItems} onSelect={() => {}} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const container = screen.getByRole('menu').parentElement;
    fireEvent.keyDown(container, { key: 'ArrowUp' });
    
    // Last item should have focus-visible class
    const items = screen.getAllByRole('menuitem');
    expect(items[2]).toHaveClass('focus-visible');
  });

  test('selects item with Enter key', () => {
    const handleSelect = jest.fn();
    render(<Dropdown label="Select" items={mockItems} onSelect={handleSelect} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const container = screen.getByRole('menu').parentElement;
    fireEvent.keyDown(container, { key: 'ArrowDown' });
    fireEvent.keyDown(container, { key: 'Enter' });
    
    expect(handleSelect).toHaveBeenCalledWith(mockItems[0]);
  });

  test('uses aria-label when provided', () => {
    render(
      <Dropdown 
        label="Select" 
        items={mockItems} 
        onSelect={() => {}} 
        aria-label="Custom Label"
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Custom Label');
  });

  test('menu items have menuitem role', () => {
    render(<Dropdown label="Select" items={mockItems} onSelect={() => {}} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems).toHaveLength(3);
  });

  test('handles empty items array', () => {
    render(<Dropdown label="Select" items={[]} onSelect={() => {}} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const menu = screen.getByRole('menu');
    expect(menu.children).toHaveLength(0);
  });

  test('cycles through items with ArrowDown', () => {
    render(<Dropdown label="Select" items={mockItems} onSelect={() => {}} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const container = screen.getByRole('menu').parentElement;
    
    // Navigate through all items
    fireEvent.keyDown(container, { key: 'ArrowDown' }); // Item 0
    fireEvent.keyDown(container, { key: 'ArrowDown' }); // Item 1
    fireEvent.keyDown(container, { key: 'ArrowDown' }); // Item 2
    fireEvent.keyDown(container, { key: 'ArrowDown' }); // Cycle back to 0
    
    const items = screen.getAllByRole('menuitem');
    expect(items[0]).toHaveClass('focus-visible');
  });
});
