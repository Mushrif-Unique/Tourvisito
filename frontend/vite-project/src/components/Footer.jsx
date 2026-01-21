import React from "react";

const Footer = () => {
  return (
    <footer style={footerWrapper}>
      <div style={footerContainer}>
        {/* BRAND & TAGLINE */}
        <div style={brandSection}>
          <h2 style={brandLogo}>
            Tour<span style={{ color: "var(--color-accent)" }}>Visito</span>
          </h2>
          <p style={tagline}>
            Crafting unforgettable journeys with <br />
            AI-driven precision.
          </p>
        </div>

        {/* NAVIGATION LINKS */}
        <div style={linkSection}>
          <div style={linkColumn}>
            <h4 style={columnTitle}>Platform</h4>
            <a href="#home" style={footerLink}>AI Planner</a>
            <a href="#trips" style={footerLink}>Browse Trips</a>
          </div>
          <div style={linkColumn}>
            <h4 style={columnTitle}>Company</h4>
            <a href="#about" style={footerLink}>About Us</a>
            <a href="#contact" style={footerLink}>Contact</a>
          </div>
        </div>
      </div>

      {/* BOTTOM LEGAL BAR */}
      <div style={bottomBar}>
        <div style={bottomContainer}>
          <p style={copyText}>© 2026 TourVisito Inc. Built for the modern traveler.</p>
          <div style={socialIcons}>
            {/* These can be replaced with actual SVG icons */}
            <span style={socialDot}>Twitter</span>
            <span style={socialDot}>Instagram</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* --- STYLISH FOOTER STYLES --- */

const footerWrapper = {
  backgroundColor: "var(--color-primary)",
  color: "#fff",
  padding: "80px 0 0 0", // More top padding for a luxurious feel
  width: "100%",
};

const footerContainer = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 20px 60px 20px",
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "40px",
};

const brandSection = {
  flex: "1 1 300px",
};

const brandLogo = {
  fontSize: "28px",
  fontWeight: "800",
  letterSpacing: "-1px",
  marginBottom: "16px",
  marginTop: 0,
};

const tagline = {
  color: "rgba(255, 255, 255, 0.6)",
  fontSize: "15px",
  lineHeight: "1.6",
};

const linkSection = {
  display: "flex",
  gap: "60px",
  flexWrap: "wrap",
};

const linkColumn = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const columnTitle = {
  fontSize: "14px",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "1px",
  marginBottom: "12px",
  color: "var(--color-accent)",
};

const footerLink = {
  color: "rgba(255, 255, 255, 0.8)",
  textDecoration: "none",
  fontSize: "15px",
  transition: "color 0.2s ease",
};

const bottomBar = {
  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  padding: "30px 0",
  backgroundColor: "rgba(0, 0, 0, 0.2)", // Slightly darker bottom strip
};

const bottomContainer = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "15px",
};

const copyText = {
  fontSize: "13px",
  color: "rgba(255, 255, 255, 0.5)",
  margin: 0,
};

const socialIcons = {
  display: "flex",
  gap: "20px",
  fontSize: "13px",
  fontWeight: "600",
};

const socialDot = {
  cursor: "pointer",
  color: "rgba(255, 255, 255, 0.8)",
};

export default Footer;