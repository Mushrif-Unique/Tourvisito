import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  // Add responsive styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 1024px) {
        .admin-stats-grid {
          grid-template-columns: repeat(2, 1fr) !important;
        }
      }
      @media (max-width: 640px) {
        .admin-stats-grid {
          grid-template-columns: 1fr !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const mockTrips = [
    { id: 1, title: "Paris City Tour", destination: "Paris", days: 5, price: 1299, bookings: 8 },
    { id: 2, title: "Tokyo Adventure", destination: "Tokyo", days: 7, price: 1899, bookings: 5 },
    { id: 3, title: "New York Escape", destination: "NYC", days: 4, price: 899, bookings: 12 }
  ];

  const mockStats = [
    { label: "Total Users", value: "248", icon: "👥" },
    { label: "Active Bookings", value: "42", icon: "📋" },
    { label: "Total Revenue", value: "$125k", icon: "💰" },
    { label: "Trip Destinations", value: "23", icon: "🌍" }
  ];

  return (
    <div style={container}>
      <div style={headerSection}>
        <h1 style={pageTitle}>Admin Dashboard</h1>
        <p style={pageSubtitle}>Manage your travel platform</p>
      </div>

      {/* Quick Stats */}
      <div style={statsGrid} className="admin-stats-grid">
        {mockStats.map((stat, idx) => (
          <div key={idx} style={statCard}>
            <div style={statIcon}>{stat.icon}</div>
            <div style={statValue}>{stat.value}</div>
            <div style={statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Navigation Cards */}
      <div style={sectionTitle}>Quick Access</div>
      <div style={grid}>
        <Link to="/trips" style={card}>
          <div style={icon}>🗺️</div>
          <h3>All Trips</h3>
          <p>Manage all trips</p>
        </Link>
        <Link to="/admin/bookings" style={card}>
          <div style={icon}>📋</div>
          <h3>All Bookings</h3>
          <p>System-wide bookings</p>
        </Link>
        <Link to="/admin/users" style={card}>
          <div style={icon}>👥</div>
          <h3>Users</h3>
          <p>Manage users</p>
        </Link>
        <Link to="/calendar" style={card}>
          <div style={icon}>📅</div>
          <h3>Calendar</h3>
          <p>All bookings calendar</p>
        </Link>
      </div>

      {/* Mock Trip Plans */}
      <div style={sectionTitle}>Featured Trip Plans</div>
      <div style={tripsGrid}>
        {mockTrips.map(trip => (
          <div key={trip.id} style={tripCard}>
            <div style={tripHeader}>
              <h4 style={tripTitle}>{trip.title}</h4>
              <span style={tripBadge}>{trip.bookings} bookings</span>
            </div>
            <div style={tripDetails}>
              <p style={tripItem}><strong>📍 Location:</strong> {trip.destination}</p>
              <p style={tripItem}><strong>⏱️ Duration:</strong> {trip.days} days</p>
              <p style={tripItem}><strong>💵 Price:</strong> ${trip.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const container = { padding: "40px 20px", maxWidth: "1400px", margin: "0 auto" };
const headerSection = { marginBottom: "40px" };
const pageTitle = { fontSize: "36px", fontWeight: "800", color: "#112647", margin: "0 0 8px 0" };
const pageSubtitle = { fontSize: "16px", color: "#64748b", margin: "0" };
const statsGrid = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "40px" };
const statCard = { padding: "24px", backgroundColor: "#fff", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", textAlign: "center" };
const statIcon = { fontSize: "36px", marginBottom: "12px" };
const statValue = { fontSize: "28px", fontWeight: "800", color: "#112647", margin: "0" };
const statLabel = { fontSize: "13px", color: "#64748b", marginTop: "8px", textTransform: "uppercase", letterSpacing: "0.5px" };
const sectionTitle = { fontSize: "20px", fontWeight: "700", color: "#112647", margin: "40px 0 20px 0" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" };
const card = { padding: "30px", backgroundColor: "#fff", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", textDecoration: "none", color: "inherit", textAlign: "center", transition: "all 0.3s", cursor: "pointer" };
const icon = { fontSize: "48px", marginBottom: "15px" };
const tripsGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" };
const tripCard = { padding: "24px", backgroundColor: "#fff", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", borderLeft: "4px solid #667eea" };
const tripHeader = { display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" };
const tripTitle = { fontSize: "16px", fontWeight: "700", color: "#112647", margin: "0" };
const tripBadge = { display: "inline-block", padding: "4px 12px", backgroundColor: "#f0f4ff", color: "#667eea", borderRadius: "20px", fontSize: "12px", fontWeight: "600" };
const tripDetails = { display: "flex", flexDirection: "column", gap: "8px" };
const tripItem = { fontSize: "14px", color: "#495057", margin: "0" };

export default AdminDashboard;