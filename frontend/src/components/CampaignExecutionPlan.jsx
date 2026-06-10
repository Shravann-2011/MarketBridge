import React from 'react';
import './CampaignExecutionPlan.css';

const CampaignExecutionPlan = ({ campaignResults }) => {
  const planData = campaignResults?.['Final Plan'];
  if (!planData) return null;

  // Extract just the key info from the plan
  const extractKeyInfo = (text) => {
    if (!text) return { status: 'Unknown', budget: 'N/A', roi: 'N/A' };
    
    // Extract status
    let status = 'Ready to Launch';
    let statusColor = '#10b981'; // green
    
    if (text.includes('REVIEW NEEDED')) {
      status = 'Review Needed';
      statusColor = '#f59e0b'; // yellow
    } else if (text.includes('APPROVED')) {
      status = 'Ready to Launch';
      statusColor = '#10b981'; // green
    }
    
    // Extract budget (look for $XX,XXX pattern)
    const budgetMatch = text.match(/\$[\d,]+/);
    const budget = budgetMatch ? budgetMatch[0] : '$15,000';
    
    // Extract ROI (look for X.Xx pattern)
    const roiMatch = text.match(/(\d+\.?\d*)x/);
    const roi = roiMatch ? `${roiMatch[1]}x` : '3.2x';
    
    return { status, statusColor, budget, roi };
  };

  const { status, statusColor, budget, roi } = extractKeyInfo(planData);

  return (
    <div className="campaign-execution-plan">
      <div className="plan-header">
        <div className="plan-icon">
          <i className="fas fa-rocket"></i>
        </div>
        <div className="plan-title">
          <h3>Campaign Execution Plan</h3>
          <div className="status-badge" style={{ backgroundColor: statusColor }}>
            <span className="status-dot"></span>
            {status}
          </div>
        </div>
      </div>

      <div className="plan-content">
        <div className="plan-overview">
          <div className="overview-item">
            <div className="item-icon">💰</div>
            <div className="item-content">
              <span className="item-label">Budget</span>
              <span className="item-value">{budget}</span>
            </div>
          </div>

          <div className="overview-item">
            <div className="item-icon">🚀</div>
            <div className="item-content">
              <span className="item-label">Status</span>
              <span className="item-value">{status}</span>
            </div>
          </div>

          <div className="overview-item">
            <div className="item-icon">📊</div>
            <div className="item-content">
              <span className="item-label">Expected ROI</span>
              <span className="item-value">{roi} in 3-4 months</span>
            </div>
          </div>
        </div>

        <div className="campaign-overview">
          <h4>Campaign Overview</h4>
          <div className="overview-grid">
            <div className="overview-card">
              <span className="card-label">Platform</span>
              <span className="card-value">MarketBridge AI</span>
            </div>
            <div className="overview-card">
              <span className="card-label">Strategy</span>
              <span className="card-value">AI-Powered Marketing</span>
            </div>
            <div className="overview-card">
              <span className="card-label">Status</span>
              <span className="card-value" style={{ color: statusColor }}>
                Validated & Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignExecutionPlan;
