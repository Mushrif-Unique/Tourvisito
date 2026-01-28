import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import API from "../api/api";

const Booking = () => {
  const location = useLocation();
  const [tripId, setTripId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tripData, setTripData] = useState(null);

  // Get trip ID from navigation state
  useEffect(() => {
    if (location.state?.tripId) {
      setTripId(location.state.tripId);
    }
    if (location.state?.tripData) {
      setTripData(location.state.tripData);
    }
  }, [location]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await API.post("/bookings", { tripId, name, email });
      alert("Booking successful!");
      console.log(data);
      // Clear form after successful booking
      setTripId("");
      setName("");
      setEmail("");
    } catch (err) {
      console.error(err);
      setError("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageWrapper}>
      <div style={bookingCard}>
        {/* Header */}
        <div style={headerSection}>
          <div style={iconCircle}>✈️</div>
          <h1 style={titleStyle}>Secure Booking</h1>
          <p style={subtitleStyle}>Complete your reservation in just a few seconds.</p>
        </div>

        {/* Trip Info Display */}
        {tripData && (
          <div style={tripInfoBox}>
            <h3 style={tripInfoTitle}>Trip Details</h3>
            <div style={tripInfoRow}>
              <span style={tripInfoLabel}>Destination:</span>
              <span style={tripInfoValue}>{tripData.destination}</span>
            </div>
            <div style={tripInfoRow}>
              <span style={tripInfoLabel}>Duration:</span>
              <span style={tripInfoValue}>{tripData.days} Days</span>
            </div>
            <div style={tripInfoRow}>
              <span style={tripInfoLabel}>Price:</span>
              <span style={tripInfoValue}>${tripData.price}</span>
            </div>
          </div>
        )}

        {/* Booking Form */}
        <form onSubmit={handleBooking} style={formStyle}>
          {/* Trip ID */}
          <div style={inputGroup}>
            <label style={labelStyle}>Reservation Reference (Trip ID)</label>
            <div style={inputWrapper}>
              <input
                type="text"
                placeholder="TRP-XXXXX"
                value={tripId}
                onChange={(e) => setTripId(e.target.value)}
                required
                style={inputField}
              />
            </div>
          </div>

          {/* Name */}
          <div style={inputGroup}>
            <label style={labelStyle}>Full Name</label>
            <div style={inputWrapper}>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={inputField}
              />
            </div>
          </div>

          {/* Email */}
          <div style={inputGroup}>
            <label style={labelStyle}>Email Address</label>
            <div style={inputWrapper}>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputField}
              />
            </div>
          </div>

          {/* Security Note */}
          <div style={securityNote}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            256-bit SSL Secure Encryption
          </div>

          {/* Error Message */}
          {error && <div style={errorMsg}>{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={loading ? { ...submitBtn, ...btnDisabled } : submitBtn}
          >
            {loading ? "Verifying Details..." : "Confirm & Pay"}
          </button>
        </form>
      </div>
    </div>
  );
};

/* --- STYLES --- */
const pageWrapper = {
  minHeight: "100vh",
  backgroundColor: "#f4f7fa",
  backgroundImage: "radial-gradient(#d1d5db 0.5px, transparent 0.5px)",
  backgroundSize: "20px 20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
};

const bookingCard = {
  width: "100%",
  maxWidth: "480px",
  backgroundColor: "#ffffff",
  padding: "40px",
  borderRadius: "28px",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
};

const headerSection = {
  textAlign: "center",
  marginBottom: "35px",
};

const iconCircle = {
  width: "60px",
  height: "60px",
  backgroundColor: "rgba(17, 38, 71, 0.05)",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  margin: "0 auto 15px",
};

const titleStyle = {
  fontSize: "26px",
  fontWeight: "800",
  color: "var(--color-primary)",
  letterSpacing: "-0.5px",
  margin: "0 0 8px 0",
};

const subtitleStyle = {
  fontSize: "15px",
  color: "#64748b",
  lineHeight: "1.5",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
};

const inputGroup = {
  marginBottom: "20px",
};

const inputWrapper = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: "700",
  color: "#475569",
  marginBottom: "8px",
  marginLeft: "4px",
};

const inputField = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "1.5px solid #e2e8f0",
  fontSize: "15px",
  color: "var(--color-primary)",
  transition: "all 0.2s ease",
  outline: "none",
  backgroundColor: "#f8fafc",
};

const securityNote = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  fontSize: "12px",
  color: "#94a3b8",
  marginBottom: "20px",
  fontWeight: "500",
};

const submitBtn = {
  padding: "16px",
  backgroundColor: "var(--color-primary)",
  color: "#ffffff",
  border: "none",
  borderRadius: "14px",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 10px 15px -3px rgba(17, 38, 71, 0.3)",
  transition: "transform 0.2s ease",
};

const btnDisabled = {
  opacity: "0.7",
  cursor: "not-allowed",
  transform: "scale(0.98)",
};

const errorMsg = {
  color: "#ee1660",
  fontSize: "14px",
  fontWeight: "600",
  marginBottom: "16px",
  textAlign: "center",
};

const tripInfoBox = {
  backgroundColor: "#f0f4ff",
  border: "2px solid #667eea",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "24px",
};

const tripInfoTitle = {
  fontSize: "14px",
  fontWeight: "700",
  color: "#667eea",
  margin: "0 0 12px 0",
  textTransform: "uppercase",
};

const tripInfoRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 0",
  borderBottom: "1px solid rgba(102, 126, 234, 0.2)",
};

const tripInfoRow_last = {
  ...tripInfoRow,
  borderBottom: "none",
};

const tripInfoLabel = {
  fontSize: "13px",
  color: "#64748b",
  fontWeight: "600",
};

const tripInfoValue = {
  fontSize: "14px",
  color: "#667eea",
  fontWeight: "700",
};

export default Booking;
