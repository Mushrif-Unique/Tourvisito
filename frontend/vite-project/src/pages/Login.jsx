import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../api/api";
import "../styles/auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const { data } = await API.post("/users/login", { email, password });
      localStorage.setItem("token", data.token); setAuthToken(data.token); navigate("/", { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error;
      setError(message || (err.request ? "Cannot connect to the server. Please try again shortly." : "Unable to sign in. Please try again."));
    } finally { setLoading(false); }
  };

  return <div className="auth-page"><section className="auth-card" aria-labelledby="login-title">
    <div className="auth-brand"><span className="auth-brand-mark">✦</span> TourVisito</div>
    <h1 id="login-title" className="auth-heading">Welcome back</h1>
    <p className="auth-subtitle">Sign in to continue shaping your next unforgettable journey.</p>
    {error && <div className="auth-error" role="alert">{error}</div>}
    <form className="auth-form" onSubmit={handleLogin}>
      <label className="auth-field"><span className="auth-label">Email address</span><input className="auth-input" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label>
      <label className="auth-field"><span className="auth-label">Password</span><input className="auth-input" type="password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /></label>
      <button className="auth-button" type="submit" disabled={loading}>{loading ? "Signing you in…" : "Sign in"}</button>
    </form>
    <div className="auth-links"><Link to="/forgot-password">Forgot your password?</Link><span>New to TourVisito? <Link to="/register">Create an account</Link></span></div>
    <p className="auth-footer">Created by Nawas Mushrif © 2026</p>
  </section></div>;
};

export default Login;
