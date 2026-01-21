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

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login to access this page");
    return <Navigate to="/login" />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <div style={appShell}>
        <Navbar /> {/* Stretches to full width, but content inside should be centered */}
        
        {/* MAIN CONTENT WRAPPER - This fixes your left-align issue */}
        <main style={mainContent}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/trips" element={<Trips />} />

            {/* Protected routes */}
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

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

/* --- LAYOUT STYLES --- */

const appShell = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  width: "100%",
  backgroundColor: "var(--color-bg)",
};

const mainContent = {
  flex: "1 0 auto", // Pushes footer to the bottom
  width: "100%",
  maxWidth: "1440px", // Limits the width on giant monitors
  margin: "0 auto",    // THE MAGIC FIX: Centers the content horizontally
  padding: "0 20px",   // Prevents content from touching edges on mobile
  boxSizing: "border-box",
};

export default App;