import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [role, setRole] = useState("traveler"); const [agencyName, setAgencyName] = useState("");
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const userData = { name, email, password, role }; if (role === "agency") userData.agencyName = agencyName;
      await API.post("/users/register", userData);
      if (role === "agency") localStorage.setItem("tourvisitoAgencyName", agencyName.trim());
      alert("Registration successful! Please login."); navigate("/login", { replace: true });
    } catch (err) { setError(err.response?.data?.message || "Registration failed. Please review your details and try again."); }
    finally { setLoading(false); }
  };

  return <div className="auth-page"><section className="auth-card" aria-labelledby="register-title">
    <div className="auth-brand"><span className="auth-brand-mark">✦</span> TourVisito</div>
    <h1 id="register-title" className="auth-heading">Start exploring</h1>
    <p className="auth-subtitle">Create your account and turn travel ideas into real itineraries.</p>
    {error && <div className="auth-error" role="alert">{error}</div>}
    <form className="auth-form" onSubmit={handleRegister}>
      <label className="auth-field"><span className="auth-label">Full name</span><input className="auth-input" type="text" placeholder="John Doe" value={name} onChange={(event) => setName(event.target.value)} required autoComplete="name" /></label>
      <label className="auth-field"><span className="auth-label">Email address</span><input className="auth-input" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label>
      <label className="auth-field"><span className="auth-label">Password</span><input className="auth-input" type="password" placeholder="Create a password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="new-password" /></label>
      <label className="auth-field"><span className="auth-label">I am joining as</span><select className="auth-select" value={role} onChange={(event) => setRole(event.target.value)}><option value="traveler">Traveler</option><option value="agency">Travel agency</option></select></label>
      {role === "agency" && <label className="auth-field"><span className="auth-label">Agency name</span><input className="auth-input" type="text" placeholder="Your agency name" value={agencyName} onChange={(event) => setAgencyName(event.target.value)} required autoComplete="organization" /></label>}
      <button className="auth-button" type="submit" disabled={loading}>{loading ? "Creating your account…" : "Create account"}</button>
    </form>
    <div className="auth-links"><span>Already a member?</span><Link className="auth-secondary-button" to="/login">Sign in</Link></div>
  </section></div>;
};

export default Register;
