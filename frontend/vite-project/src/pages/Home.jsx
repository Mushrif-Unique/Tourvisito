import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={pageContainer}>
      {/* HERO SECTION */}
      <section style={heroSection}>
        <div style={heroContent}>
          <div style={pillBadge}>✨ Revolutionizing Travel</div>
          <h1 style={heroTitle}>
            Plan Smarter Trips <br />
            with <span style={accentText}>AI Intelligence</span>
          </h1>

          <p style={heroSubtitle}>
            TourVisito is a high-performance travel ecosystem. We combine 
            generative AI with seamless booking management for both modern 
            travelers and professional agencies.
          </p>

          {/* CTA BUTTONS */}
          <div style={buttonGroup}>
            <Link to="/ai" style={{ textDecoration: "none" }}>
              <button style={primaryBtn}>
                Generate AI Itinerary
              </button>
            </Link>

            <Link to="/trips" style={{ textDecoration: "none" }}>
              <button style={secondaryBtn}>
                Explore Trips
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section style={featuresSection}>
        <div style={sectionHeader}>
          <h2 style={sectionTitle}>The Future of Travel Management</h2>
          <div style={underline}></div>
        </div>

        <div style={featuresGrid}>
          {[
            {
              title: "AI-Generated Itineraries",
              icon: "🤖",
              desc: "Hyper-personalized travel plans curated by advanced neural networks based on your unique travel style.",
            },
            {
              title: "Smart Booking System",
              icon: "💳",
              desc: "Unified checkout and reservation management with end-to-end encryption and real-time updates.",
            },
            {
              title: "Agency Dashboard",
              icon: "📊",
              desc: "Professional-grade tools to manage high-volume customers, custom trips, and growth analytics.",
            },
          ].map((item, index) => (
            <div key={index} style={featureCard}>
              <div style={iconBox}>{item.icon}</div>
              <h3 style={featureTitle}>{item.title}</h3>
              <p style={featureDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

/* --- PREMIUM STYLES --- */

const pageContainer = {
  backgroundColor: "var(--color-bg)",
  color: "var(--color-primary)",
};

const heroSection = {
  minHeight: "90vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 20px",
  /* Mesh Gradient for a "Modern SaaS" feel */
  background: `radial-gradient(at 0% 0%, rgba(238, 22, 96, 0.05) 0px, transparent 50%), 
               radial-gradient(at 100% 100%, rgba(17, 38, 71, 0.05) 0px, transparent 50%)`,
};

const heroContent = {
  maxWidth: "1000px",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const pillBadge = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  padding: "8px 16px",
  borderRadius: "100px",
  fontSize: "13px",
  fontWeight: "600",
  color: "var(--color-primary)",
  marginBottom: "24px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
};

const heroTitle = {
  fontSize: "clamp(40px, 8vw, 68px)",
  fontWeight: "800",
  lineHeight: "1.1",
  letterSpacing: "-0.04em",
  marginBottom: "24px",
};

const accentText = {
  color: "var(--color-accent)",
};

const heroSubtitle = {
  fontSize: "clamp(16px, 2vw, 20px)",
  lineHeight: "1.6",
  color: "#64748b",
  maxWidth: "700px",
  marginBottom: "48px",
};

const buttonGroup = {
  display: "flex",
  gap: "16px",
  flexWrap: "wrap",
  justifyContent: "center",
};

const primaryBtn = {
  padding: "18px 36px",
  fontSize: "16px",
  fontWeight: "700",
  backgroundColor: "var(--color-primary)",
  color: "#fff",
  border: "none",
  borderRadius: "14px",
  cursor: "pointer",
  boxShadow: "0 20px 30px -10px rgba(17, 38, 71, 0.3)",
  transition: "transform 0.2s ease",
};

const secondaryBtn = {
  padding: "18px 36px",
  fontSize: "16px",
  fontWeight: "700",
  backgroundColor: "#fff",
  color: "var(--color-primary)",
  border: "1px solid #e2e8f0",
  borderRadius: "14px",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const featuresSection = {
  padding: "100px 20px",
  backgroundColor: "#ffffff",
};

const sectionHeader = {
  textAlign: "center",
  marginBottom: "64px",
};

const sectionTitle = {
  fontSize: "36px",
  fontWeight: "800",
  color: "var(--color-primary)",
  marginBottom: "16px",
};

const underline = {
  width: "60px",
  height: "4px",
  backgroundColor: "var(--color-accent)",
  margin: "0 auto",
  borderRadius: "10px",
};

const featuresGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "32px",
  maxWidth: "1200px",
  margin: "0 auto",
};

const featureCard = {
  padding: "48px 32px",
  borderRadius: "24px",
  backgroundColor: "#fcfdff",
  border: "1px solid #f1f5f9",
  transition: "all 0.3s ease",
  textAlign: "left",
};

const iconBox = {
  fontSize: "32px",
  marginBottom: "24px",
  display: "inline-block",
  padding: "12px",
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
};

const featureTitle = {
  fontSize: "22px",
  fontWeight: "700",
  marginBottom: "16px",
  color: "var(--color-primary)",
};

const featureDesc = {
  color: "#64748b",
  lineHeight: "1.7",
  fontSize: "16px",
};

export default Home;