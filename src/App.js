import React, { useState, useMemo, useCallback } from 'react';
import RAW_DATA from './constant/marketing_dashboard_data.json';
import TEXT from './constant/text.json';
import CustomStyles from './components/CustomStyles';
import Button from './components/Button';
import Input from './components/Input';
import Modal from './components/Modal';
import Dropdown from './components/Dropdown';
import DataTable from './components/DataTable';
import aggregateData from './utils/aggregateData';
import './App.css';

// ==============================================================================
// MAIN APPLICATION
// ==============================================================================

const App = () => {
  // --- Data State & Memoization ---
  const [aggregationTime, setAggregationTime] = useState(0);
  const [sortBy, setSortBy] = useState('totalSpend');
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandedChannel, setExpandedChannel] = useState(null);

  // CORRECTED: Moved input state declarations here so they are initialized before filteredData useMemo.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState(''); // Holds the search query
  const [inputError, setInputError] = useState('');
  const [dropdownSelection, setDropdownSelection] = useState({ label: TEXT.app.dropdown.selectMetric, value: '' });

  const aggregatedData = useMemo(() => {
    const startTime = performance.now();
    const result = aggregateData(RAW_DATA);
    const endTime = performance.now();
    setAggregationTime(Math.round(endTime - startTime));
    return result;
  }, []);

  // Filtered data based on search input
  const filteredData = useMemo(() => {
    if (!aggregatedData || inputValue.length < 1) {
      return aggregatedData;
    }

    // Case-insensitive filtering on the 'channel' name
    const lowerCaseInput = inputValue.toLowerCase();
    return aggregatedData.filter(channel => 
      channel.channel.toLowerCase().includes(lowerCaseInput)
    );
  }, [aggregatedData, inputValue]); // Recalculate if aggregation changes or input value changes


  const sortedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      // Handle the case where the key might be missing (though unlikely in this structured data)
      if (a[sortBy] < b[sortBy]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortBy, sortDirection]); // Now depends on filteredData

  // --- Handlers ---
  const handleSort = useCallback((key) => {
    setSortBy(prevKey => {
      if (prevKey === key) {
        setSortDirection(prevDir => (prevDir === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortBy(key);
        setSortDirection('desc');
      }
      return key;
    });
  }, []);

  const toggleExpansion = useCallback((channelName) => {
    setExpandedChannel(prev => (prev === channelName ? null : channelName));
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Simple validation: Clear error if input is used for filtering
    if (value.length > 0) {
      setInputError('');
    } else if (value.length === 0) {
      // Optional: keep error clear if field is empty or re-introduce validation
      setInputError(''); 
    }
  };

  const dropdownItems = [
    { label: TEXT.app.dropdown.sortBySpend, value: 'totalSpend' },
    { label: TEXT.app.dropdown.sortByConversions, value: 'totalConversions' },
    { label: TEXT.app.dropdown.resetSort, value: 'channel' }
  ];

  const handleDropdownSelect = (item) => {
      setDropdownSelection(item);
      handleSort(item.value); // Use dropdown selection to update table sort
  }

  return (
    <>
      <CustomStyles />
      <main className="container" role="main" aria-label="Marketing Dashboard">
        <h1 className="app-title">
          {TEXT.app.title}
        </h1>

        <nav className="button-container" aria-label="Dashboard actions">
          <Button onClick={() => setIsModalOpen(true)} variant="primary" aria-label="Open configuration modal">
            {TEXT.app.buttons.openConfigModal}
          </Button>
          <Button onClick={() => handleSort('totalClicks')} variant="secondary" aria-label="Sort table by total clicks">
            {TEXT.app.buttons.quickSortByClicks}
          </Button>
          <Button disabled>
            {TEXT.app.buttons.disabledButton}
          </Button>
          <Dropdown
              label={dropdownSelection.label}
              items={dropdownItems}
              onSelect={handleDropdownSelect}
              aria-label="Sort data by metric"
          />
        </nav>

        {/* Input Demo - Now handles live filtering */}
        <div className="input-container" role="search">
            <Input
                label={TEXT.app.input.filterLabel}
                value={inputValue}
                onChange={handleInputChange}
                errorMessage={inputError}
                placeholder={TEXT.app.input.filterPlaceholder}
            />
        </div>

        {/* Modal Demo */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={TEXT.app.modal.title}
        >
          <p>{TEXT.app.modal.description}</p>
          <Input label={TEXT.app.modal.setting1Label} value={TEXT.app.modal.setting1Value} onChange={() => {}} />
          <p className="modal-info-text">{TEXT.app.modal.modalInfo}</p>
        </Modal>
        
        <p className="status-text" role="status" aria-live="polite" aria-atomic="true">
          {TEXT.app.status.showingChannels
            .replace('{current}', sortedData.length)
            .replace('{total}', aggregatedData.length)
            .replace('{time}', aggregationTime)}
        </p>

        {/* Data Table */}
        <section aria-label="Marketing data table">
        <DataTable
            sortedData={sortedData}
            handleSort={handleSort}
            sortBy={sortBy}
            sortDirection={sortDirection}
            expandedChannel={expandedChannel}
            toggleExpansion={toggleExpansion}
        />

        {sortedData.length === 0 && (
          <div className="text-center no-data-container" role="status" aria-live="polite">{TEXT.app.status.noData}</div>
        )}
        </section>
      </main>
    </>
  );
};

export default App;
