import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

        <p style={hintText}>
          💡 Open browser console (F12) for detailed debugging info
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
  backgroundColor: "#f5f5f5",
};

const card = {
  width: "100%",
  maxWidth: "420px",
  padding: "30px",
  borderRadius: "12px",
  backgroundColor: "#fff",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
};

const title = {
  textAlign: "center",
  fontSize: "28px",
  color: "var(--color-primary)",
  marginBottom: "10px",
};

const subtitle = {
  textAlign: "center",
  marginBottom: "20px",
  color: "#555",
};

const errorBox = {
  padding: "12px",
  marginBottom: "15px",
  backgroundColor: "#fee",
  color: "#c33",
  borderRadius: "6px",
  border: "1px solid #fcc",
  fontSize: "14px",
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "14px",
  boxSizing: "border-box",
};

const button = {
  width: "100%",
  padding: "14px",
  backgroundColor: "var(--color-primary)",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "600",
  transition: "opacity 0.2s",
};

const hintText = {
  marginTop: "15px",
  fontSize: "12px",
  color: "#888",
  textAlign: "center",
};

export default Login;