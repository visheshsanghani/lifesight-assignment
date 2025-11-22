import React from 'react';

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
      overflow: hidden;
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

export default CustomStyles;
