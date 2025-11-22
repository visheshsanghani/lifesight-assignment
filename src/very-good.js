import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom'; // Required for Modal portal

// ==============================================================================
// 1. CUSTOM STYLES (Simulating styles.css)
// ==============================================================================
const CustomStyles = () => (
  <style>
    {`
    /* Global Styles */
    :root {
      --color-primary: #007bff;
      --color-secondary: #6c757d;
      --color-success: #28a745;
      --color-danger: #dc3545;
      --color-background: #f8f9fa;
      --color-surface: #ffffff;
      --color-text-dark: #343a40;
      --color-text-light: #f8f9fa;
      --color-border: #dee2e6;
      --shadow-base: 0 4px 6px rgba(0, 0, 0, 0.1);
      --shadow-hover: 0 6px 8px rgba(0, 0, 0, 0.15);
      --font-family: 'Inter', sans-serif;
    }
    body {
      margin: 0;
      padding: 0;
      background-color: var(--color-background);
      font-family: var(--font-family);
      color: var(--color-text-dark);
    }
    .container {
      max-width: 1000px;
      margin: 40px auto;
      padding: 20px;
      background-color: var(--color-surface);
      border-radius: 12px;
      box-shadow: var(--shadow-base);
    }

    /* Button Styles */
    .btn {
      padding: 10px 20px;
      border: 1px solid transparent;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s ease;
      text-align: center;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      font-size: 14px;
    }
    .btn-primary {
      background-color: var(--color-primary);
      color: var(--color-text-light);
      border-color: var(--color-primary);
    }
    .btn-secondary {
      background-color: var(--color-secondary);
      color: var(--color-text-light);
      border-color: var(--color-secondary);
    }
    .btn:hover:not(:disabled) {
      opacity: 0.9;
      box-shadow: var(--shadow-hover);
      transform: translateY(-1px);
    }
    .btn:disabled {
      background-color: #e9ecef;
      color: #adb5bd;
      border-color: #e9ecef;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }
    .btn-sm { padding: 6px 12px; font-size: 12px; }
    .btn-lg { padding: 12px 24px; font-size: 16px; }

    /* Input Styles */
    .input-group { margin-bottom: 15px; }
    .input-label { display: block; margin-bottom: 5px; font-weight: 500; font-size: 14px; }
    .input-field {
      width: 100%;
      padding: 10px;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    .input-field:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
    .input-error .input-field { border-color: var(--color-danger); }
    .input-error-message { color: var(--color-danger); font-size: 12px; margin-top: 5px; }

    /* Modal Styles */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .modal-active { opacity: 1; }
    .modal-content {
      background-color: var(--color-surface);
      padding: 30px;
      border-radius: 8px;
      box-shadow: var(--shadow-hover);
      min-width: 300px;
      max-width: 90%;
      transform: translateY(-20px);
      transition: transform 0.3s ease;
      z-index: 1001;
    }
    .modal-active .modal-content { transform: translateY(0); }

    /* Dropdown Styles */
    .dropdown-container { position: relative; display: inline-block; }
    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 5px;
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 6px;
      box-shadow: var(--shadow-base);
      min-width: 150px;
      z-index: 500;
      list-style: none;
      padding: 5px 0;
    }
    .dropdown-item {
      padding: 8px 15px;
      cursor: pointer;
      font-size: 14px;
      color: var(--color-text-dark);
    }
    .dropdown-item:hover, .dropdown-item.focus-visible {
      background-color: #f1f1f1;
    }

    /* Table Styles */
    .table-container {
      border: 1px solid var(--color-border);
      border-radius: 8px;
      overflow-hidden;
      width: 100%;
      box-shadow: var(--shadow-base);
      margin-top: 20px;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
    }
    .data-table thead {
      background-color: var(--color-primary);
      color: var(--color-text-light);
    }
    .data-table th, .data-table td {
      padding: 12px 15px;
      text-align: right;
      border-bottom: 1px solid #e9ecef;
      font-size: 14px;
    }
    .data-table th:first-child, .data-table td:first-child {
      text-align: left;
    }
    .data-table th {
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.2s;
    }
    .data-table th:hover {
      background-color: #0069d9;
    }

    /* Channel Row (Level 1) */
    .row-channel {
      cursor: pointer;
      font-weight: 700;
      background-color: var(--color-surface);
      transition: background-color 0.15s;
    }
    .row-channel:hover {
      background-color: #f0f8ff;
    }
    .row-channel-expanded {
      background-color: #e6f3ff;
    }
    .row-channel td {
      color: var(--color-primary);
      border-bottom: 1px solid var(--color-primary);
    }

    /* Region Row (Level 2 Detail) */
    .row-region {
      background-color: #f7f9fb;
      transition: background-color 0.1s;
    }
    .row-region:hover {
      background-color: #e9ecef;
    }
    .row-region td:first-child {
      padding-left: 50px !important;
      font-weight: 400;
      color: var(--color-secondary);
    }

    .sort-icon {
      margin-left: 5px;
      font-size: 10px;
    }
    .text-right { text-align: right; }
    .text-left { text-align: left; }
    .text-center { text-align: center; }
    .mr-2 { margin-right: 8px; }

    `}
  </style>
);


// ==============================================================================
// 2. CORE UTILITIES
// ==============================================================================
const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const formatNumber = (value) =>
  new Intl.NumberFormat('en-US').format(value);

const headers = [
  { key: 'channel', label: 'Channel', type: 'string' },
  { key: 'totalSpend', label: 'Total Spend', type: 'currency' },
  { key: 'totalImpressions', label: 'Impressions', type: 'number' },
  { key: 'totalConversions', label: 'Conversions', type: 'number' },
  { key: 'totalClicks', label: 'Clicks', type: 'number' },
];


// ==============================================================================
// 3. REUSABLE UI COMPONENTS (Simulating components/...)
// ==============================================================================

/**
 * // components/Button.jsx
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
      aria-label={typeof children === 'string' ? children : 'Action button'}
      {...props}
    >
      {children}
    </button>
  );
});

/**
 * // components/Input.jsx
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

/**
 * // components/Modal.jsx
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
    >
      <div 
        ref={modalRef}
        className="modal-content"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
        tabIndex={-1} // Make modal container focusable
      >
        <h2 id="modal-title" style={{ marginTop: 0, borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>{title}</h2>
        {children}
        <div style={{ textAlign: 'right', paddingTop: '15px' }}>
            <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>,
    document.body
  );
};


/**
 * // components/Dropdown.jsx
 * Keyboard Accessible Dropdown component.
 * @param {string} label - Button label
 * @param {Array<{label: string, value: string}>} items - List of dropdown items
 * @param {function} onSelect - Handler for item selection
 */
const Dropdown = ({ label, items, onSelect }) => {
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


/**
 * // components/DataTable.jsx
 * Table component for displaying marketing data with sorting and expansion.
 */
const DataTable = ({ sortedData, handleSort, sortBy, sortDirection, expandedChannel, toggleExpansion }) => {
    // Helper component for sort icon
    const SortIcon = ({ columnKey }) => {
        if (sortBy !== columnKey) return null;
        return (
            <span className="sort-icon">
                {sortDirection === 'asc' ? '▲' : '▼'}
            </span>
        );
    };

    // The rendering function for the table body, which handles expansion
    const renderTableRows = useCallback(() => {
        // flatMap creates a flat array of <tr> elements from the nested channel/region structure
        return sortedData.flatMap((channelData) => {
            // 1. Channel Row (The Header/Baseline Row)
            const isExpanded = expandedChannel === channelData.channel;
            const channelRow = (
                <tr
                    key={channelData.channel}
                    onClick={() => toggleExpansion(channelData.channel)}
                    className={`row-channel ${isExpanded ? 'row-channel-expanded' : ''}`}
                    aria-expanded={isExpanded}
                    aria-controls={`details-${channelData.channel.replace(/\s/g, '-')}`}
                    tabIndex={0}
                    role="button"
                >
                    <td className="text-left" style={{ fontWeight: 700 }}>
                        <span className="mr-2" style={{ fontSize: '1.2em' }}>{isExpanded ? '▼' : '►'}</span>
                        {channelData.channel}
                    </td>
                    {/* Channel Totals */}
                    <td className="text-right" style={{ fontWeight: 700 }}>
                        {formatCurrency(channelData.totalSpend)}
                    </td>
                    <td className="text-right">
                        {formatNumber(channelData.totalImpressions)}
                    </td>
                    <td className="text-right">
                        {formatNumber(channelData.totalConversions)}
                    </td>
                    <td className="text-right">
                        {formatNumber(channelData.totalClicks)}
                    </td>
                </tr>
            );

            let rows = [channelRow];

            // 2. Conditionally render the Region Detail Rows
            if (isExpanded) {
                channelData.regions.forEach((regionData) => {
                    const regionKey = `${channelData.channel}-${regionData.region}`;

                    const regionRow = (
                        <tr key={regionKey} className={`row-region`} role="row">
                            {/* Indentation for region name */}
                            <td className="text-left">
                                — {regionData.region}
                            </td>
                            {/* Region Metrics (using spend/impressions/etc. keys) */}
                            <td className="text-right">
                                {formatCurrency(regionData.spend)}
                            </td>
                            <td className="text-right">
                                {formatNumber(regionData.impressions)}
                            </td>
                            <td className="text-right">
                                {formatNumber(regionData.conversions)}
                            </td>
                            <td className="text-right">
                                {formatNumber(regionData.clicks)}
                            </td>
                        </tr>
                    );
                    rows.push(regionRow);
                });
            }

            return rows;
        });
    }, [sortedData, expandedChannel, toggleExpansion]);

    return (
        <div className="table-container">
            <table className="data-table" role="table" aria-label="Marketing Channel Performance Summary">
                <thead>
                    <tr>
                        {headers.map((header) => (
                            <th
                                key={header.key}
                                onClick={() => handleSort(header.key)}
                                className={header.key === 'channel' ? 'text-left' : 'text-right'}
                                aria-sort={sortBy === header.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: header.key === 'channel' ? 'flex-start' : 'flex-end' }}>
                                    {header.label}
                                    <SortIcon columnKey={header.key} />
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {renderTableRows()}
                </tbody>
            </table>
        </div>
    );
};


// ==============================================================================
// 4. DATA LOGIC (Simulating utils/dataProcessor.js)
// ==============================================================================
// Placeholder Data - Duplicating the small array to simulate ~5000 records
const RAW_DATA = [
  { "id": 1, "channel": "TikTok", "region": "Europe", "spend": 677.8, "impressions": 460608, "conversions": 623, "clicks": 32766 },
  { "id": 2, "channel": "Pinterest", "region": "Europe", "spend": 6627.17, "impressions": 583437, "conversions": 810, "clicks": 12448 },
  { "id": 3, "channel": "Snapchat", "region": "South America", "spend": 4821.54, "impressions": 185775, "conversions": 1941, "clicks": 39525 },
  { "id": 4, "channel": "Snapchat", "region": "Asia", "spend": 7500.04, "impressions": 522022, "conversions": 589, "clicks": 33464 },
  { "id": 5, "channel": "Twitter", "region": "Australia", "spend": 1662.91, "impressions": 818850, "conversions": 33, "clicks": 49090 },
  { "id": 6, "channel": "Google", "region": "North America", "spend": 4012.33, "impressions": 300000, "conversions": 2500, "clicks": 15000 },
  { "id": 7, "channel": "TikTok", "region": "North America", "spend": 1200.5, "impressions": 550000, "conversions": 900, "clicks": 45000 },
  { "id": 8, "channel": "Pinterest", "region": "Asia", "spend": 3200.44, "impressions": 210000, "conversions": 450, "clicks": 18000 },
  { "id": 9993, "channel": "Reddit", "region": "Australia", "spend": 3391.0, "impressions": 9332, "conversions": 1136, "clicks": 17349 },
  { "id": 9994, "channel": "Google", "region": "Asia", "spend": 615.09, "impressions": 717297, "conversions": 1205, "clicks": 37512 },
  { "id": 9995, "channel": "Twitter", "region": "North America", "spend": 778.79, "impressions": 186001, "conversions": 117, "clicks": 36831 },
].flatMap((item, index) => Array.from({ length: 500 }, (_, i) => ({ ...item, id: (index * 500) + i + 1 })));

const aggregateData = (data) => {
  const aggregatedMap = data.reduce((acc, record) => {
    const { channel, region, spend, impressions, conversions, clicks } = record;

    if (!acc[channel]) {
      acc[channel] = {
        channel,
        totalSpend: 0,
        totalImpressions: 0,
        totalConversions: 0,
        totalClicks: 0,
        regions: {},
      };
    }

    // Sum the Channel Totals
    acc[channel].totalSpend += spend;
    acc[channel].totalImpressions += impressions;
    acc[channel].totalConversions += conversions;
    acc[channel].totalClicks += clicks;

    // Initialize/Sum the Regional Totals
    if (!acc[channel].regions[region]) {
      acc[channel].regions[region] = {
        region,
        spend: 0,
        impressions: 0,
        conversions: 0,
        clicks: 0,
      };
    }
    acc[channel].regions[region].spend += spend;
    acc[channel].regions[region].impressions += impressions;
    acc[channel].regions[region].conversions += conversions;
    acc[channel].regions[region].clicks += clicks;

    return acc;
  }, {});

  return Object.values(aggregatedMap).map(channelData => ({
    ...channelData,
    regions: Object.values(channelData.regions).sort((a, b) => a.region.localeCompare(b.region))
  }));
};


// ==============================================================================
// 5. MAIN APPLICATION (Simulating App.jsx)
// ==============================================================================

const App = () => {
  // --- Data State & Memoization ---
  const [aggregationTime, setAggregationTime] = useState(0);
  const [sortBy, setSortBy] = useState('totalSpend');
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandedChannel, setExpandedChannel] = useState(null);

  const aggregatedData = useMemo(() => {
    const startTime = performance.now();
    const result = aggregateData(RAW_DATA);
    const endTime = performance.now();
    setAggregationTime(Math.round(endTime - startTime));
    return result;
  }, []);

  const sortedData = useMemo(() => {
    const sorted = [...aggregatedData].sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [aggregatedData, sortBy, sortDirection]);

  // --- Handlers ---
  const handleSort = useCallback((key) => {
    setSortBy(prevKey => {
      if (prevKey === key) {
        setSortDirection(prevDir => (prevDir === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortDirection('desc');
      }
      return key;
    });
  }, []);

  const toggleExpansion = useCallback((channelName) => {
    setExpandedChannel(prev => (prev === channelName ? null : channelName));
  }, []);

  // --- Component Demo State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [dropdownSelection, setDropdownSelection] = useState({ label: 'Select Metric', value: '' });

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length < 5) {
      setInputError('Input must be at least 5 characters.');
    } else {
      setInputError('');
    }
  };

  const dropdownItems = [
    { label: 'Sort by Spend', value: 'totalSpend' },
    { label: 'Sort by Conversions', value: 'totalConversions' },
    { label: 'Reset Sort', value: 'channel' }
  ];

  const handleDropdownSelect = (item) => {
      setDropdownSelection(item);
      handleSort(item.value); // Use dropdown selection to update table sort
  }

  return (
    <>
      <CustomStyles />
      <div className="container">
        <h1 style={{ color: 'var(--color-primary)', borderBottom: '2px solid #ddd', paddingBottom: '10px', marginBottom: '20px' }}>
          Dynamic Marketing Dashboard
        </h1>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '30px' }}>
          <Button onClick={() => setIsModalOpen(true)} variant="primary">
            Open Config Modal
          </Button>
          <Button onClick={() => handleSort('totalClicks')} variant="secondary" size="sm">
            Quick Sort by Clicks
          </Button>
          <Button disabled>
            Disabled Button
          </Button>
          <Dropdown
              label={dropdownSelection.label}
              items={dropdownItems}
              onSelect={handleDropdownSelect}
          />
        </div>

        {/* Input Demo */}
        <div style={{ maxWidth: '300px', marginBottom: '20px' }}>
            <Input
                label="Filter by Channel Name"
                value={inputValue}
                onChange={handleInputChange}
                errorMessage={inputError}
                placeholder="Type at least 5 characters"
            />
        </div>

        {/* Modal Demo */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Dashboard Configuration"
        >
          <p>This is a custom modal, featuring a focus trap and accessible closure via the Escape key or backdrop click.</p>
          <Input label="Setting 1" value="Example" onChange={() => {}} />
          <p style={{ marginTop: '10px', fontSize: '12px', color: 'var(--color-secondary)' }}>You can place any component inside the modal.</p>
        </Modal>
        
        <p style={{ fontSize: '14px', color: 'var(--color-secondary)', marginBottom: '15px' }}>
          Data for {RAW_DATA.length} records. Aggregation completed in <span style={{ fontWeight: 600 }}>{aggregationTime} ms</span>.
        </p>

        {/* Data Table */}
        <DataTable
            sortedData={sortedData}
            handleSort={handleSort}
            sortBy={sortBy}
            sortDirection={sortDirection}
            expandedChannel={expandedChannel}
            toggleExpansion={toggleExpansion}
        />

        {sortedData.length === 0 && (
          <div className="text-center" style={{ padding: '20px', color: 'var(--color-secondary)' }}>No data available to display.</div>
        )}
      </div>
    </>
  );
};

export default App;