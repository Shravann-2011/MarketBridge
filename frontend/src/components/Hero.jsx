/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Hero.css";
const FloatingElements = () => (
  <div className="floating-elements">
    <motion.div
      className="floating-element element-1"
      animate={{ y: [-20, 20, -20], rotate: [0, 180, 360] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    >
      🎨
    </motion.div>
    <motion.div
      className="floating-element element-2"
      animate={{ y: [20, -20, 20], rotate: [360, 180, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      💰
    </motion.div>
    <motion.div
      className="floating-element element-3"
      animate={{ y: [-15, 15, -15], rotate: [0, -180, -360] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    >
      📦
    </motion.div>
  </div>
);

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="feature-card"
  >
    <div className="feature-icon">{icon}</div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
  </motion.div>
);

const StatItem = ({ value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    className="stat-item"
  >
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </motion.div>
);

const AgentPreview = ({ agent, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay }}
    className="agent-preview"
    whileHover={{ scale: 1.05 }}
  >
    <div className="agent-avatar" style={{ background: agent.gradient }}>
      {agent.icon}
    </div>
    <div className="agent-info">
      <h4 className="agent-name">{agent.name}</h4>
      <p className="agent-role">{agent.role}</p>
    </div>
    
  </motion.div>
);

export default function Hero() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Agents",
      description: "Three specialized AI agents working in harmony to create optimal marketing strategies."
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Get comprehensive campaign analysis and recommendations in seconds, not hours."
    },
    {
      icon: "🎯",
      title: "Precision Targeting",
      description: "Advanced customer segmentation and targeting for maximum campaign effectiveness."
    },
    
  ];

  const stats = [
    { value: "150+", label: "Campaigns Created" },
    { value: "94%", label: "Success Rate" },
    { value: "$2.5M+", label: "Budget Managed" },
    { value: "10K+", label: "Products Tracked" }
  ];

  const agents = [
    {
      name: "Creative Agent",
      role: "Campaign Strategy",
      icon: "🎨",
      gradient: "linear-gradient(135deg, #7c3aed, #a855f7)"
    },
    {
      name: "Finance Agent",
      role: "Budget Analysis",
      icon: "💰",
      gradient: "linear-gradient(135deg, #06b6d4, #0891b2)"
    },
    {
      name: "Inventory Agent",
      role: "Stock Management",
      icon: "📦",
      gradient: "linear-gradient(135deg, #10b981, #059669)"
    }
  ];

  return (
    <div className="hero-page">
      {/* Hero Section */}
      <section className="hero-main">
        <FloatingElements />
        
        <div className="container">
          <div className="hero-content">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="hero-text"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="hero-badge"
              >
                ✨ Powered by Advanced AI Technology
              </motion.div>
              
              <h1 className="hero-title">
                Transform Your Marketing with
                <span className="gradient-text"> AI-Powered Agents</span>
              </h1>
              
              <p className="hero-subtitle">
                Experience the future of marketing with our intelligent agent collaboration system. 
                Get data-driven campaigns, budget optimization, and inventory insights in one powerful platform.
              </p>

              <div className="hero-actions">
                <motion.button
                  onClick={() => navigate("/campaign")}
                  className="cta-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="cta-icon">🚀</span>
                  Start Creating Campaign
                </motion.button>
                
                <motion.button
                  onClick={() => navigate("/agents")}
                  className="cta-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="cta-icon">👥</span>
                  Meet Our Agents
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="hero-visual"
            >
              <div className="visual-container">
                <div className="central-hub">
                  <div className="hub-core">
                    <span className="hub-icon">🎯</span>
                    <span className="hub-text">MarketBridge</span>
                  </div>
                </div>
                
                <div className="agent-nodes">
                  {agents.map((agent, index) => (
                    <motion.div
                      key={agent.name}
                      className={`agent-node node-${index + 1}`}
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="node-content" style={{ background: agent.gradient }}>
                        {agent.icon}
                      </div>
                      <div className="connection-line"></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="section-header"
          >
            <h2 className="section-title">Why Choose MarketBridge?</h2>
            <p className="section-subtitle">
              Powerful features designed to revolutionize your marketing workflow
            </p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} delay={index * 0.2} />
            ))}
          </div>
        </div>
      </section>

      {/* Agents Preview Section */}
      <section className="agents-preview-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="section-header"
          >
            <h2 className="section-title">Meet Your AI Marketing Team</h2>
            <p className="section-subtitle">
              Three specialized agents working together to maximize your campaign success
            </p>
          </motion.div>

          <div className="agents-preview-grid">
            {agents.map((agent, index) => (
              <AgentPreview key={agent.name} agent={agent} delay={index * 0.2} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="agents-cta"
          >
            <button 
              onClick={() => navigate("/agents")}
              className="agents-cta-btn"
            >
              Explore All Agents →
            </button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="cta-card"
          >
            <h2 className="cta-title">Ready to Transform Your Marketing?</h2>
            <p className="cta-description">
              Join thousands of marketers who trust MarketBridge to create winning campaigns
            </p>
            <motion.button
              onClick={() => navigate("/campaign")}
              className="final-cta-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="cta-icon">✨</span>
              Get Started Now
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
