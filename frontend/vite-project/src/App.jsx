import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Trips from "./pages/Trips";
import Booking from "./pages/Booking";
import AIItinerary from "./pages/AIItinerary";

/* ✅ AUTH CHECK */
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

/* ✅ PROTECTED ROUTE */
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

/* ✅ PUBLIC ROUTE (Login/Register) */
const PublicRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/" replace /> : children;
};

const App = () => {
  return (
    <Router>
      <div style={appShell}>
        <Navbar />

        <main style={mainContent}>
          <Routes>
            {/* 🔒 Protected Home */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            {/* 🌐 Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            <Route path="/trips" element={<Trips />} />

            {/* 🔒 Protected Routes */}
            <Route
              path="/booking"
              element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai"
              element={
                <ProtectedRoute>
                  <AIItinerary />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

/* --- STYLES --- */
const appShell = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  width: "100%",
};

const mainContent = {
  flex: "1",
  maxWidth: "1440px",
  margin: "0 auto",
  padding: "0 20px",
};

export default App;
