import React, { useState, useEffect } from 'react';
import './LoadingBar.css';

const LoadingBar = ({ query, product }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const agents = [
    { name: 'Creative Agent', icon: '🎨', color: '#7c3aed' },
    { name: 'Finance Agent', icon: '💰', color: '#06b6d4' },
    { name: 'Inventory Agent', icon: '📦', color: '#10b981' },
    { name: 'Lead Agent', icon: '🎯', color: '#f59e0b' }
  ];

  useEffect(() => {
    // Simulate progress through agents
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    // Update current step
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= 3) {
          clearInterval(stepInterval);
          return 3;
        }
        return prev + 1;
      });
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="loading-bar-container">
      <div className="loading-header">
        <h2 className="loading-title">
          🚀 Analyzing "{product}" Campaign
        </h2>
        <p className="loading-subtitle">
          Our AI agents are working together to create your perfect marketing strategy
        </p>
      </div>

      {/* Big Progress Bar */}
      <div className="progress-wrapper">
        <div className="progress-bar-large">
          <div 
            className="progress-fill-large"
            style={{ 
              width: `${progress}%`,
              backgroundColor: agents[currentStep]?.color || '#3b82f6'
            }}
          >
            <div className="progress-shine"></div>
          </div>
        </div>
        <div className="progress-text">
          {progress}% Complete
        </div>
      </div>

      {/* Agent Status */}
      <div className="agents-status">
        {agents.map((agent, index) => (
          <div 
            key={index}
            className={`agent-status ${index <= currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
          >
            <div className="agent-circle" style={{ backgroundColor: agent.color }}>
              {index < currentStep ? '✓' : agent.icon}
            </div>
            <div className="agent-name">{agent.name}</div>
            {index === currentStep && (
              <div className="agent-working">
                <div className="working-spinner"></div>
                Working...
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Current Status */}
      <div className="current-status">
        <div className="status-icon">⚡</div>
        <div className="status-text">
          Running {agents[currentStep]?.name || 'Analysis'}...
        </div>
      </div>
    </div>
  );
};

export default LoadingBar;
