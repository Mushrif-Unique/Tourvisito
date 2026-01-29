import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("traveler");
  const [agencyName, setAgencyName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = { name, email, password, role };
      
      // Only include agencyName for agency accounts
      if (role === "agency") {
        userData.agencyName = agencyName;
      }
      
      await API.post("/users/register", userData);
      alert("Registration successful! Please login.");
      navigate("/login", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={title}>Create Account</h1>
        <p style={subtitle}>Join TourVisito and start your journey</p>

        <form onSubmit={handleRegister}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Register As</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={inputStyle}
            >
              <option value="traveler">Traveler</option>
              <option value="agency">Travel Agency</option>
            </select>
          </div>

          {role === "agency" && (
            <div style={fieldStyle}>
              <label style={labelStyle}>Agency Name *</label>
              <input
                type="text"
                placeholder="Enter your agency name"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                required={role === "agency"}
                style={inputStyle}
              />
            </div>
          )}

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ---------- STYLES ---------- */
const container = {
  minHeight: "100vh",
  backgroundColor: "var(--color-bg)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
};

const card = {
  width: "100%",
  maxWidth: "460px",
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "12px",
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
  color: "#555",
  marginBottom: "30px",
};

const fieldStyle = { marginBottom: "20px" };
const labelStyle = { display: "block", marginBottom: "6px", fontWeight: "600", color: "#333" };
const inputStyle = { width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px" };
const buttonStyle = { width: "100%", padding: "14px", backgroundColor: "var(--color-primary)", color: "#fff", fontSize: "16px", border: "none", borderRadius: "6px", cursor: "pointer" };

export default Register;
