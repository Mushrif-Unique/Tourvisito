import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../api/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post("/users/login", { email, password });

      localStorage.setItem("token", data.token);
      setAuthToken(data.token);

      // ✅ Redirect to home
      navigate("/home", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={title}>Welcome Back</h1>
        <p style={subtitle}>Login to continue planning your trips</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={input}
          />

          <button type="submit" disabled={loading} style={button}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
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
};

const subtitle = {
  textAlign: "center",
  marginBottom: "20px",
  color: "#555",
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const button = {
  width: "100%",
  padding: "14px",
  backgroundColor: "var(--color-primary)",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
};

export default Login;
