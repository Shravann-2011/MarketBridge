/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle.jsx";
import "./Header.css";

const MobileMenu = ({ isOpen, onClose, links }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          className="mobile-menu-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className="mobile-menu"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          <div className="mobile-menu-header">
            <h2>MarketBridge</h2>
            <button onClick={onClose} className="close-btn">×</button>
          </div>
          <nav className="mobile-nav">
            {links.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => 
                  `mobile-nav-link ${isActive ? 'active' : ''}`
                }
                onClick={onClose}
                end={to === "/"}
              >
                <span className="nav-icon">{icon}</span>
                {label}
              </NavLink>
            ))}
          </nav>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const Logo = () => (
  <div className="logo">
    <h1>MarketBridge</h1>
    <span>AI Marketing Platform</span>
  </div>
);

const NotificationBadge = ({ count }) => (
  count > 0 && (
    <span className="notification-badge">
      {count > 99 ? '99+' : count}
    </span>
  )
);

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications] = useState(3); // Mock notification count
  const location = useLocation();

  const navigationLinks = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/campaign", label: "Campaign", icon: "🚀" },
  { to: "/agents", label: "Agents", icon: "🤖" },
  { to: "/what-if", label: "What-If", icon: "🧮" },
  { to: "/sentiment", label: "Sentiment", icon: "🎭" }, // NEW NAVIGATION ITEM
];


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          {/* Logo Section */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            {navigationLinks.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => 
                  `nav-link ${isActive ? 'active' : ''}`
                }
                end={to === "/"}
              >
                <span className="nav-icon">{icon}</span>
                {label}
                {label === "Campaign" && <NotificationBadge count={notifications} />}
              </NavLink>
            ))}
          </nav>

          {/* Header Actions */}
          <div className="header-actions">
            {/* Theme Toggle - Desktop */}
            <ThemeToggle />

            {/* User Menu */}
            <div className="user-menu">
              <button className="user-avatar">
                👤
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Progress Bar for Campaign/Agents pages */}
        {(location.pathname === '/campaign' || location.pathname === '/agents') && (
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={navigationLinks}
      />
    </>
  );
}
