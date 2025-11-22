# Lifesight Marketing Dashboard

A React-based marketing analytics dashboard that displays aggregated marketing campaign data across multiple channels and regions with advanced filtering, sorting, and accessibility features.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Components](#components)
- [Utilities](#utilities)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Technologies Used](#technologies-used)
- [Accessibility](#accessibility)

## 🎯 Overview

This application provides a comprehensive view of marketing campaign performance data. It aggregates raw marketing data by channel and region, offering interactive features like:

- Real-time search/filtering by channel name
- Dynamic sorting by multiple metrics (spend, clicks, conversions, impressions)
- Expandable/collapsible regional data views
- Configurable modal interface
- Full keyboard navigation support
- ARIA-compliant accessibility features

## ✨ Features

### Core Functionality
- **Data Aggregation**: Automatically aggregates raw marketing data by channel and region
- **Live Search**: Filter channels in real-time with case-insensitive search
- **Multi-Metric Sorting**: Sort by total spend, conversions, clicks, or channel name
- **Regional Breakdown**: Expand channels to view detailed regional metrics
- **Performance Metrics**: Displays aggregation time and filtering results
- **Responsive UI**: Modern, clean interface with custom CSS-in-JS styling

### User Interface
- **Interactive Data Table**: Sortable columns with visual indicators
- **Modal Dialog**: Configuration modal with form inputs
- **Dropdown Menu**: Keyboard-accessible metric selection
- **Input Validation**: Error states and validation messages
- **Button Variants**: Primary, secondary, and disabled states

## 📁 Project Structure

```
lifesight/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Button.jsx           # Reusable button component
│   │   ├── CustomStyles.jsx     # Global CSS-in-JS styles
│   │   ├── DataTable.jsx        # Main data table with sorting/expansion
│   │   ├── DataTable.css        # Table-specific styles
│   │   ├── Dropdown.jsx         # Accessible dropdown menu
│   │   ├── Input.jsx            # Form input with validation
│   │   ├── Modal.jsx            # Accessible modal dialog
│   │   └── Modal.css            # Modal-specific styles
│   ├── constant/
│   │   ├── marketing_dashboard_data.json  # Raw marketing data
│   │   └── text.json            # UI text/labels (i18n ready)
│   ├── utils/
│   │   └── aggregateData.js     # Data aggregation utility
│   ├── unit-test/
│   │   ├── App.test.js          # Main app tests
│   │   ├── Button.test.js       # Button component tests
│   │   ├── CustomStyles.test.js # Styles component tests
│   │   ├── DataTable.test.js    # Table component tests
│   │   ├── Dropdown.test.js     # Dropdown component tests
│   │   ├── Input.test.js        # Input component tests
│   │   ├── Modal.test.js        # Modal component tests
│   │   └── README.md            # Testing documentation
│   ├── App.js                   # Main application component
│   ├── App.css                  # Application-specific styles
│   ├── index.js                 # React entry point
│   └── setupTests.js            # Jest test configuration
├── babel.config.js              # Babel configuration for Jest
├── jest.config.js               # Jest test configuration
└── package.json                 # Dependencies and scripts
```

## 🧩 Components

### App.js
**Main Application Component**

The root component that orchestrates the entire dashboard.

**Key Features:**
- Manages global state (sorting, filtering, modal, expansion)
- Implements data aggregation with performance tracking
- Handles search filtering with memoization
- Coordinates sorting logic across multiple metrics
- Provides keyboard and mouse interaction handlers

**State Management:**
```javascript
- aggregationTime: Performance metric for data processing
- sortBy: Current sort column key
- sortDirection: 'asc' or 'desc'
- expandedChannel: Currently expanded channel name
- inputValue: Search query string
- inputError: Validation error message
- dropdownSelection: Selected dropdown item
- isModalOpen: Modal visibility state
```

**Performance Optimizations:**
- `useMemo` for data aggregation, filtering, and sorting
- `useCallback` for event handlers to prevent unnecessary re-renders
- Efficient filtering algorithm for real-time search

---

### Button.jsx
**Configurable Button Component**

A flexible, accessible button with multiple variants and sizes.

**Props:**
```javascript
{
  variant: 'primary' | 'secondary'  // Default: 'primary'
  size: 'sm' | 'md' | 'lg'          // Default: 'md'
  disabled: boolean                  // Default: false
  onClick: function                  // Click handler
  children: React.ReactNode          // Button content
  ...props                          // Additional HTML attributes
}
```

**Features:**
- Ref forwarding support
- ARIA-compliant accessibility
- Disabled state handling
- Hover and focus states

---

### Input.jsx
**Form Input with Validation**

Text input component with built-in error handling and accessibility.

**Props:**
```javascript
{
  label: string                      // Required
  type: string                       // Default: 'text'
  value: string                      // Controlled value
  onChange: function                 // Change handler
  errorMessage: string               // Optional error message
  placeholder: string                // Optional placeholder
  ...props                          // Additional HTML attributes
}
```

**Features:**
- Automatic ID generation from label
- Error state visual indicators
- ARIA attributes for screen readers
- Support for various input types (text, email, password, etc.)

---

### Dropdown.jsx
**Keyboard Accessible Dropdown Menu**

Fully accessible dropdown with keyboard navigation.

**Props:**
```javascript
{
  label: string                      // Button label
  items: Array<{label, value}>       // Menu items
  onSelect: function                 // Selection handler
  'aria-label': string               // Optional accessibility label
}
```

**Features:**
- Keyboard navigation (Arrow keys, Enter, Escape)
- Focus management and trap
- Outside click detection
- Visual open/close indicators (▼/▲)
- ARIA attributes (aria-expanded, aria-controls, role="menu")

**Keyboard Controls:**
- `↓` / `↑`: Navigate items
- `Enter` / `Space`: Select item
- `Escape`: Close menu
- Tab: Move focus outside

---

### Modal.jsx
**Accessible Modal Dialog**

Portal-based modal with focus trap and backdrop handling.

**Props:**
```javascript
{
  isOpen: boolean                    // Visibility state
  onClose: function                  // Close handler
  title: string                      // Modal title
  children: React.ReactNode          // Modal content
}
```

**Features:**
- React Portal for proper z-index management
- Focus trap (Tab/Shift+Tab cycling)
- Escape key to close
- Backdrop click to close (with stopPropagation on content)
- ARIA dialog attributes

---

### DataTable.jsx
**Marketing Data Table**

Complex table component with sorting, formatting, and expansion.

**Props:**
```javascript
{
  sortedData: Array<ChannelData>     // Aggregated channel data
  handleSort: function               // Sort handler
  sortBy: string                     // Current sort key
  sortDirection: 'asc' | 'desc'      // Sort direction
  expandedChannel: string            // Expanded channel name
  toggleExpansion: function          // Expansion handler
}
```

**Features:**
- Sortable column headers with visual indicators (▲/▼)
- Currency formatting (USD with commas)
- Number formatting (thousands separators)
- Expandable rows showing regional breakdowns
- Keyboard navigation (Enter/Space to expand)
- ARIA attributes for screen readers

**Data Structure:**
```javascript
{
  channel: string,
  totalSpend: number,
  totalImpressions: number,
  totalConversions: number,
  totalClicks: number,
  regions: [{
    region: string,
    spend: number,
    impressions: number,
    conversions: number,
    clicks: number
  }]
}
```

---

### CustomStyles.jsx
**Global CSS-in-JS Styles**

Centralized styling using CSS-in-JS pattern.

**Features:**
- CSS custom properties (variables) for theming
- Component-specific styles (buttons, inputs, modals, tables)
- Responsive design patterns
- Hover and focus states
- Shadow and transition effects

**CSS Variables:**
```css
--color-primary: #007bff
--color-secondary: #6c757d
--color-success: #28a745
--color-danger: #dc3545
--color-background: #f8f9fa
--color-surface: #ffffff
--shadow-base: 0 4px 6px rgba(0, 0, 0, 0.1)
```

## 🛠 Utilities

### aggregateData.js
**Data Aggregation Function**

Transforms raw marketing records into aggregated channel/region structure.

**Function Signature:**
```javascript
aggregateData(data: Array<RawRecord>): Array<ChannelData>
```

**Input Format:**
```javascript
{
  channel: string,
  region: string,
  spend: number,
  impressions: number,
  conversions: number,
  clicks: number
}
```

**Output Format:**
```javascript
{
  channel: string,
  totalSpend: number,
  totalImpressions: number,
  totalConversions: number,
  totalClicks: number,
  regions: Array<RegionData>  // Sorted alphabetically
}
```

**Algorithm:**
1. Reduces raw data into a map keyed by channel
2. Accumulates totals for each channel
3. Groups regional data within each channel
4. Sorts regions alphabetically
5. Returns array of channel objects

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd lifesight

# Install dependencies
npm install

# Start development server
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

## 🚀 Available Scripts

### Development

```bash
# Start development server with hot reload
npm start
```

### Production Build

```bash
# Create optimized production build
npm run build
```

### Testing

```bash
# Run all tests in watch mode
npm test

# Run Jest tests only
npm run test:jest

# Run tests with coverage report
npm run test:jest -- --coverage

# Run specific test file
npm run test:jest Button.test.js
```

## 🧪 Testing

### Test Coverage

The project has **comprehensive test coverage** with 120+ tests across 7 test suites.

#### Component Tests

**Button.test.js** (18 tests)
- Variant rendering (primary, secondary)
- Size variations (sm, md, lg)
- Click event handling
- Disabled state behavior
- Ref forwarding
- Props spreading
- Combined class applications

**Input.test.js** (18 tests)
- Label and input rendering
- Type attribute handling (text, email, password)
- Value display and onChange handling
- Error message display
- Error styling and classes
- ARIA attributes (aria-invalid, aria-describedby)
- Accessibility compliance

**Dropdown.test.js** (21 tests)
- Open/close toggle functionality
- Menu item rendering and display
- Click selection handling
- Keyboard navigation (ArrowUp, ArrowDown, Enter, Escape)
- Focus management between items
- Outside click detection
- ARIA attributes (aria-expanded, role="menu")

**Modal.test.js** (18 tests)
- Open/close state management
- Backdrop click handling
- Close button functionality
- Escape key closing
- Focus trap implementation
- Tab navigation cycling
- Portal rendering validation
- ARIA dialog attributes

**DataTable.test.js** (31 tests)
- Table header rendering
- Data row display
- Currency formatting validation
- Number formatting with commas
- Sort functionality per column
- Sort direction indicators
- Row expansion/collapse
- Regional data display
- Keyboard navigation
- ARIA attributes (aria-expanded, aria-sort)

**CustomStyles.test.js** (14 tests)
- Style tag rendering
- CSS variable definitions
- Component-specific styles
- Responsive design patterns

**App.test.js** (14 tests)
- Component rendering
- Search/filter functionality
- Modal open/close interactions
- Dropdown selection
- Sorting operations
- UI state management
- Data aggregation
- Performance metrics

### Test Configuration

**Jest Configuration** (`jest.config.js`)
```javascript
{
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js']
}
```

**Babel Configuration** (`babel.config.js`)
```javascript
{
  presets: [
    '@babel/preset-env',
    '@babel/preset-react'
  ]
}
```

### Running Tests

```bash
# Watch mode (recommended for development)
npm run test:jest -- --watch

# Coverage report
npm run test:jest -- --coverage

# Verbose output
npm run test:jest -- --verbose

# Update snapshots
npm run test:jest -- -u
```

### Test Best Practices

✅ **Implemented:**
- User-centric queries (`getByRole`, `getByLabelText`)
- Accessibility testing (ARIA attributes)
- Keyboard interaction testing
- Edge case coverage
- Isolated component testing
- Proper mocking of dependencies
- Async behavior handling

## 🔧 Technologies Used

### Core
- **React** (v19.2.0) - UI library
- **React DOM** (v19.2.0) - React rendering

### Testing
- **Jest** (v27.5.1) - Test runner
- **@testing-library/react** (v16.3.0) - React testing utilities
- **@testing-library/jest-dom** (v6.9.1) - Custom matchers
- **@testing-library/user-event** (v13.5.0) - User interaction simulation

### Build Tools
- **React Scripts** (v5.0.1) - Build configuration
- **Babel** (v7.28.5) - JavaScript transpiler
  - @babel/preset-env
  - @babel/preset-react

### Development
- **ESLint** - Code linting (via react-scripts)
- **Jest** - Unit testing
- **Identity Obj Proxy** - CSS module mocking

## ♿ Accessibility

This application follows **WCAG 2.1 Level AA** guidelines and implements:

### Semantic HTML
- Proper heading hierarchy (`h1`, `h2`)
- Semantic elements (`<main>`, `<nav>`, `<section>`)
- Table structure with proper headers

### ARIA Attributes
- `role` attributes (dialog, menu, button, alert)
- `aria-label` for screen readers
- `aria-expanded` for expandable content
- `aria-controls` for relationships
- `aria-invalid` for form errors
- `aria-describedby` for error messages
- `aria-live` for dynamic content updates

### Keyboard Navigation
- Tab order follows logical flow
- All interactive elements are keyboard accessible
- Escape key closes modals and dropdowns
- Arrow keys for dropdown navigation
- Enter/Space for activation
- Focus trap in modals

### Visual Indicators
- Focus outlines on interactive elements
- Sort direction indicators (▲/▼)
- Expansion state indicators (►/▼)
- Error state coloring
- Disabled state styling

### Screen Reader Support
- Descriptive labels for all inputs
- Status messages for data updates
- Live regions for dynamic content
- Proper announcement of state changes

## 📝 Data Structure

### Raw Marketing Data
Located in `src/constant/marketing_dashboard_data.json`

```javascript
{
  "channel": "Google Ads",
  "region": "North America",
  "spend": 1500,
  "impressions": 50000,
  "conversions": 250,
  "clicks": 3000
}
```

### Text/Labels
Located in `src/constant/text.json`

Centralized text content for easy internationalization (i18n).

## 🎨 Styling Approach

The application uses a **CSS-in-JS** approach with:

1. **CustomStyles Component**: Global styles injected via `<style>` tag
2. **CSS Modules**: Component-specific styles (Modal.css, DataTable.css)
3. **CSS Variables**: Theming support with custom properties
4. **BEM-like Naming**: Consistent class naming conventions

### Theme Customization

To customize the theme, modify the CSS variables in `CustomStyles.jsx`:

```css
:root {
  --color-primary: #007bff;      /* Primary action color */
  --color-secondary: #6c757d;    /* Secondary action color */
  --color-background: #f8f9fa;   /* Page background */
  --color-surface: #ffffff;      /* Card/container background */
  /* ... more variables ... */
}
```

## 🚦 Performance Considerations

- **Memoization**: `useMemo` for expensive computations (aggregation, filtering, sorting)
- **Callback Optimization**: `useCallback` for event handlers
- **Lazy Rendering**: Conditional rendering of expanded regions
- **Performance Metrics**: Built-in aggregation time tracking

## 📄 License

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For issues and questions, please open an issue in the repository.

---

**Built with ❤️ using React and modern web technologies**
