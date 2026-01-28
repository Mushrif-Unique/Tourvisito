import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // frontend-safe

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState("traveler"); // ✅ default traveler
  const [userName, setUserName] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role || "traveler"); // ✅ fallback traveler
        setUserName(decoded.name || "User");
      } catch (err) {
        console.error("Invalid token", err);
        setUserRole("traveler");
      }
    }
  }, [token]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  const getNavItems = () => {
    if (!token) return null;

    switch (userRole) {
      case "admin":
        return (
          <>
            <Link to="/" style={linkItem}>Dashboard</Link>
            <Link to="/trips" style={linkItem}>All Trips</Link>
            <Link to="/admin/bookings" style={linkItem}>All Bookings</Link>
            <Link to="/admin/users" style={linkItem}>Users</Link>
            <Link to="/calendar" style={calendarBtn}>📅 Calendar</Link>
            <Link to="/ai" style={aiPill}>AI Itinerary</Link>
          </>
        );

      case "agency":
        return (
          <>
            <Link to="/" style={linkItem}>Dashboard</Link>
            <Link to="/trips" style={linkItem}>Browse Trips</Link>
            <Link to="/agency/my-trips" style={linkItem}>My Trips</Link>
            <Link to="/agency/bookings" style={linkItem}>Bookings</Link>
            <Link to="/agency/calendar" style={calendarBtn}>📅 Calendar</Link>
            <Link to="/ai" style={aiPill}>AI Itinerary</Link>
          </>
        );

      default: // traveler
        return (
          <>
            <Link to="/" style={linkItem}>Home</Link>
            <Link to="/trips" style={linkItem}>Explore</Link>
            <Link to="/saved-trips" style={linkItem}>❤️ Saved</Link>
            <Link to="/my-bookings" style={linkItem}>My Bookings</Link>
            <Link to="/ai" style={aiPill}>AI Itinerary</Link>
          </>
        );
    }
  };

  return (
    <nav style={isScrolled ? { ...navWrapper, ...navGlass } : navWrapper}>
      <div style={navContainer}>
        <Link to="/" style={logoStyle}>
          Tour<span style={{ color: "var(--color-accent)" }}>Visito</span>
        </Link>

        <div style={linkGroup}>
          {isLoginPage && <Link to="/register" style={registerBtn}>Sign Up</Link>}
          {isRegisterPage && <Link to="/login" style={loginBtn}>Login</Link>}

          {!isLoginPage && !isRegisterPage && (
            token ? (
              <>
                {getNavItems()}
                <div style={userSection}>
                  <span style={userNameStyle}>{userName}</span>
                  <button onClick={handleLogout} style={logoutBtn}>Logout</button>
                </div>
              </>
            ) : (
              <>
                <Link to="/" style={linkItem}>Home</Link>
                <Link to="/trips" style={linkItem}>Explore</Link>
                <Link to="/login" style={loginBtn}>Login</Link>
                <Link to="/register" style={registerBtn}>Sign Up</Link>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

/* ---------- STYLES ---------- */
const navWrapper = { position: "sticky", top: 0, padding: "20px 0", zIndex: 1000 };
const navGlass = { background: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)" };
const navContainer = { maxWidth: "1280px", margin: "auto", display: "flex", justifyContent: "space-between", padding: "0 40px" };
const logoStyle = { fontSize: "24px", fontWeight: "800", textDecoration: "none", color: "#112647" };
const linkGroup = { display: "flex", alignItems: "center", gap: "24px" };
const linkItem = { textDecoration: "none", fontWeight: "600", color: "#112647" };
const aiPill = { background: "#112647", color: "#fff", padding: "8px 20px", borderRadius: "20px", textDecoration: "none" };
const calendarBtn = { background: "#667eea", color: "#fff", padding: "8px 20px", borderRadius: "12px", textDecoration: "none" };
const registerBtn = { background: "#ee1660", color: "#fff", padding: "10px 24px", borderRadius: "12px", textDecoration: "none" };
const loginBtn = { border: "1px solid #112647", padding: "8px 18px", borderRadius: "10px", textDecoration: "none",color: "#112647" };
const logoutBtn = { border: "1px solid #112647", padding: "6px 16px", borderRadius: "10px", background: "none", cursor: "pointer" ,color: "#112647"};
const userSection = { display: "flex", alignItems: "center", gap: "12px" };
const userNameStyle = { fontWeight: "600", fontSize: "14px" };

export default Navbar;
