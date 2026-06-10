import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import './SentimentAnalysis.css';

const SentimentAnalysis = () => {
  const [formData, setFormData] = useState({
    product: '',
    campaign_text: '',
    keywords: []
  });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleKeywordsChange = (e) => {
    const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k);
    setFormData(prev => ({
      ...prev,
      keywords
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.product || !formData.campaign_text) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/sentiment_analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setAnalysis(data.data);
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '#10B981';
      case 'negative': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getTrendColor = (change) => {
    if (change > 5) return '#10B981';
    if (change < -5) return '#EF4444';
    return '#6B7280';
  };

  // Generate mock trend data for chart
  const generateTrendChartData = (keywords) => {
    if (!keywords || keywords.length === 0) return [];
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => {
      const data = { day };
      keywords.forEach(keyword => {
        data[keyword.keyword] = Math.floor(Math.random() * 100) + 20;
      });
      return data;
    });
  };

  const generateEmotionChartData = (emotions) => {
    if (!emotions) return [];
    
    return Object.entries(emotions).map(([emotion, score]) => ({
      emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      score: Math.round(score * 100),
      fill: `hsl(${Math.random() * 360}, 70%, 50%)`
    }));
  };

  return (
    <div className="sentiment-analysis">
      <div className="analysis-header">
        <h1>🎭 Sentiment & Trend Analysis</h1>
        <p>Analyze customer sentiment and market trends for your campaigns</p>
      </div>

      <form onSubmit={handleSubmit} className="analysis-form">
        <div className="form-group">
          <label htmlFor="product">Product/Brand *</label>
          <input
            type="text"
            id="product"
            name="product"
            value={formData.product}
            onChange={handleInputChange}
            placeholder="Enter your product or brand name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="campaign_text">Campaign Message *</label>
          <textarea
            id="campaign_text"
            name="campaign_text"
            value={formData.campaign_text}
            onChange={handleInputChange}
            placeholder="Enter your campaign message or content to analyze"
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="keywords">Keywords (optional)</label>
          <input
            type="text"
            id="keywords"
            onChange={handleKeywordsChange}
            placeholder="Enter keywords separated by commas (e.g., marketing, social media, advertising)"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading} className="analyze-btn">
          {loading ? (
            <>
              <span className="spinner"></span>
              Analyzing...
            </>
          ) : (
            <>
              📊 Analyze Sentiment & Trends
            </>
          )}
        </button>
      </form>

      {analysis && (
        <div className="analysis-results">
          {/* Sentiment Analysis Results */}
          <div className="result-section">
            <h2>🎭 Sentiment Analysis</h2>
            <div className="sentiment-overview">
              <div className="sentiment-card">
                <div className="sentiment-indicator" 
                     style={{ backgroundColor: getSentimentColor(analysis.sentiment_analysis.overall_sentiment) }}>
                  <span className="sentiment-label">
                    {analysis.sentiment_analysis.overall_sentiment.toUpperCase()}
                  </span>
                  <span className="confidence-score">
                    {Math.round(analysis.sentiment_analysis.confidence * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="emotions-breakdown">
              <h3>📊 Emotional Response</h3>
              <div className="emotions-grid">
                {Object.entries(analysis.sentiment_analysis.emotions).map(([emotion, score]) => (
                  <div key={emotion} className="emotion-item">
                    <span className="emotion-name">{emotion}</span>
                    <div className="emotion-bar">
                      <div 
                        className="emotion-fill" 
                        style={{ width: `${score * 100}%` }}
                      ></div>
                    </div>
                    <span className="emotion-score">{Math.round(score * 100)}%</span>
                  </div>
                ))}
              </div>

              {/* Emotion Chart */}
              <div className="trend-chart-container">
                <h3>Emotion Distribution</h3>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={generateEmotionChartData(analysis.sentiment_analysis.emotions)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="emotion" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="score" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="recommendations">
              <h3>💡 Sentiment Recommendations</h3>
              <ul>
                {analysis.sentiment_analysis.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Trend Analysis Results */}
          <div className="result-section">
            <h2>📈 Trend Analysis</h2>
            
            {/* Trend Chart */}
            <div className="trend-chart-container">
              <h3>Keyword Trends Over Time</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateTrendChartData(analysis.trend_analysis.keywords)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {analysis.trend_analysis.keywords.map((trend, index) => (
                      <Line
                        key={trend.keyword}
                        type="monotone"
                        dataKey={trend.keyword}
                        stroke={`hsl(${index * 60}, 70%, 50%)`}
                        strokeWidth={3}
                        dot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="trends-grid">
              {analysis.trend_analysis.keywords.map((trend, index) => (
                <div key={index} className="trend-card">
                  <h4>{trend.keyword}</h4>
                  <div className="trend-metrics">
                    <div className="metric">
                      <span className="metric-label">Trend Score</span>
                      <span className="metric-value">{Math.round(trend.trend_score * 100)}%</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Volume Change</span>
                      <span 
                        className="metric-value"
                        style={{ color: getTrendColor(trend.volume_change) }}
                      >
                        {trend.volume_change > 0 ? '+' : ''}{Math.round(trend.volume_change)}%
                      </span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Sentiment Trend</span>
                      <span className="metric-value">{trend.sentiment_trend}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="overall-trend">
              <h3>Overall Trend: {analysis.trend_analysis.overall_trend.replace('_', ' ').toUpperCase()}</h3>
            </div>

            <div className="recommendations">
              <h3>📊 Trend Recommendations</h3>
              <ul>
                {analysis.trend_analysis.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Insights */}
          <div className="result-section">
            <h2>🤖 AI Insights</h2>
            <div className="insights-list">
              {analysis.ai_insights.map((insight, index) => (
                <div key={index} className="insight-item">
                  <span className="insight-number">{index + 1}</span>
                  <span className="insight-text">{insight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentimentAnalysis;
