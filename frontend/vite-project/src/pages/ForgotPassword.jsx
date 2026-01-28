import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await API.post("/users/forgot-password", { email });
      setSuccess(true);
      setEmail("");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={title}>Forgot Password?</h1>
        <p style={subtitle}>Enter your email and we'll send you a link to reset your password</p>

        {error && <div style={errorBox}>{error}</div>}
        {success && (
          <div style={successBox}>
            ✓ Check your email for the reset link. Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={input}
            autoComplete="email"
            disabled={success}
          />

          <button type="submit" disabled={loading || success} style={button}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p style={linkText}>
          Remember your password? <Link to="/login" style={link}>Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: "20px",
  position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  width: "100%",
  height: "100%",
};

const card = {
  width: "100%",
  maxWidth: "420px",
  padding: "40px",
  borderRadius: "20px",
  backgroundColor: "#ffffff",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

const title = {
  textAlign: "center",
  fontSize: "32px",
  fontWeight: "800",
  color: "#112647",
  marginBottom: "8px",
  letterSpacing: "-0.5px",
};

const subtitle = {
  textAlign: "center",
  marginBottom: "30px",
  color: "#64748b",
  fontSize: "14px",
  lineHeight: "1.5",
};

const input = {
  width: "100%",
  padding: "12px 16px",
  marginBottom: "20px",
  border: "2px solid #e2e8f0",
  borderRadius: "12px",
  fontSize: "14px",
  fontFamily: "inherit",
  transition: "all 0.3s",
  boxSizing: "border-box",
};

const button = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#667eea",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s",
  marginBottom: "20px",
};

const errorBox = {
  padding: "12px 16px",
  marginBottom: "20px",
  backgroundColor: "#fff5f5",
  color: "#c41e3a",
  borderRadius: "12px",
  border: "1px solid #feb2b2",
  fontSize: "13px",
  textAlign: "center",
};

const successBox = {
  padding: "12px 16px",
  marginBottom: "20px",
  backgroundColor: "#f0fdf4",
  color: "#15803d",
  borderRadius: "12px",
  border: "1px solid #86efac",
  fontSize: "13px",
  textAlign: "center",
};

const linkText = {
  textAlign: "center",
  fontSize: "14px",
  color: "#64748b",
  margin: "0",
};

const link = {
  color: "#667eea",
  textDecoration: "none",
  fontWeight: "600",
  cursor: "pointer",
};

export default ForgotPassword;
