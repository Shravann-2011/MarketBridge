import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import "./Footer.css";
const FooterSection = ({ title, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="footer-section"
  >
    <h3 >{title}</h3>
    {children}
  </motion.div>
);

const FooterLink = ({ to, children, external = false }) => {
  const LinkComponent = external ? 'a' : NavLink;
  const linkProps = external 
    ? { href: to, target: "_blank", rel: "noopener noreferrer" }
    : { to };

  return (
    <LinkComponent {...linkProps} className="footer-link">
      {children}
    </LinkComponent>
  );
};

const SocialLink = ({ href, icon, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="social-link"
    whileHover={{ scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.95 }}
    aria-label={label}
  >
    {icon}
  </motion.a>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { to: "/", label: "Home" },
    { to: "/campaign", label: "Create Campaign" },
    { to: "/agents", label: "AI Agents" },
    { to: "/analytics", label: "Analytics" }
  ];

  const companyLinks = [
    { to: "/about", label: "About Us" },
    { to: "/careers", label: "Careers" },
    { to: "/press", label: "Press Kit" },
    { to: "/contact", label: "Contact" }
  ];

  const supportLinks = [
    { to: "/help", label: "Help Center" },
    { to: "/docs", label: "Documentation" },
    { to: "/api", label: "API Reference" },
    { to: "/status", label: "System Status" }
  ];

  const legalLinks = [
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/terms", label: "Terms of Service" },
    { to: "/security", label: "Security" },
    { to: "/cookies", label: "Cookie Policy" }
  ];

  const socialLinks = [
    { href: "https://twitter.com", icon: "🐦", label: "Twitter" },
    { href: "https://linkedin.com", icon: "💼", label: "LinkedIn" },
    { href: "https://github.com", icon: "🐙", label: "GitHub" },
    { href: "https://discord.com", icon: "💬", label: "Discord" }
  ];

  const features = [
    { icon: "🤖", text: "AI-Powered Marketing" },
    { icon: "⚡", text: "Lightning Fast Analysis" },
    { icon: "🎯", text: "Precision Targeting" },
    { icon: "📊", text: "Real-time Analytics" }
  ];

  return (
    <footer className="main-footer">
      {/* Footer Top */}
      <div className="footer-top">
        <div className="container">
          <div className="footer-content">
            {/* Brand Section */}
            <FooterSection title="" delay={0}>
              <div className="footer-brand">
                <div className="footer-logo">
                  <div className="footer-logo-icon">🌉</div>
                  <div className="footer-logo-content">
                    <div className="footer-logo-text">MarketBridge</div>
                    <div className="footer-logo-tagline">AI Marketing Platform</div>
                  </div>
                </div>
                
                <p className="footer-description">
                  Transform your marketing with intelligent AI agents that collaborate 
                  to create winning campaigns, optimize budgets, and maximize ROI.
                </p>

                <div className="social-links">
                  {socialLinks.map((social, index) => (
                    <SocialLink key={index} {...social} />
                  ))}
                </div>
              </div>
            </FooterSection>

            {/* Navigation Sections */}
            <FooterSection title="Product" delay={0.1}>
              <ul className="footer-links">
                {productLinks.map((link, index) => (
                  <li key={index}>
                    <FooterLink to={link.to}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </FooterSection>

            <FooterSection title="Company" delay={0.2}>
              <ul className="footer-links">
                {companyLinks.map((link, index) => (
                  <li key={index}>
                    <FooterLink to={link.to}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </FooterSection>

            <FooterSection title="Support" delay={0.3}>
              <ul className="footer-links">
                {supportLinks.map((link, index) => (
                  <li key={index}>
                    <FooterLink to={link.to}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </FooterSection>

            {/* Newsletter Section */}
            <FooterSection title="Stay Updated" delay={0.4}>
              <div className="newsletter">
                <p className="newsletter-description">
                  Get the latest updates on AI marketing trends and platform features.
                </p>
                
                <div className="newsletter-form">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="newsletter-input"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="newsletter-button"
                  >
                    Subscribe
                  </motion.button>
                </div>

                <p className="newsletter-note">
                  By subscribing, you agree to our Privacy Policy and consent to receive updates.
                </p>
              </div>
            </FooterSection>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="footer-legal">
              <p className="copyright">
                © {currentYear} MarketBridge. All rights reserved.
              </p>
              
              <div className="legal-links">
                {legalLinks.map((link, index) => (
                  <React.Fragment key={index}>
                    <FooterLink to={link.to}>{link.label}</FooterLink>
                    {index < legalLinks.length - 1 && <span className="separator">•</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </footer>
  );
}
