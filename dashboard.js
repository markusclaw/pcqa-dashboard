// Global chart instances
let marketChart, typeChart, severityChart, trendsChart;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
  setupNavigation();
  updateDashboard();
  updateLastUpdated();
});

// Navigation setup
function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const section = this.dataset.section;
      showSection(section);
      document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

// Show specific section
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
    // Trigger chart redraw if needed
    setTimeout(() => {
      if (sectionId === 'by-market' && marketChart) marketChart.resize();
      if (sectionId === 'by-type' && typeChart) typeChart.resize();
      if (sectionId === 'by-severity' && severityChart) severityChart.resize();
      if (sectionId === 'trends' && trendsChart) trendsChart.resize();
    }, 100);
  }
}

// Filter data
function getFilteredData() {
  const monthFilter = document.getElementById('monthFilter').value;
  const yearFilter = document.getElementById('yearFilter').value;
  
  if (!monthFilter) return nonComplianceData;
  
  const targetMonth = `${yearFilter}-${monthFilter}`;
  return nonComplianceData.filter(item => getMonth(item.date).startsWith(targetMonth));
}

// Update all dashboard elements
function updateDashboard() {
  const filteredData = getFilteredData();
  
  // Update metrics
  updateMetrics(filteredData);
  
  // Update market summary
  updateMarketSummary(filteredData);
  
  // Update market cards
  updateMarketCards(filteredData);
  
  // Update type breakdown
  updateTypeBreakdown(filteredData);
  
  // Update severity breakdown
  updateSeverityBreakdown(filteredData);
  
  // Create/update charts
  createMarketChart(filteredData);
  createTypeChart(filteredData);
  createSeverityChart(filteredData);
  createTrendsChart();
}

// Update metrics
function updateMetrics(data) {
  const total = data.length;
  const severity = countBySeverity(data);
  
  document.getElementById('totalCount').textContent = total;
  document.getElementById('criticalCount').textContent = severity.Critical;
  document.getElementById('highCount').textContent = severity.High;
  
  // Calculate change
  const previousMonth = getPreviousMonthData();
  const change = total - previousMonth.length;
  const changeText = change > 0 ? `+${change}` : `${change}`;
  document.getElementById('totalChange').textContent = `${changeText} this month`;
}

// Get previous month's data
function getPreviousMonthData() {
  const monthFilter = document.getElementById('monthFilter').value;
  const yearFilter = document.getElementById('yearFilter').value;
  
  if (!monthFilter) return [];
  
  let month = parseInt(monthFilter);
  let year = parseInt(yearFilter);
  month--;
  if (month === 0) {
    month = 12;
    year--;
  }
  
  const targetMonth = `${year}-${String(month).padStart(2, '0')}`;
  return nonComplianceData.filter(item => getMonth(item.date).startsWith(targetMonth));
}

// Update market summary
function updateMarketSummary(data) {
  const counts = countByMarket(data);
  const html = Object.entries(counts).map(([market, count]) => `
    <div class="summary-item">
      <div class="summary-label">${market}</div>
      <div class="summary-count">${count}</div>
    </div>
  `).join('');
  document.getElementById('marketSummary').innerHTML = html;
}

// Update market cards
function updateMarketCards(data) {
  const counts = countByMarket(data);
  const markets = ['North Region', 'Central Region', 'South Region'];
  
  const html = markets.map(market => {
    const count = counts[market] || 0;
    const severity = data
      .filter(item => item.market === market)
      .reduce((acc, item) => {
        acc[item.severity] = (acc[item.severity] || 0) + 1;
        return acc;
      }, {});
    
    return `
      <div class="market-card">
        <h4>${market}</h4>
        <div class="market-stat">Total: <strong>${count}</strong></div>
        <div class="market-severity">
          ${severity.Critical ? `<span class="badge critical">${severity.Critical} Critical</span>` : ''}
          ${severity.High ? `<span class="badge high">${severity.High} High</span>` : ''}
          ${severity.Medium ? `<span class="badge medium">${severity.Medium} Medium</span>` : ''}
          ${severity.Low ? `<span class="badge low">${severity.Low} Low</span>` : ''}
        </div>
      </div>
    `;
  }).join('');
  
  document.getElementById('marketCards').innerHTML = html;
}

// Update type breakdown
function updateTypeBreakdown(data) {
  const counts = countByType(data);
  const total = data.length || 1;
  
  const html = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => {
      const percentage = ((count / total) * 100).toFixed(1);
      return `
        <div class="breakdown-item">
          <div class="breakdown-label">${type}</div>
          <div class="breakdown-bar">
            <div class="breakdown-fill" style="width: ${percentage}%"></div>
          </div>
          <div class="breakdown-value">${count} (${percentage}%)</div>
        </div>
      `;
    }).join('');
  
  document.getElementById('typeBreakdown').innerHTML = html;
}

// Update severity breakdown
function updateSeverityBreakdown(data) {
  const counts = countBySeverity(data);
  const total = data.length || 1;
  
  const severityOrder = ['Critical', 'High', 'Medium', 'Low'];
  const html = severityOrder
    .filter(sev => counts[sev] > 0)
    .map(severity => {
      const count = counts[severity];
      const percentage = ((count / total) * 100).toFixed(1);
      const badgeClass = severity.toLowerCase();
      
      return `
        <div class="breakdown-item">
          <div class="breakdown-label"><span class="badge ${badgeClass}">${severity}</span></div>
          <div class="breakdown-bar">
            <div class="breakdown-fill" style="width: ${percentage}%"></div>
          </div>
          <div class="breakdown-value">${count} (${percentage}%)</div>
        </div>
      `;
    }).join('');
  
  document.getElementById('severityBreakdown').innerHTML = html;
}

// Create market chart
function createMarketChart(data) {
  const counts = countByMarket(data);
  const ctx = document.getElementById('marketChart').getContext('2d');
  
  if (marketChart) marketChart.destroy();
  
  marketChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(counts),
      datasets: [{
        label: 'Non-Compliances',
        data: Object.values(counts),
        backgroundColor: ['#0057ff', '#ff6b6b', '#ffa500'],
        borderColor: ['#003fa3', '#cc5555', '#ff8c00'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 }
        }
      }
    }
  });
}

// Create type chart
function createTypeChart(data) {
  const counts = countByType(data);
  const ctx = document.getElementById('typeChart').getContext('2d');
  
  const colors = {
    'Documentation': '#0057ff',
    'Process': '#ff6b6b',
    'Compliance': '#ffa500',
    'Quality': '#4caf50',
    'Audit': '#9c27b0'
  };
  
  if (typeChart) typeChart.destroy();
  
  typeChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts),
        backgroundColor: Object.keys(counts).map(type => colors[type] || '#ccc')
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

// Create severity chart
function createSeverityChart(data) {
  const counts = countBySeverity(data);
  const ctx = document.getElementById('severityChart').getContext('2d');
  
  const colors = {
    'Critical': '#d32f2f',
    'High': '#f57c00',
    'Medium': '#ffa000',
    'Low': '#388e3c'
  };
  
  if (severityChart) severityChart.destroy();
  
  severityChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Critical', 'High', 'Medium', 'Low'],
      datasets: [{
        data: [counts.Critical, counts.High, counts.Medium, counts.Low],
        backgroundColor: [colors.Critical, colors.High, colors.Medium, colors.Low]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

// Create trends chart (last 12 months)
function createTrendsChart() {
  const monthCounts = countByMonth(nonComplianceData);
  
  // Generate last 12 months
  const today = new Date();
  const months = [];
  const data = [];
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const month = date.toISOString().substring(0, 7);
    months.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
    data.push(monthCounts[month] || 0);
  }
  
  const ctx = document.getElementById('trendsChart').getContext('2d');
  
  if (trendsChart) trendsChart.destroy();
  
  trendsChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'Non-Compliances',
        data: data,
        borderColor: '#0057ff',
        backgroundColor: 'rgba(0, 87, 255, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#0057ff',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 }
        }
      }
    }
  });
}

// Filter by month/year
function filterByMonth() {
  updateDashboard();
}

// Refresh data
function refreshData() {
  updateLastUpdated();
  updateDashboard();
}

// Update last updated timestamp
function updateLastUpdated() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  document.getElementById('lastUpdated').textContent = `${hours}:${minutes}`;
}

// Auto-refresh every 5 minutes
setInterval(updateLastUpdated, 300000);
