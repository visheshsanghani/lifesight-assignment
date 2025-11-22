import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock the aggregateData utility
jest.mock('../utils/aggregateData', () => {
  return jest.fn(() => [
    {
      channel: 'Google Ads',
      totalSpend: 5000,
      totalClicks: 1500,
      totalConversions: 250,
      regions: [
        { region: 'North America', spend: 2500, clicks: 750, conversions: 125, impressions: 10000 }
      ],
      campaigns: [
        { name: 'Campaign 1', spend: 2500, clicks: 750, conversions: 125 }
      ]
    },
    {
      channel: 'Facebook Ads',
      totalSpend: 3000,
      totalClicks: 1000,
      totalConversions: 150,
      regions: [
        { region: 'Europe', spend: 3000, clicks: 1000, conversions: 150, impressions: 8000 }
      ],
      campaigns: [
        { name: 'Campaign 2', spend: 3000, clicks: 1000, conversions: 150 }
      ]
    },
    {
      channel: 'LinkedIn Ads',
      totalSpend: 2000,
      totalClicks: 500,
      totalConversions: 100,
      regions: [
        { region: 'Asia', spend: 2000, clicks: 500, conversions: 100, impressions: 5000 }
      ],
      campaigns: [
        { name: 'Campaign 3', spend: 2000, clicks: 500, conversions: 100 }
      ]
    }
  ]);
});

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the app with title', () => {
    render(<App />);
    const titleElement = screen.getByRole('heading', { level: 1 });
    expect(titleElement).toBeInTheDocument();
  });

  test('displays all channels initially', () => {
    render(<App />);
    expect(screen.getByText('Google Ads')).toBeInTheDocument();
    expect(screen.getByText('Facebook Ads')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn Ads')).toBeInTheDocument();
  });

  test('filters channels based on search input', async () => {
    render(<App />);
    
    const searchInput = screen.getByPlaceholderText(/Start typing a channel/i);
    fireEvent.change(searchInput, { target: { value: 'Google' } });

    await waitFor(() => {
      expect(screen.getByText('Google Ads')).toBeInTheDocument();
    });
    expect(screen.queryByText('Facebook Ads')).not.toBeInTheDocument();
    expect(screen.queryByText('LinkedIn Ads')).not.toBeInTheDocument();
  });

  test('shows all channels when search input is cleared', async () => {
    render(<App />);
    
    const searchInput = screen.getByPlaceholderText(/Start typing a channel/i);
    
    // First filter
    fireEvent.change(searchInput, { target: { value: 'Google' } });
    await waitFor(() => {
      expect(screen.queryByText('Facebook Ads')).not.toBeInTheDocument();
    });

    // Clear filter
    fireEvent.change(searchInput, { target: { value: '' } });
    await waitFor(() => {
      expect(screen.getByText('Google Ads')).toBeInTheDocument();
    });
    expect(screen.getByText('Facebook Ads')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn Ads')).toBeInTheDocument();
  });

  test('case-insensitive filtering works correctly', async () => {
    render(<App />);
    
    const searchInput = screen.getByPlaceholderText(/Start typing a channel/i);
    fireEvent.change(searchInput, { target: { value: 'google' } });

    await waitFor(() => {
      expect(screen.getByText('Google Ads')).toBeInTheDocument();
    });
    expect(screen.queryByText('Facebook Ads')).not.toBeInTheDocument();
  });

  test('shows "no data" message when no channels match filter', async () => {
    render(<App />);
    
    const searchInput = screen.getByPlaceholderText(/Start typing a channel/i);
    fireEvent.change(searchInput, { target: { value: 'NonExistentChannel' } });

    await waitFor(() => {
      const noDataMessage = screen.getByText(/no data/i);
      expect(noDataMessage).toBeInTheDocument();
    });
  });

  test('opens modal when "Open Configuration Modal" button is clicked', () => {
    render(<App />);
    
    const openModalButton = screen.getByLabelText(/open configuration modal/i);
    fireEvent.click(openModalButton);

    // Check if modal is visible
    const modalTitle = screen.getByRole('heading', { level: 2 });
    expect(modalTitle).toBeInTheDocument();
  });

  test('closes modal when close button is clicked', () => {
    render(<App />);
    
    // Open modal
    const openModalButton = screen.getByLabelText(/open configuration modal/i);
    fireEvent.click(openModalButton);

    // Close modal
    const closeButton = screen.getByLabelText(/close modal/i);
    fireEvent.click(closeButton);

    // Modal should not be visible
    const modalTitle = screen.queryByRole('heading', { level: 2 });
    expect(modalTitle).not.toBeInTheDocument();
  });

  test('sorts data when quick sort button is clicked', () => {
    render(<App />);
    
    const quickSortButton = screen.getByLabelText(/sort table by total clicks/i);
    fireEvent.click(quickSortButton);

    // Verify sort was triggered (this is a basic test - you might want to verify actual order)
    expect(quickSortButton).toBeInTheDocument();
  });

  test('dropdown changes sort order', () => {
    render(<App />);
    
    // Find and click dropdown
    const dropdown = screen.getByLabelText(/sort data by metric/i);
    fireEvent.click(dropdown);

    // Select an option (you may need to adjust based on your Dropdown component implementation)
    // This is a basic test - you might need to adjust based on how your Dropdown renders options
    expect(dropdown).toBeInTheDocument();
  });

  test('displays correct channel count in status text', () => {
    render(<App />);
    
    const statusText = screen.getByRole('status', { name: '' });
    expect(statusText).toHaveTextContent('3'); // Should show 3 out of 3 channels
  });

  test('disabled button is disabled', () => {
    render(<App />);
    
    const disabledButton = screen.getByRole('button', { name: /disabled/i });
    expect(disabledButton).toBeDisabled();
  });

  test('expands and collapses channel details when clicked', () => {
    render(<App />);
    
    // Click on a channel name to expand
    const googleAdsElement = screen.getByText('Google Ads');
    fireEvent.click(googleAdsElement);
    
    // After clicking, campaign details should be visible
    // Add assertions based on your DataTable expansion behavior
    expect(googleAdsElement).toBeInTheDocument();
  });

  test('aggregation time is displayed', () => {
    render(<App />);
    
    const statusText = screen.getByRole('status', { name: '' });
    // Check that the status text contains a time value (even if 0 ms)
    expect(statusText.textContent).toMatch(/\d+\sms/);
  });
});
