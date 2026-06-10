import React, { useState } from 'react';
import './AgentCard.css';

const AgentCard = ({ agent, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatResultForDisplay = (result) => {
    if (!result) return null;

    // Handle structured output with sections
    if (result.includes('**') && (result.includes('📊') || result.includes('🎨') || result.includes('💰') || result.includes('📦') || result.includes('🎯'))) {
      return formatStructuredOutput(result);
    }

    // Original formatting for simple text
    const sections = result.split('\n\n');
    return sections.map((section, index) => {
      const lines = section.split('\n');
      const header = lines[0];
      const content = lines.slice(1);

      const isHeader = header.match(/[🎨💰📦🎯✅⚠️❌]/) || 
                      header.includes('BREAKDOWN') || 
                      header.includes('ANALYSIS') || 
                      header.includes('METRICS') ||
                      header.includes('STRATEGY') ||
                      header.includes('COORDINATION');

      if (isHeader) {
        return (
          <div key={index} className="result-section">
            <div className="result-header">{header}</div>
            <div className="result-content">
              {content.map((line, lineIndex) => (
                <div key={lineIndex} className="result-line">{line}</div>
              ))}
            </div>
          </div>
        );
      }

      return (
        <div key={index} className="result-section">
          {lines.map((line, lineIndex) => (
            <div key={lineIndex} className="result-line">{line}</div>
          ))}
        </div>
      );
    });
  };

  const formatStructuredOutput = (result) => {
    // Remove markdown formatting for better display
    const cleanResult = result
      .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold markdown
      .replace(/`(.*?)`/g, '$1')       // Remove code markdown
      .replace(/<!--.*?-->/g, '');     // Remove HTML comments

    const sections = cleanResult.split('\n\n');
    
    return sections.map((section, index) => {
      const lines = section.split('\n').filter(line => line.trim());
      if (lines.length === 0) return null;

      const header = lines[0];
      const content = lines.slice(1);

      // Check if this is a header section
      const isHeader = header.includes('🎨') || header.includes('💰') || 
                      header.includes('📦') || header.includes('🎯') ||
                      header.includes('STRATEGY') || header.includes('ANALYSIS') ||
                      header.includes('STATUS') || header.includes('COORDINATION');

      if (isHeader) {
        return (
          <div key={index} className="structured-section">
            <div className="structured-header">{header}</div>
            <div className="structured-content">
              {content.map((line, lineIndex) => {
                if (line.startsWith('•') || line.startsWith('-')) {
                  return (
                    <div key={lineIndex} className="bullet-point">
                      {line.replace(/^[•-]\s*/, '')}
                    </div>
                  );
                }
                return (
                  <div key={lineIndex} className="content-line">
                    {line}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      return (
        <div key={index} className="content-section">
          {lines.map((line, lineIndex) => (
            <div key={lineIndex} className="content-line">{line}</div>
          ))}
        </div>
      );
    }).filter(Boolean);
  };

  // Check if agent has results to display
  const hasResults = agent.result && agent.result.trim().length > 0;

  return (
    <div 
      className={`agent-card ${isExpanded ? 'expanded' : ''} ${hasResults ? 'has-results' : ''}`}
      onClick={() => hasResults && setIsExpanded(!isExpanded)}
      style={{ 
        '--agent-color': agent.color,
        animationDelay: `${index * 0.15}s`
      }}
    >
      <div className="agent-card-header">
        <div className="agent-icon" style={{ backgroundColor: agent.color }}>
          {agent.icon}
        </div>
        <div className="agent-info">
          <h3 className="agent-name">{agent.name}</h3>
          <p className="agent-role">{agent.role}</p>
          <p className="agent-description">{agent.description}</p>
        </div>
        {hasResults && (
          <div className="result-indicator">
            <span className={`status-dot ${isExpanded ? 'active' : ''}`}></span>
          </div>
        )}
      </div>

      {hasResults && isExpanded && (
        <div className="agent-card-content">
          <div className="agent-result">
            <div className="result-display">
              {formatResultForDisplay(agent.result)}
            </div>
          </div>
        </div>
      )}

      {!hasResults && (
        <div className="agent-card-footer">
          <div className="agent-capabilities">
            <h4>Capabilities:</h4>
            <ul>
              {agent.capabilities?.map((capability, index) => (
                <li key={index}>{capability}</li>
              ))}
            </ul>
          </div>
          
          <div className="agent-stats">
            {agent.stats && Object.entries(agent.stats).map(([key, value]) => (
              <div key={key} className="stat">
                <span className="stat-label">{key}:</span>
                <span className="stat-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentCard;
