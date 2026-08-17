import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState(""); const [loading, setLoading] = useState(false); const [error, setError] = useState(""); const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (event) => { event.preventDefault(); setLoading(true); setError(""); try { await API.post("/users/forgot-password", { email }); setSuccess(true); setEmail(""); setTimeout(() => navigate("/login"), 3000); } catch (err) { setError(err.response?.data?.message || "Failed to send reset link"); } finally { setLoading(false); } };
  return <div className="auth-page"><section className="auth-card" aria-labelledby="forgot-title"><div className="auth-brand"><span className="auth-brand-mark">✦</span> TourVisito</div><h1 id="forgot-title" className="auth-heading">Reset your password</h1><p className="auth-subtitle">Enter your email and we’ll send a secure link to get you back on track.</p>{error && <div className="auth-error" role="alert">{error}</div>}{success && <div className="auth-success" role="status">Check your inbox for the reset link. Redirecting to sign in…</div>}<form className="auth-form" onSubmit={handleSubmit}><label className="auth-field"><span className="auth-label">Email address</span><input className="auth-input" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={success} autoComplete="email" /></label><button className="auth-button" type="submit" disabled={loading || success}>{loading ? "Sending link…" : "Send reset link"}</button></form><div className="auth-links"><span>Remembered it? <Link to="/login">Back to sign in</Link></span></div></section></div>;
};
export default ForgotPassword;
