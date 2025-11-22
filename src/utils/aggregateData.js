/**
 * Aggregates raw marketing data by channel and region
 * @param {Array} data - Raw marketing data records
 * @returns {Array} Aggregated data grouped by channel with regional breakdowns
 */
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

export default aggregateData;
