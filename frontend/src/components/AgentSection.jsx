import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AgentCard from './AgentCard';
import SkeletonLoader from './SkeletonLoader';
import ProgressBar from './ProgressBar';
import './AgentSection.css';
import CampaignExecutionPlan from './CampaignExecutionPlan';
import LoadingBar from './LoadingBar';

const AgentSection = () => {
  const location = useLocation();
  const [campaignResults, setCampaignResults] = useState(null);
  const [campaignQuery, setCampaignQuery] = useState('');
  const [campaignProduct, setCampaignProduct] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentProgress, setCurrentProgress] = useState({ step: 0, agent: '', status: '' });

  useEffect(() => {
    console.log('🔍 AgentSection received location.state:', location.state);
    
    if (location.state?.isLoading) {
      // Show loading state
      setIsLoading(true);
      setCampaignQuery(location.state.query || '');
      setCampaignProduct(location.state.product || '');
      setCurrentProgress(location.state.progress || { step: 1, agent: 'Creative Agent', status: 'Starting analysis...' });
    } else if (location.state?.results) {
      // Show results
      console.log('📊 Campaign results structure:', location.state.results);
      console.log('📊 Campaign results keys:', Object.keys(location.state.results));
      setCampaignResults(location.state.results);
      setCampaignQuery(location.state.query || '');
      setCampaignProduct(location.state.product || '');
      setIsLoading(false);
    } else {
      console.log('⚠️ No results found in location.state');
      setIsLoading(false);
    }
  }, [location.state]);

  const agents = [
    {
      id: 'creative',
      name: 'Creative Agent',
      role: 'Campaign Strategy',
      description: 'Develops focused campaign themes with targeted messaging and channel selection.',
      capabilities: [
        'Campaign theme development',
        'Target audience analysis', 
        'Channel optimization',
        'Conversion forecasting'
      ],
      icon: '🎨',
      color: '#7c3aed',
      stats: {
        'Campaigns': '150+',
        'Success Rate': '94%',
        'Avg. ROI': '340%'
      },
      result: campaignResults?.Creative
    },
    {
      id: 'finance',
      name: 'Finance Agent', 
      role: 'Budget Analysis',
      description: 'Validates budgets and provides ROI projections for campaign feasibility.',
      capabilities: [
        'Budget validation',
        'ROI analysis',
        'Risk assessment', 
        'Cost optimization'
      ],
      icon: '💰',
      color: '#06b6d4',
      stats: {
        'Budget Managed': '$2.5M+',
        'Cost Savings': '23%',
        'Accuracy': '99.8%'
      },
      result: campaignResults?.Finance
    },
    {
      id: 'inventory',
      name: 'Inventory Agent',
      role: 'Stock Management', 
      description: 'Ensures adequate product availability and supply chain readiness.',
      capabilities: [
        'Stock verification',
        'Demand forecasting',
        'Supply chain analysis',
        'Risk mitigation'
      ],
      icon: '📦',
      color: '#10b981',
      stats: {
        'Products': '10K+',
        'Regions': '25',
        'Accuracy': '98.5%'
      },
      result: campaignResults?.Inventory
    },
    {
      id: 'lead',
      name: 'Lead Agent',
      role: 'Campaign Coordination',
      description: 'Master coordinator that resolves conflicts and creates unified campaign plans.',
      capabilities: [
        'Agent coordination',
        'Conflict resolution', 
        'Final plan creation',
        'Go/no-go decisions'
      ],
      icon: '🎯',
      color: '#f59e0b',
      stats: {
        'Coordination': '500+',
        'Accuracy': '97%',
        'Success Rate': '96%'
      },
      result: campaignResults?.Lead
    }
  ];

  return (
    <div className="agent-section">
      <div className="container">
        <div className="agent-section-header">
          <h2 className="agent-section-title">
            {campaignResults ? 
              `Campaign analysis completed for "${campaignQuery}" targeting "${campaignProduct}"` : 
              isLoading ?
              `Analyzing "${campaignQuery}" for ${campaignProduct}` :
              'Four specialized agents working together to create, validate, and execute your marketing campaigns with precision.'
            }
          </h2>
          <p className="agent-section-subtitle">
            {campaignResults ? 
              'See what each agent contributed to your campaign' : 
              isLoading ?
              'Our AI agents are analyzing your campaign requirements' :
              'Each agent brings unique expertise, with the Lead Agent coordinating everything'
            }
          </p>
        </div>

        {/* Show Progress Bar when loading */}
        {isLoading && (
  <LoadingBar query={campaignQuery} product={campaignProduct} />
)}

        <div className="agents-grid">
          {agents.map((agent, index) => (
            isLoading ? (
              <SkeletonLoader key={agent.id} agent={agent} index={index} />
            ) : (
              <AgentCard key={agent.id} agent={agent} index={index} />
            )
          ))}
        </div>

        <div className="agent-stats">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Campaigns Created</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">$5M+</div>
            <div className="stat-label">Budget Managed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Products Tracked</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">97%</div>
            <div className="stat-label">Coordination Rate</div>
          </div>
        </div>

        {campaignResults && !isLoading && (
          <CampaignExecutionPlan campaignData={campaignResults} />
        )}
      </div>
    </div>
  );
};

export default AgentSection;
