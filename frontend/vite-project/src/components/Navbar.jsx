import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const token = localStorage.getItem("token");

  // Detect scroll to toggle glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={isScrolled ? { ...navWrapper, ...navGlass } : navWrapper}>
      <div style={navContainer}>
        {/* LOGO */}
        <Link to="/" style={logoStyle}>
          Tour<span style={{ color: "var(--color-accent)" }}>Visito</span>
        </Link>

        {/* LINKS */}
        <div style={linkGroup}>
          <Link to="/" style={linkItem}>Home</Link>
          <Link to="/trips" style={linkItem}>Explore</Link>
          
          {token ? (
            <>
              <Link to="/ai" style={aiPill}>AI Itinerary</Link>
              <button onClick={handleLogout} style={logoutBtn}>Logout</button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Link to="/login" style={linkItem}>Login</Link>
              <Link to="/register" style={registerBtn}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

/* --- PREMIUM NAV STYLES --- */

const navWrapper = {
  position: "sticky",
  top: 0,
  width: "100%",
  zIndex: 1000,
  transition: "all 0.3s ease",
  padding: "20px 0",
  backgroundColor: "transparent",
};

const navGlass = {
  padding: "12px 0",
  backgroundColor: "rgba(255, 255, 255, 0.8)", // Translucent white
  backdropFilter: "blur(12px)",                // The "Glass" effect
  WebkitBackdropFilter: "blur(12px)",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.05)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
};

const navContainer = {
  maxWidth: "1280px",
  margin: "0 auto",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 40px",
};

const logoStyle = {
  fontSize: "24px",
  fontWeight: "850",
  color: "var(--color-primary)",
  textDecoration: "none",
  letterSpacing: "-1px",
};

const linkGroup = {
  display: "flex",
  alignItems: "center",
  gap: "32px",
};

const linkItem = {
  textDecoration: "none",
  color: "var(--color-primary)",
  fontSize: "15px",
  fontWeight: "600",
  transition: "color 0.2s ease",
};

const aiPill = {
  textDecoration: "none",
  backgroundColor: "var(--color-primary)",
  color: "#fff",
  padding: "8px 20px",
  borderRadius: "100px",
  fontSize: "14px",
  fontWeight: "700",
  boxShadow: "0 10px 20px rgba(17, 38, 71, 0.2)",
};

const registerBtn = {
  textDecoration: "none",
  backgroundColor: "var(--color-accent)",
  color: "#fff",
  padding: "10px 24px",
  borderRadius: "12px",
  fontSize: "14px",
  fontWeight: "700",
  boxShadow: "0 8px 15px rgba(238, 22, 96, 0.2)",
};

const logoutBtn = {
  background: "none",
  border: "1.5px solid var(--color-primary)",
  color: "var(--color-primary)",
  padding: "8px 18px",
  borderRadius: "10px",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
};

export default Navbar;