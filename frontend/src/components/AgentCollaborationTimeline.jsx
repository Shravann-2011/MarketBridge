import React from 'react';
import './AgentCollaborationTimeline.css';

const AgentCollaborationTimeline = ({ campaignResults, isProcessing = false }) => {
  const timelineSteps = [
    {
      id: 'creative',
      name: 'Creative Agent',
      icon: '🎨',
      color: '#7c3aed',
      description: 'Analyzing campaign strategy and creative approach...',
      result: campaignResults?.Creative,
      status: campaignResults?.Creative ? 'completed' : (isProcessing ? 'processing' : 'pending')
    },
    {
      id: 'finance',
      name: 'Finance Agent',
      icon: '💰',
      color: '#06b6d4',
      description: 'Validating budget and financial feasibility...',
      result: campaignResults?.Finance,
      status: campaignResults?.Finance ? 'completed' : (isProcessing ? 'processing' : 'pending')
    },
    {
      id: 'inventory',
      name: 'Inventory Agent',
      icon: '📦',
      color: '#10b981',
      description: 'Checking product availability and stock levels...',
      result: campaignResults?.Inventory,
      status: campaignResults?.Inventory ? 'completed' : (isProcessing ? 'processing' : 'pending')
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'processing': return '⏳';
      default: return '⏸️';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'COMPLETED';
      case 'processing': return 'PROCESSING...';
      default: return 'WAITING';
    }
  };

  const formatResult = (result) => {
    if (!result) return null;
    
    // Split into sections based on emojis and headers
    const sections = result.split(/(?=🎨|💰|📦|✅|⚠️|❌)/);
    
    return sections.map((section, index) => {
      if (!section.trim()) return null;
      
      const lines = section.trim().split('\n').filter(line => line.trim());
      const firstLine = lines[0];
      const content = lines.slice(1).join('\n');
      
      // Check if it's a header section
      if (firstLine.includes('BREAKDOWN') || firstLine.includes('ANALYSIS') || firstLine.includes('METRICS')) {
        return (
          <div key={index} className="result-section">
            <div className="result-header">{firstLine}</div>
            <div className="result-content">{content}</div>
          </div>
        );
      }
      
      return (
        <div key={index} className="result-text">
          {section.trim()}
        </div>
      );
    });
  };

  return (
    <div className="agent-collaboration-timeline">
      <div className="timeline-header">
        <h2 className="timeline-title">Agent Collaboration Timeline</h2>
      </div>
      
      <div className="timeline-container">
        {timelineSteps.map((step, index) => (
          <div key={step.id} className="timeline-step">
            {/* Connection Line */}
            {index < timelineSteps.length - 1 && (
              <div className="timeline-connector" style={{'--step-color': step.color}}></div>
            )}
            
            {/* Step Content */}
            <div className="step-content" style={{'--step-color': step.color}}>
              {/* Step Header */}
              <div className="step-header">
                <div className="step-icon-wrapper">
                  <span className="step-icon">{step.icon}</span>
                </div>
                <div className="step-info">
                  <h3 className="step-name">{step.name}</h3>
                  <div className="step-status">
                    <span className="status-icon">{getStatusIcon(step.status)}</span>
                    <span className="status-text">{getStatusText(step.status)}</span>
                  </div>
                </div>
              </div>
              
              {/* Step Description */}
              <div className="step-description">
                {step.description}
              </div>
              
              {/* Step Result */}
              {step.result && (
                <div className="step-result">
                  <div className="result-label">Result:</div>
                  <div className="result-details">
                    {formatResult(step.result)}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentCollaborationTimeline;
