import { useState, useMemo } from 'react';
import RAW_DATA from './constant/marketing_dashboard_data.json';


/**
 * Aggregates the marketing data by 'channel' and nests the regional data inside.
 * @param {Array<Object>} data - The raw marketing data array.
 * @returns {Array<Object>} - The aggregated data array with nested regions.
 */
const aggregateData = (data) => {
  const aggregatedMap = data.reduce((acc, record) => {
    const { channel, region, spend, impressions, conversions, clicks } = record;

    // 1. Initialize Channel Aggregate (Level 1)
    if (!acc[channel]) {
      acc[channel] = {
        channel,
        totalSpend: 0,
        totalImpressions: 0,
        totalConversions: 0,
        totalClicks: 0,
        regions: {}, // Storage for Level 2 (Region-wise data)
      };
    }

    // 2. Sum the Channel Totals
    acc[channel].totalSpend += spend;
    acc[channel].totalImpressions += impressions;
    acc[channel].totalConversions += conversions;
    acc[channel].totalClicks += clicks;

    // 3. Initialize Region Aggregate (Level 2)
    if (!acc[channel].regions[region]) {
      acc[channel].regions[region] = {
        region,
        spend: 0,
        impressions: 0,
        conversions: 0,
        clicks: 0,
      };
    }

    // 4. Sum the Regional Totals
    acc[channel].regions[region].spend += spend;
    acc[channel].regions[region].impressions += impressions;
    acc[channel].regions[region].conversions += conversions;
    acc[channel].regions[region].clicks += clicks;

    return acc;
  }, {});

  // Convert the map values back to an array, and convert regions map to array
  return Object.values(aggregatedMap).map(channelData => ({
    ...channelData,
    // Sort regions alphabetically for consistent display
    regions: Object.values(channelData.regions).sort((a, b) => a.region.localeCompare(b.region))
  }));
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const formatNumber = (value) =>
  new Intl.NumberFormat('en-US').format(value);


// Main React Component
const App = () => {
  const [aggregationTime, setAggregationTime] = useState(0);
  const [sortBy, setSortBy] = useState('totalSpend');
  const [sortDirection, setSortDirection] = useState('desc');
  // New State: Tracks the currently expanded channel (by channel name)
  const [expandedChannel, setExpandedChannel] = useState(null);

  // UseMemo ensures the aggregation calculation is only done once on mount
  const aggregatedData = useMemo(() => {
    const startTime = performance.now();
    const result = aggregateData(RAW_DATA);
    const endTime = performance.now();
    setAggregationTime(Math.round(endTime - startTime));
    return result;
  }, []);

  // Logic to sort the aggregated data
  const sortedData = useMemo(() => {
    const sorted = [...aggregatedData].sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [aggregatedData, sortBy, sortDirection]);

  // Function to handle header click for sorting
  const handleSort = (key) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDirection('desc'); // Default to descending for new columns
    }
  };

  // Toggle expansion logic
  const toggleExpansion = (channelName) => {
    setExpandedChannel(prev => (prev === channelName ? null : channelName));
  };


  // Helper component for sort icon
  const SortIcon = ({ columnKey }) => {
    if (sortBy !== columnKey) return null;
    return (
      <span className="ml-1 text-xs">
        {sortDirection === 'asc' ? '▲' : '▼'}
      </span>
    );
  };
  
  const headers = [
    { key: 'channel', label: 'Channel', type: 'string' },
    { key: 'totalSpend', label: 'Total Spend', type: 'currency' },
    { key: 'totalImpressions', label: 'Impressions', type: 'number' },
    { key: 'totalConversions', label: 'Conversions', type: 'number' },
    { key: 'totalClicks', label: 'Clicks', type: 'number' },
  ];

  // The rendering function for the table body, which handles expansion
  const renderTableRows = () => {
    // flatMap creates a flat array of <tr> elements from the nested channel/region structure
    return sortedData.flatMap((channelData) => {
      // 1. Channel Row (The Header/Baseline Row)
      const isExpanded = expandedChannel === channelData.channel;
      const channelRow = (
        <tr
          key={channelData.channel}
          onClick={() => toggleExpansion(channelData.channel)}
          className={`cursor-pointer transition duration-150 border-b ${isExpanded ? 'bg-blue-100/70 hover:bg-blue-200' : 'bg-white hover:bg-gray-100'}`}
        >
          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-800">
            <span className="mr-2 text-lg">{isExpanded ? '▼' : '►'}</span>
            {channelData.channel}
          </td>
          {/* Channel Totals */}
          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
            {formatCurrency(channelData.totalSpend)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 text-right">
            {formatNumber(channelData.totalImpressions)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 text-right">
            {formatNumber(channelData.totalConversions)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 text-right">
            {formatNumber(channelData.totalClicks)}
          </td>
        </tr>
      );

      let rows = [channelRow];

      // 2. Conditionally render the Region Detail Rows
      if (isExpanded) {
        channelData.regions.forEach((regionData) => {
          // Use a combined key for the region row
          const regionKey = `${channelData.channel}-${regionData.region}`;
          
          const regionRow = (
            <tr key={regionKey} className={`bg-gray-50/70 hover:bg-gray-100 transition duration-100`}>
              {/* Indentation for region name */}
              <td className="px-6 py-2 whitespace-nowrap text-xs text-gray-600 pl-12">
                — {regionData.region}
              </td>
              {/* Region Metrics (using spend/impressions/etc. keys) */}
              <td className="px-6 py-2 whitespace-nowrap text-xs text-gray-800 text-right">
                {formatCurrency(regionData.spend)}
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-xs text-gray-600 text-right">
                {formatNumber(regionData.impressions)}
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-xs text-gray-600 text-right">
                {formatNumber(regionData.conversions)}
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-xs text-gray-600 text-right">
                {formatNumber(regionData.clicks)}
              </td>
            </tr>
          );
          rows.push(regionRow);
        });
      }

      return rows;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Marketing Channel Summary
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Aggregated data for {RAW_DATA.length} records, grouped by Channel, with Region drill-down.
          <span className="font-semibold text-blue-600"> Click a Channel name to expand </span>
          its regional performance. 
          (Data aggregation took <span className="font-mono text-xs bg-yellow-100 px-1 py-0.5 rounded">{aggregationTime} ms</span>).
        </p>
        
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600">
                <tr>
                  {headers.map((header) => (
                    <th
                      key={header.key}
                      onClick={() => handleSort(header.key)}
                      // Adjust text alignment for sorting based on column type
                      className={`px-6 py-3 text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-blue-700 transition duration-150 ${header.key === 'channel' ? 'text-left' : 'text-right'}`}
                    >
                      <div className={`flex items-center ${header.key !== 'channel' ? 'justify-end' : 'justify-start'}`}>
                        {header.label}
                        <SortIcon columnKey={header.key} />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Render the expandable rows */}
                {renderTableRows()}
              </tbody>
            </table>
          </div>

          {aggregatedData.length === 0 && (
            <div className="p-6 text-center text-gray-500">No data available to display.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;