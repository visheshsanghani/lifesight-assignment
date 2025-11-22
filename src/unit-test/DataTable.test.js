import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataTable from '../components/DataTable';

const mockData = [
  {
    channel: 'Google Ads',
    totalSpend: 5000,
    totalImpressions: 50000,
    totalConversions: 250,
    totalClicks: 1500,
    regions: [
      {
        region: 'North America',
        spend: 3000,
        impressions: 30000,
        conversions: 150,
        clicks: 900
      },
      {
        region: 'Europe',
        spend: 2000,
        impressions: 20000,
        conversions: 100,
        clicks: 600
      }
    ]
  },
  {
    channel: 'Facebook Ads',
    totalSpend: 3000,
    totalImpressions: 40000,
    totalConversions: 150,
    totalClicks: 1000,
    regions: [
      {
        region: 'Asia',
        spend: 3000,
        impressions: 40000,
        conversions: 150,
        clicks: 1000
      }
    ]
  }
];

describe('DataTable Component', () => {
  const defaultProps = {
    sortedData: mockData,
    handleSort: jest.fn(),
    sortBy: 'totalSpend',
    sortDirection: 'desc',
    expandedChannel: null,
    toggleExpansion: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders table with correct headers', () => {
    render(<DataTable {...defaultProps} />);
    
    expect(screen.getByText('Channel')).toBeInTheDocument();
    expect(screen.getByText('Total Spend')).toBeInTheDocument();
    expect(screen.getByText('Impressions')).toBeInTheDocument();
    expect(screen.getByText('Conversions')).toBeInTheDocument();
    expect(screen.getByText('Clicks')).toBeInTheDocument();
  });

  test('displays all channel data', () => {
    render(<DataTable {...defaultProps} />);
    
    expect(screen.getByText('Google Ads')).toBeInTheDocument();
    expect(screen.getByText('Facebook Ads')).toBeInTheDocument();
  });

  test('formats currency correctly', () => {
    render(<DataTable {...defaultProps} />);
    
    expect(screen.getByText('$5,000')).toBeInTheDocument();
    expect(screen.getByText('$3,000')).toBeInTheDocument();
  });

  test('formats numbers correctly', () => {
    render(<DataTable {...defaultProps} />);
    
    expect(screen.getByText('50,000')).toBeInTheDocument();
    expect(screen.getByText('1,500')).toBeInTheDocument();
  });

  test('calls handleSort when header is clicked', () => {
    const handleSort = jest.fn();
    render(<DataTable {...defaultProps} handleSort={handleSort} />);
    
    const channelHeader = screen.getByText('Channel');
    fireEvent.click(channelHeader);
    
    expect(handleSort).toHaveBeenCalledWith('channel');
  });

  test('calls toggleExpansion when channel row is clicked', () => {
    const toggleExpansion = jest.fn();
    render(<DataTable {...defaultProps} toggleExpansion={toggleExpansion} />);
    
    const googleAdsRow = screen.getByText('Google Ads');
    fireEvent.click(googleAdsRow);
    
    expect(toggleExpansion).toHaveBeenCalledWith('Google Ads');
  });

  test('shows sort icon for sorted column', () => {
    render(<DataTable {...defaultProps} />);
    
    // Sort icon is shown as text content in the sorted column
    expect(screen.getByText('▼')).toBeInTheDocument();
  });

  test('shows descending sort icon', () => {
    render(<DataTable {...defaultProps} sortDirection="desc" />);
    
    expect(screen.getByText('▼')).toBeInTheDocument();
  });

  test('shows ascending sort icon', () => {
    render(<DataTable {...defaultProps} sortDirection="asc" />);
    
    expect(screen.getByText('▲')).toBeInTheDocument();
  });

  test('does not show regions when channel is not expanded', () => {
    render(<DataTable {...defaultProps} expandedChannel={null} />);
    
    expect(screen.queryByText('North America')).not.toBeInTheDocument();
    expect(screen.queryByText('Europe')).not.toBeInTheDocument();
  });

  test('shows regions when channel is expanded', () => {
    render(<DataTable {...defaultProps} expandedChannel="Google Ads" />);
    
    expect(screen.getByText('— North America')).toBeInTheDocument();
    expect(screen.getByText('— Europe')).toBeInTheDocument();
  });

  test('shows expand icon when channel is collapsed', () => {
    render(<DataTable {...defaultProps} expandedChannel={null} />);
    
    const expandIcons = screen.getAllByText('►');
    expect(expandIcons.length).toBeGreaterThan(0);
  });

  test('shows collapse icon when channel is expanded', () => {
    render(<DataTable {...defaultProps} expandedChannel="Google Ads" />);
    
    // When expanded, the collapse icon (▼) is shown
    const collapseIcons = screen.getAllByText('▼');
    expect(collapseIcons.length).toBeGreaterThan(0);
  });

  test('channel row has correct aria-expanded when collapsed', () => {
    render(<DataTable {...defaultProps} expandedChannel={null} />);
    
    const googleAdsRow = screen.getByRole('button', { name: /google ads/i });
    expect(googleAdsRow).toHaveAttribute('aria-expanded', 'false');
  });

  test('channel row has correct aria-expanded when expanded', () => {
    render(<DataTable {...defaultProps} expandedChannel="Google Ads" />);
    
    const googleAdsRow = screen.getByRole('button', { name: /google ads/i });
    expect(googleAdsRow).toHaveAttribute('aria-expanded', 'true');
  });

  test('handles keyboard navigation with Enter key', () => {
    const toggleExpansion = jest.fn();
    render(<DataTable {...defaultProps} toggleExpansion={toggleExpansion} />);
    
    const googleAdsRow = screen.getByRole('button', { name: /google ads/i });
    fireEvent.keyDown(googleAdsRow, { key: 'Enter' });
    
    expect(toggleExpansion).toHaveBeenCalledWith('Google Ads');
  });

  test('handles keyboard navigation with Space key', () => {
    const toggleExpansion = jest.fn();
    render(<DataTable {...defaultProps} toggleExpansion={toggleExpansion} />);
    
    const googleAdsRow = screen.getByRole('button', { name: /google ads/i });
    fireEvent.keyDown(googleAdsRow, { key: ' ' });
    
    expect(toggleExpansion).toHaveBeenCalledWith('Google Ads');
  });

  test('header has correct aria-sort attribute', () => {
    render(<DataTable {...defaultProps} sortBy="totalSpend" sortDirection="desc" />);
    
    const spendHeader = screen.getByRole('columnheader', { name: /total spend/i });
    expect(spendHeader).toHaveAttribute('aria-sort', 'descending');
  });

  test('unsorted header has aria-sort none', () => {
    render(<DataTable {...defaultProps} sortBy="totalSpend" />);
    
    const clicksHeader = screen.getByRole('columnheader', { name: /clicks/i });
    expect(clicksHeader).toHaveAttribute('aria-sort', 'none');
  });

  test('renders table with proper role', () => {
    render(<DataTable {...defaultProps} />);
    
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  test('channel rows have button role', () => {
    render(<DataTable {...defaultProps} />);
    
    const googleAdsRow = screen.getByRole('button', { name: /google ads/i });
    expect(googleAdsRow).toHaveAttribute('role', 'button');
  });

  test('displays multiple regions for expanded channel', () => {
    render(<DataTable {...defaultProps} expandedChannel="Google Ads" />);
    
    const regionRows = screen.getAllByText(/—/).length;
    expect(regionRows).toBe(2); // North America and Europe
  });

  test('renders empty table when no data', () => {
    render(<DataTable {...defaultProps} sortedData={[]} />);
    
    // Table should exist but have no channel rows (buttons)
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('handles sorting by different columns', () => {
    const handleSort = jest.fn();
    render(<DataTable {...defaultProps} handleSort={handleSort} />);
    
    fireEvent.click(screen.getByText('Clicks'));
    expect(handleSort).toHaveBeenCalledWith('totalClicks');
    
    fireEvent.click(screen.getByText('Conversions'));
    expect(handleSort).toHaveBeenCalledWith('totalConversions');
  });

  test('region rows show correct indentation', () => {
    render(<DataTable {...defaultProps} expandedChannel="Google Ads" />);
    
    expect(screen.getByText('— North America')).toBeInTheDocument();
    expect(screen.getByText('— Europe')).toBeInTheDocument();
  });
});
