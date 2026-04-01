# PCQA Non-Compliance Dashboard

Real-time non-compliance tracking dashboard for Process Compliance and Quality Analysis teams.

## Features

- **Real-time metrics** — Track total non-compliances, critical issues, and priority alerts
- **Multi-market tracking** — Monitor non-compliances across 3 market regions
- **Detailed analytics** — Breakdown by type, severity, and market
- **Monthly trends** — View 12-month historical trends
- **Interactive filters** — Filter by month/year for targeted analysis
- **Live dashboard** — Auto-refresh capability with timestamp tracking

## Data Structure

### Markets
- North Region
- Central Region
- South Region

### Non-Compliance Types
- Documentation
- Process
- Compliance
- Quality
- Audit

### Severity Levels
- Critical (requires immediate action)
- High (follow-up needed)
- Medium (monitor)
- Low (resolved/minor)

## Deployment

Hosted on GitHub Pages at `https://markusclaw.github.io/pcqa-dashboard/`

## Usage

1. View **Overview** for high-level metrics and summary
2. Click **By Market** to see regional breakdowns
3. Check **By Type** and **By Severity** for category analysis
4. Review **Trends** for historical patterns (12 months)
5. Use month/year filters to focus on specific periods
6. Click **Refresh** to update the dashboard

## Data Integration

Currently using dummy data for demonstration. To integrate real data:

1. Update `data.js` with actual non-compliance records
2. Keep the same data structure format
3. Dashboard will automatically reflect changes

## Technical

- Pure HTML, CSS, JavaScript
- Chart.js for data visualization
- No backend required (static hosting)
- Responsive design for desktop/tablet/mobile

---

Built with ❤️ for operational excellence.
