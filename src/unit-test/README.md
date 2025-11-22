# Unit Tests

## Overview
Comprehensive unit tests for all components and the main App using Jest and React Testing Library.

## Test Files

### Component Tests
1. **Button.test.js** - Button component tests (18 tests)
   - Variant rendering (primary, secondary)
   - Size rendering (sm, md, lg)
   - Click handlers
   - Disabled state
   - Ref forwarding
   - Props spreading

2. **Input.test.js** - Input component tests (18 tests)
   - Label rendering
   - Input types (text, email, password)
   - Value handling
   - Change handlers
   - Error states and messages
   - Accessibility attributes (aria-invalid, aria-describedby)

3. **Dropdown.test.js** - Dropdown component tests (21 tests)
   - Open/close functionality
   - Menu item rendering
   - Click selection
   - Keyboard navigation (Arrow keys, Enter, Escape)
   - Focus management
   - Accessibility attributes

4. **Modal.test.js** - Modal component tests (18 tests)
   - Open/close states
   - Backdrop clicks
   - Close button
   - Keyboard navigation (Escape)
   - Focus trap
   - Portal rendering
   - Accessibility attributes

5. **DataTable.test.js** - DataTable component tests (31 tests)
   - Header rendering
   - Data formatting (currency, numbers)
   - Sorting functionality
   - Expand/collapse regions
   - Keyboard navigation
   - Accessibility attributes (aria-expanded, aria-sort)

6. **CustomStyles.test.js** - CustomStyles component tests (14 tests)
   - CSS variable definitions
   - Style tag rendering
   - Component styles presence

### Application Tests
7. **App.test.js** - Main App component tests (14 tests)
   - Component rendering
   - Search/filtering functionality
   - Modal interactions
   - Sorting
   - UI state management

## Test Coverage Summary
- **Total Tests**: 120
- **Test Suites**: 7
- **All Passing**: ✓

## Running Tests

```bash
# Run all Jest tests
npm run test:jest

# Run with coverage
npm run test:jest -- --coverage

# Run in watch mode
npm run test:jest -- --watch

# Run specific test file
npm run test:jest Button.test.js
```

## Test Configuration
- Jest config: `jest.config.js`
- Babel config: `babel.config.js`
- Test environment: jsdom
- Testing libraries: @testing-library/react, @testing-library/jest-dom

## Mock Data
Tests use appropriate mock data for each component:
- DataTable & App: Mocked channel data with regions and metrics
- Dropdown: Array of label/value pairs
- Other components: Minimal props for focused testing

## Best Practices Followed
- ✓ Accessibility testing (ARIA attributes, keyboard navigation)
- ✓ User-centric queries (getByRole, getByLabelText)
- ✓ Isolated component testing
- ✓ Edge case coverage
- ✓ Event handling validation
- ✓ State management verification
