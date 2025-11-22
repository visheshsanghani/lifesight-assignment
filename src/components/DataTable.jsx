import { useCallback } from 'react';
import TEXT from '../constant/text.json';
import './DataTable.css';

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
  { key: 'channel', label: TEXT.dataTable.headers.channel, type: 'string' },
  { key: 'totalSpend', label: TEXT.dataTable.headers.totalSpend, type: 'currency' },
  { key: 'totalImpressions', label: TEXT.dataTable.headers.impressions, type: 'number' },
  { key: 'totalConversions', label: TEXT.dataTable.headers.conversions, type: 'number' },
  { key: 'totalClicks', label: TEXT.dataTable.headers.clicks, type: 'number' },
];

/**
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
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleExpansion(channelData.channel);
                        }
                    }}
                    className={`row-channel ${isExpanded ? 'row-channel-expanded' : ''}`}
                    aria-expanded={isExpanded}
                    aria-controls={`details-${channelData.channel.replace(/\s/g, '-')}`}
                    aria-label={`${channelData.channel}, click to ${isExpanded ? 'collapse' : 'expand'} regional details`}
                    tabIndex={0}
                    role="button"
                >
                    <td className="text-left channel-cell">
                        <span className="expansion-icon">{isExpanded ? '▼' : '►'}</span>
                        {channelData.channel}
                    </td>
                    {/* Channel Totals */}
                    <td className="text-right channel-cell">
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
                channelData.regions.forEach((regionData, index) => {
                    const regionKey = `${channelData.channel}-${regionData.region}`;
                    const detailsId = index === 0 ? `details-${channelData.channel.replace(/\s/g, '-')}` : undefined;

                    const regionRow = (
                        <tr key={regionKey} className={`row-region`} role="row" id={detailsId}>
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
            <table className="data-table" role="table" aria-label={TEXT.dataTable.ariaLabel}>
                <thead>
                    <tr>
                        {headers.map((header) => (
                            <th
                                key={header.key}
                                onClick={() => handleSort(header.key)}
                                className={header.key === 'channel' ? 'text-left' : 'text-right'}
                                aria-sort={sortBy === header.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                                role="columnheader"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleSort(header.key);
                                    }
                                }}
                                aria-label={`${header.label}, click to sort`}
                            >
                                <div className={`header-content ${header.key === 'channel' ? 'align-start' : 'align-end'}`}>
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

export default DataTable;
