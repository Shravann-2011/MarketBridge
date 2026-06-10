import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ agent, index }) => {
  return (
    <div 
      className={`skeleton-card ${agent.id}`}
      style={{ 
        '--agent-color': agent.color,
        animationDelay: `${index * 0.2}s`
      }}
    >
      <div className="skeleton-header">
        <div className="skeleton-icon" style={{ backgroundColor: agent.color }}>
          {agent.icon}
        </div>
        <div className="skeleton-info">
          <div className="skeleton-name">{agent.name}</div>
          <div className="skeleton-role">{agent.role}</div>
          <div className="skeleton-description">
            <div className="skeleton-line skeleton-line-1"></div>
            <div className="skeleton-line skeleton-line-2"></div>
          </div>
        </div>
        <div className="skeleton-spinner">
          <div className="spinner"></div>
        </div>
      </div>
      
      <div className="skeleton-content">
        <div className="skeleton-section">
          <div className="skeleton-line skeleton-line-title"></div>
          <div className="skeleton-line skeleton-line-content"></div>
          <div className="skeleton-line skeleton-line-content short"></div>
        </div>
        <div className="skeleton-section">
          <div className="skeleton-line skeleton-line-title"></div>
          <div className="skeleton-line skeleton-line-content"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
