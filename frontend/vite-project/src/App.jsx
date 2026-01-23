import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Trips from "./pages/Trips";
import Booking from "./pages/Booking";
import AIItinerary from "./pages/AIItinerary";

// User Pages
import MyBookings from "./pages/MyBookings";
import Calendar from "./pages/Calendar";

// Agency Pages
import AgencyDashboard from "./pages/agency/Dashboard";
import AgencyTrips from "./pages/agency/MyTrips";
import AgencyBookings from "./pages/agency/Bookings";
import AgencyCalendar from "./pages/agency/Calendar";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminBookings from "./pages/admin/Bookings";
import AdminUsers from "./pages/admin/Users";

/* ✅ AUTH CHECK */
const isAuthenticated = () => !!localStorage.getItem("token");

/* ✅ GET USER ROLE */
const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.role || "traveler"; // ✅ default traveler
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

/* ✅ PROTECTED ROUTE */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  if (allowedRoles.length === 0) return children;

  const userRole = getUserRole();
  if (!allowedRoles.includes(userRole)) return <Navigate to="/" replace />;

  return children;
};

/* ✅ PUBLIC ROUTE */
const PublicRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/" replace /> : children;
};

/* ✅ ROLE-BASED HOME REDIRECT */
const RoleBasedHome = () => {
  const role = getUserRole();
  switch (role) {
    case "admin":
      return <Navigate to="/admin/dashboard" replace />;
    case "agency":
      return <Navigate to="/agency/dashboard" replace />;
    default:
      return <Home />; // ✅ traveler
  }
};

const App = () => {
  return (
    <Router>
      <div style={appShell}>
        <Navbar />

        <main style={mainContent}>
          <Routes>
            {/* 🔒 Role-Based Home */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <RoleBasedHome />
                </ProtectedRoute>
              }
            />

            {/* 🌐 Public Routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

            {/* 🔓 Public Trips */}
            <Route path="/trips" element={<Trips />} />

            {/* 🔒 TRAVELER ROUTES */}
            <Route path="/my-bookings" element={<ProtectedRoute allowedRoles={["traveler"]}><MyBookings /></ProtectedRoute>} />
            <Route path="/booking" element={<ProtectedRoute allowedRoles={["traveler"]}><Booking /></ProtectedRoute>} />

            {/* 🔒 AGENCY ROUTES */}
            <Route path="/agency/dashboard" element={<ProtectedRoute allowedRoles={["agency"]}><AgencyDashboard /></ProtectedRoute>} />
            <Route path="/agency/my-trips" element={<ProtectedRoute allowedRoles={["agency"]}><AgencyTrips /></ProtectedRoute>} />
            <Route path="/agency/bookings" element={<ProtectedRoute allowedRoles={["agency"]}><AgencyBookings /></ProtectedRoute>} />
            <Route path="/agency/calendar" element={<ProtectedRoute allowedRoles={["agency"]}><AgencyCalendar /></ProtectedRoute>} />

            {/* 🔒 ADMIN ROUTES */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={["admin"]}><AdminBookings /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><AdminUsers /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute allowedRoles={["admin"]}><Calendar /></ProtectedRoute>} />

            {/* 🔒 AI ITINERARY */}
            <Route path="/ai" element={<ProtectedRoute><AIItinerary /></ProtectedRoute>} />

            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

/* --- STYLES --- */
const appShell = { display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%" };
const mainContent = { flex: "1", maxWidth: "1440px", margin: "0 auto", padding: "0 20px" };

export default App;
