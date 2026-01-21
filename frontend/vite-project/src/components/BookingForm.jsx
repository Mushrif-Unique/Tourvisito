import React, { useState, useEffect } from "react";
import API from "../api/api";
import jwt_decode from "jwt-decode";

const BookingForm = ({ tripId }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setName(decoded.name || "");
        setEmail(decoded.email || "");
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/bookings", { tripId, name, email });
      alert("Booking successful! Check your email for details.");
    } catch (err) {
      console.error(err);
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={formWrapper}>
      <form onSubmit={handleBooking} style={formContainer}>
        <div style={headerIcon}>📑</div>
        <h2 style={titleStyle}>Finalize Your Trip</h2>
        <p style={subtitleStyle}>Confirm your details below to secure your spot.</p>

        <div style={inputGroup}>
          <label style={labelStyle}>Full Name</label>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div style={inputGroup}>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={loading ? { ...buttonStyle, opacity: 0.7 } : buttonStyle}
        >
          {loading ? "Processing..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
};

/* --- PREMIUM ALIGNMENT STYLES --- */

const formWrapper = {
  width: "100%",
  display: "flex",
  justifyContent: "center", // Centers horizontally
  alignItems: "center",     // Centers vertically (if parent has height)
  padding: "20px 0",
};

const formContainer = {
  width: "100%",
  maxWidth: "450px", // Professional width for mobile and desktop
  backgroundColor: "#ffffff",
  padding: "40px",
  borderRadius: "24px",
  boxShadow: "0 20px 40px rgba(17, 38, 71, 0.08)",
  border: "1px solid #f1f5f9",
};

const headerIcon = {
  fontSize: "30px",
  marginBottom: "15px",
  textAlign: "center"
};

const titleStyle = {
  fontSize: "24px",
  fontWeight: "800",
  color: "var(--color-primary)",
  textAlign: "center",
  marginBottom: "8px",
};

const subtitleStyle = {
  fontSize: "14px",
  color: "#64748b",
  textAlign: "center",
  marginBottom: "30px",
};

const inputGroup = {
  marginBottom: "20px",
};

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: "700",
  color: "var(--color-primary)",
  textTransform: "uppercase",
  marginBottom: "8px",
  letterSpacing: "0.5px",
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1.5px solid #e2e8f0",
  fontSize: "15px",
  backgroundColor: "#fcfdff",
  outline: "none",
  boxSizing: "border-box", // Essential for responsiveness
};

const buttonStyle = {
  width: "100%",
  padding: "16px",
  backgroundColor: "var(--color-accent)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 10px 15px -3px rgba(238, 22, 96, 0.3)",
  transition: "all 0.2s ease",
};

export default BookingForm;