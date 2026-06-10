import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ currentAgent, totalAgents, currentStep, agentName }) => {
  const progress = ((currentStep - 1) / totalAgents) * 100;
  
  const agents = [
    { name: 'Creative Agent', icon: '🎨', color: '#7c3aed' },
    { name: 'Finance Agent', icon: '💰', color: '#06b6d4' },
    { name: 'Inventory Agent', icon: '📦', color: '#10b981' },
    { name: 'Lead Agent', icon: '🎯', color: '#f59e0b' }
  ];

  return (
    <div className="progress-container">
      <div className="progress-header">
        <div className="progress-title">
          <span className="progress-icon">⚡</span>
          AI Agents Analyzing Your Campaign
        </div>
        <div className="progress-counter">
          {currentStep}/{totalAgents}
        </div>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ 
            width: `${progress}%`,
            backgroundColor: agents[currentStep - 1]?.color || '#3b82f6'
          }}
        />
      </div>
      
      <div className="progress-steps">
        {agents.map((agent, index) => (
          <div 
            key={index}
            className={`progress-step ${index < currentStep ? 'completed' : index === currentStep - 1 ? 'active' : ''}`}
          >
            <div 
              className="step-circle"
              style={{ backgroundColor: index < currentStep ? agent.color : '#374151' }}
            >
              {index < currentStep ? '✓' : agent.icon}
            </div>
            <span className="step-name">{agent.name}</span>
          </div>
        ))}
      </div>
      
      {agentName && (
        <div className="current-status">
          <div className="status-spinner"></div>
          <span>Running {agentName}...</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
