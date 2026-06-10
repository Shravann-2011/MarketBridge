import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { runCampaign } from "../api";
import { motion } from "framer-motion";
import "./CampaignForm.css";
export default function CampaignForm() {
  const [formData, setFormData] = useState({
    query: "",
    product: "",
    targetAudience: "",
    budget: "",
    timeline: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.query.trim() || !formData.product.trim()) {
    setError("Please fill in all required fields.");
    return;
  }

  setLoading(true);
  setError("");
  
  try {
    // Navigate to agents page immediately to show loading
    navigate("/agents", { 
      state: { 
        query: formData.query, 
        product: formData.product,
        isLoading: true
      } 
    });

    // Your existing runCampaign call
    const results = await runCampaign(formData.query, formData.product);

    // Navigate with results when complete
    navigate("/agents", { 
      state: { 
        results, 
        query: formData.query, 
        product: formData.product,
        isLoading: false
      } 
    });

  } catch (error) {
    console.error("Campaign submission error:", error);
    setError(error.response?.data?.error || error.message || "Failed to generate campaign");
    setLoading(false);
  }
};


  const campaignTypes = [
    { id: 'product-launch', name: 'Product Launch', icon: '🚀', desc: 'Introduce new products to market' },
    { id: 'seasonal-sale', name: 'Seasonal Sale', icon: '🎉', desc: 'Holiday and seasonal promotions' },
    { id: 'brand-awareness', name: 'Brand Awareness', icon: '📢', desc: 'Build brand recognition' },
    { id: 'customer-retention', name: 'Customer Retention', icon: '❤️', desc: 'Engage existing customers' },
    { id: 'lead-generation', name: 'Lead Generation', icon: '🎯', desc: 'Acquire new prospects' },
    { id: 'custom', name: 'Custom Campaign', icon: '⚡', desc: 'Tailored strategy' }
  ];

  const budgetRanges = [
    { value: '1000-5000', label: '$1,000 - $5,000', desc: 'Small campaigns' },
    { value: '5000-25000', label: '$5,000 - $25,000', desc: 'Medium campaigns' },
    { value: '25000-100000', label: '$25,000 - $100,000', desc: 'Large campaigns' },
    { value: '100000+', label: '$100,000+', desc: 'Enterprise campaigns' }
  ];

  const timeframes = [
    { value: '1-week', label: '1 Week', desc: 'Quick campaigns' },
    { value: '2-4-weeks', label: '2-4 Weeks', desc: 'Standard duration' },
    { value: '1-3-months', label: '1-3 Months', desc: 'Extended campaigns' },
    { value: '3-months+', label: '3+ Months', desc: 'Long-term strategy' }
  ];

  return (
    <div className="campaign-page">
      {/* Header */}
      <div className="campaign-header">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="header-content"
          >
            <h1 className="page-title">Create Your Campaign</h1>
            <p className="page-subtitle">
              Let our AI agents collaborate to build the perfect marketing strategy for your needs
            </p>
          </motion.div>
        </div>
      </div>

      {/* Progress Bar - Clean Version */}
<div className="progress-section">
  <div className="progress-bar">
    {[1, 2, 3].map((step) => (
      <div key={step} className={`progress-step ${currentStep >= step ? 'active' : ''}`}>
        <div className="step-circle">{step}</div>
        <span className="step-label">
          {step === 1 ? 'Campaign Type' : step === 2 ? 'Details' : 'Review & Submit'}
        </span>
      </div>
    ))}
  </div>
</div>



      {/* Main Form */}
      <div className="form-section">
        <div className="container">
          <motion.form
            onSubmit={handleSubmit}
            className="campaign-form"
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Step 1: Campaign Type */}
            {currentStep === 1 && (
              <div className="form-step">
                <h2 className="step-title">What type of campaign do you want to create?</h2>
                <div className="campaign-types-grid">
                  {campaignTypes.map((type) => (
                    <motion.div
                      key={type.id}
                      className={`campaign-type-card ${formData.query.includes(type.name) ? 'selected' : ''}`}
                      onClick={() => handleInputChange('query', `${type.name} campaign for ${formData.product || 'our product'}`)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="type-icon">{type.icon}</div>
                      <h3 className="type-name">{type.name}</h3>
                      <p className="type-desc">{type.desc}</p>
                    </motion.div>
                  ))}
                </div>
                
                {/* Divider */}
<div className="custom-query-divider">
  Or create something unique
</div>

{/* Custom Query Section */}
<div className="custom-query-section">
  <div className="custom-query-header">
    <label htmlFor="custom-query" className="form-label custom-label">
      <span className="custom-icon">✨</span>
      Describe Your Custom Campaign
    </label>
  </div>
  
  <textarea
    id="custom-query"
    className="form-textarea custom-textarea"
    placeholder="Tell us about your unique marketing vision... What are your goals? Who is your audience? What makes your campaign special?"
    value={formData.query}
    onChange={(e) => handleInputChange('query', e.target.value)}
    rows={3}
  />
  
  <p className="custom-help-text">
    💡 Be specific about your objectives, target market, and desired outcomes for better AI recommendations
  </p>
</div>

              </div>
            )}

            {/* Step 2: Campaign Details */}
            {currentStep === 2 && (
              <div className="form-step">
                <h2 className="step-title">Tell us about your product and preferences</h2>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="product" className="form-label required">
                      Product/Service Name
                    </label>
                    <input
                      id="product"
                      type="text"
                      className="form-input"
                      placeholder="e.g., Premium Wireless Headphones"
                      value={formData.product}
                      onChange={(e) => handleInputChange('product', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="audience" className="form-label">
                      Target Audience
                    </label>
                    <input
                      id="audience"
                      type="text"
                      className="form-input"
                      placeholder="e.g., Tech enthusiasts aged 25-35"
                      value={formData.targetAudience}
                      onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Budget Range</label>
                    <div className="option-grid">
                      {budgetRanges.map((range) => (
                        <div
                          key={range.value}
                          className={`option-card ${formData.budget === range.value ? 'selected' : ''}`}
                          onClick={() => handleInputChange('budget', range.value)}
                        >
                          <div className="option-label">{range.label}</div>
                          <div className="option-desc">{range.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Campaign Duration</label>
                    <div className="option-grid">
                      {timeframes.map((time) => (
                        <div
                          key={time.value}
                          className={`option-card ${formData.timeline === time.value ? 'selected' : ''}`}
                          onClick={() => handleInputChange('timeline', time.value)}
                        >
                          <div className="option-label">{time.label}</div>
                          <div className="option-desc">{time.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {currentStep === 3 && (
              <div className="form-step">
                <h2 className="step-title">Review Your Campaign Details</h2>
                
                <div className="review-card">
                  <div className="review-section">
                    <h3>Campaign Description</h3>
                    <p>{formData.query || 'No campaign description provided'}</p>
                  </div>

                  <div className="review-section">
                    <h3>Product/Service</h3>
                    <p>{formData.product || 'No product specified'}</p>
                  </div>

                  {formData.targetAudience && (
                    <div className="review-section">
                      <h3>Target Audience</h3>
                      <p>{formData.targetAudience}</p>
                    </div>
                  )}

                  <div className="review-grid">
                    {formData.budget && (
                      <div className="review-item">
                        <span className="review-label">Budget:</span>
                        <span className="review-value">
                          {budgetRanges.find(b => b.value === formData.budget)?.label}
                        </span>
                      </div>
                    )}
                    
                    {formData.timeline && (
                      <div className="review-item">
                        <span className="review-label">Duration:</span>
                        <span className="review-value">
                          {timeframes.find(t => t.value === formData.timeline)?.label}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="ai-preview">
                  <h3>🤖 What happens next?</h3>
                  <div className="ai-steps">
                    <div className="ai-step">
                      <span className="ai-icon">🎨</span>
                      <span>Creative Agent analyzes your campaign requirements</span>
                    </div>
                    <div className="ai-step">
                      <span className="ai-icon">💰</span>
                      <span>Finance Agent validates budget and ROI projections</span>
                    </div>
                    <div className="ai-step">
                      <span className="ai-icon">📦</span>
                      <span>Inventory Agent checks product availability</span>
                    </div>
                    <div className="ai-step">
                      <span className="ai-icon">🎯</span>
                      <span>All agents collaborate to create your final strategy</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="form-actions">
              {currentStep > 1 && (
                <motion.button
                  type="button"
                  onClick={handleBack}
                  className="btn btn-secondary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  Back
                </motion.button>
              )}

              {currentStep < 3 ? (
                <motion.button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!formData.query.trim() || (currentStep === 2 && !formData.product.trim())}
                >
                  Next Step
                </motion.button>
              ) : (
                // Find your current submit button and replace it with:
              <button 
                type="submit" 
                disabled={loading}
                className={`btn btn-primary btn-submit ${loading ? 'loading' : ''}`}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    <span className="loading-text">Analyzing Campaign...</span>
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🚀</span>
                    Generate Campaign
                  </>
                )}
              </button>

              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="error-message"
              >
                {error}
              </motion.div>
            )}
          </motion.form>
        </div>
      </div>
    </div>
  );
}
