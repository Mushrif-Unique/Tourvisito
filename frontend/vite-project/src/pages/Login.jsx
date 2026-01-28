import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API, { setAuthToken } from "../api/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", { email }); // Debug log
      
      const { data } = await API.post("/users/login", { email, password });

      console.log("Login successful:", data); // Debug log

      localStorage.setItem("token", data.token);
      setAuthToken(data.token);

      // ✅ Redirect to home (fixed path)
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      
      // Better error handling
      if (err.response) {
        // Server responded with error
        const message = err.response.data?.message || err.response.data?.error;
        setError(message || `Error: ${err.response.status} - Invalid credentials`);
        console.error("Server error:", err.response.data);
        console.error("Status:", err.response.status);
      } else if (err.request) {
        // Request made but no response
        setError("Cannot connect to server. Please check if the backend is running on http://localhost:5000");
        console.error("No response from server");
      } else {
        // Other errors
        setError("An unexpected error occurred");
        console.error("Error:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={title}>Welcome Back</h1>
        <p style={subtitle}>Login to continue planning your trips</p>

        {error && (
          <div style={errorBox}>
            <strong>⚠️ Login Failed</strong>
            <br />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={input}
            autoComplete="email"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={input}
            autoComplete="current-password"
          />

          <button type="submit" disabled={loading} style={button}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={forgotPasswordSection}>
          <Link to="/forgot-password" style={forgotPasswordLink}>Forgot Password?</Link>
        </div>
        <p style={AboutText}>
          Created By Nawas Mushrif © 2026
        </p>
      </div>
    </div>
  );
};

/* STYLES */
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

const errorBox = {
  padding: "14px 16px",
  marginBottom: "20px",
  backgroundColor: "#fff5f5",
  color: "#c41e3a",
  borderRadius: "12px",
  border: "1px solid #feb2b2",
  fontSize: "13px",
  lineHeight: "1.6",
};

const input = {
  width: "100%",
  padding: "12px 16px",
  marginBottom: "16px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  fontSize: "14px",
  boxSizing: "border-box",
  backgroundColor: "#f8fafc",
  transition: "all 0.3s ease",
  fontFamily: "inherit",
};

const button = {
  width: "100%",
  padding: "14px 16px",
  backgroundColor: "#112647",
  color: "#ffffff",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "700",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "0 4px 15px rgba(17, 38, 71, 0.2)",
  marginTop: "10px",
};

const forgotPasswordSection = {
  textAlign: "center",
  marginTop: "16px",
  marginBottom: "20px",
};

const forgotPasswordLink = {
  fontSize: "14px",
  color: "#667eea",
  textDecoration: "none",
  fontWeight: "600",
  transition: "color 0.3s",
  cursor: "pointer",
};

const AboutText = {
  marginTop: "20px",
  fontSize: "12px",
  color: "#94a3b8",
  textAlign: "center",
};

export default Login;