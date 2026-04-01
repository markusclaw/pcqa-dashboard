// Dummy Non-Compliance Data
const nonComplianceData = [
  // Market A - North Region
  { id: 1, market: 'North Region', date: '2025-01-05', type: 'Documentation', severity: 'High', description: 'Missing audit trail documentation' },
  { id: 2, market: 'North Region', date: '2025-01-12', type: 'Process', severity: 'Critical', description: 'Process deviation in QA checkpoint' },
  { id: 3, market: 'North Region', date: '2025-01-18', type: 'Compliance', severity: 'Medium', description: 'Incomplete compliance form submission' },
  { id: 4, market: 'North Region', date: '2025-02-03', type: 'Quality', severity: 'High', description: 'Quality check failed on batch delivery' },
  { id: 5, market: 'North Region', date: '2025-02-14', type: 'Audit', severity: 'Medium', description: 'Audit findings not addressed within timeline' },
  { id: 6, market: 'North Region', date: '2025-03-01', type: 'Documentation', severity: 'Low', description: 'Minor documentation formatting issue' },
  { id: 7, market: 'North Region', date: '2025-03-10', type: 'Process', severity: 'High', description: 'Process deviation in handoff procedures' },
  { id: 8, market: 'North Region', date: '2025-04-05', type: 'Compliance', severity: 'Critical', description: 'Regulatory compliance violation detected' },
  
  // Market B - Central Region
  { id: 9, market: 'Central Region', date: '2025-01-08', type: 'Quality', severity: 'Medium', description: 'Quality standards not met on review' },
  { id: 10, market: 'Central Region', date: '2025-01-20', type: 'Audit', severity: 'Low', description: 'Minor audit finding - documentation clarity' },
  { id: 11, market: 'Central Region', date: '2025-02-07', type: 'Documentation', severity: 'High', description: 'Incomplete project documentation' },
  { id: 12, market: 'Central Region', date: '2025-02-25', type: 'Process', severity: 'Medium', description: 'Process step skipped in QA flow' },
  { id: 13, market: 'Central Region', date: '2025-03-05', type: 'Compliance', severity: 'Medium', description: 'Compliance variance noted' },
  { id: 14, market: 'Central Region', date: '2025-03-18', type: 'Quality', severity: 'Low', description: 'Minor quality variance resolved' },
  { id: 15, market: 'Central Region', date: '2025-04-02', type: 'Documentation', severity: 'Medium', description: 'Missing required metadata' },
  
  // Market C - South Region
  { id: 16, market: 'South Region', date: '2025-01-10', type: 'Process', severity: 'High', description: 'Critical process deviation observed' },
  { id: 17, market: 'South Region', date: '2025-01-22', type: 'Compliance', severity: 'Critical', description: 'Compliance violation - regulatory impact' },
  { id: 18, market: 'South Region', date: '2025-02-02', type: 'Quality', severity: 'High', description: 'Quality benchmark not achieved' },
  { id: 19, market: 'South Region', date: '2025-02-16', type: 'Audit', severity: 'Medium', description: 'Audit findings logged' },
  { id: 20, market: 'South Region', date: '2025-03-08', type: 'Documentation', severity: 'Low', description: 'Documentation revision needed' },
  { id: 21, market: 'South Region', date: '2025-03-22', type: 'Process', severity: 'Medium', description: 'Process improvement opportunity identified' },
  { id: 22, market: 'South Region', date: '2025-04-03', type: 'Quality', severity: 'Critical', description: 'Critical quality issue in production batch' },
  { id: 23, market: 'South Region', date: '2025-04-12', type: 'Compliance', severity: 'High', description: 'Compliance remediation in progress' },
];

// Helper to extract month from date
function getMonth(dateString) {
  return dateString.substring(0, 7); // YYYY-MM
}

// Helper to get counts by various filters
function countByMarket(data) {
  const counts = {};
  data.forEach(item => {
    counts[item.market] = (counts[item.market] || 0) + 1;
  });
  return counts;
}

function countByType(data) {
  const counts = {};
  data.forEach(item => {
    counts[item.type] = (counts[item.type] || 0) + 1;
  });
  return counts;
}

function countBySeverity(data) {
  const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  data.forEach(item => {
    counts[item.severity] = (counts[item.severity] || 0) + 1;
  });
  return counts;
}

function countByMonth(data) {
  const counts = {};
  data.forEach(item => {
    const month = getMonth(item.date);
    counts[month] = (counts[month] || 0) + 1;
  });
  return counts;
}

// Export for use in dashboard
window.nonComplianceData = nonComplianceData;
window.getMonth = getMonth;
window.countByMarket = countByMarket;
window.countByType = countByType;
window.countBySeverity = countBySeverity;
window.countByMonth = countByMonth;
