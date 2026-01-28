import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const AgencyDashboard = () => {
  // Add responsive styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 1024px) {
        .agency-stats-grid {
          grid-template-columns: repeat(2, 1fr) !important;
        }
      }
      @media (max-width: 640px) {
        .agency-stats-grid {
          grid-template-columns: 1fr !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  // Mock stats for agency
  const mockStats = [
    { label: "Active Trips", value: "8", icon: "🗺️" },
    { label: "Total Bookings", value: "24", icon: "📋" },
    { label: "Monthly Revenue", value: "$8,450", icon: "💰" },
    { label: "Upcoming Trips", value: "5", icon: "🚀" }
  ];

  const mockTrips = [
    { id: 1, title: "Paris City Tour", destination: "Paris", days: 5, price: 1299, bookings: 3, status: "Active" },
    { id: 2, title: "Tokyo Adventure", destination: "Tokyo", days: 7, price: 1899, bookings: 2, status: "Active" },
    { id: 3, title: "New York Escape", destination: "NYC", days: 4, price: 899, bookings: 4, status: "Coming Soon" }
  ];

  const mockBookings = [
    { id: "B1", traveler: "John Smith", trip: "Paris City Tour", date: "2024-02-15", status: "confirmed" },
    { id: "B2", traveler: "Sarah Johnson", trip: "Tokyo Adventure", date: "2024-03-10", status: "pending" },
    { id: "B3", traveler: "Michael Chen", trip: "New York Escape", date: "2024-02-20", status: "confirmed" }
  ];

  return (
    <div style={container}>
      <div style={headerSection}>
        <h1 style={pageTitle}>Agency Dashboard</h1>
        <p style={pageSubtitle}>Manage your trips and bookings</p>
      </div>

      {/* Quick Stats */}
      <div style={statsGrid} className="agency-stats-grid">
        {mockStats.map((stat, idx) => (
          <div key={idx} style={statCard}>
            <div style={statIcon}>{stat.icon}</div>
            <div style={statValue}>{stat.value}</div>
            <div style={statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Access Cards */}
      <div style={sectionTitle}>Quick Access</div>
      <div style={grid}>
        <Link to="/agency/my-trips" style={card}>
          <div style={icon}>🗺️</div>
          <h3>My Trips</h3>
          <p>Manage your trips</p>
        </Link>
        <Link to="/agency/bookings" style={card}>
          <div style={icon}>📋</div>
          <h3>All Bookings</h3>
          <p>View all bookings</p>
        </Link>
        <Link to="/agency/calendar" style={card}>
          <div style={icon}>📅</div>
          <h3>Calendar</h3>
          <p>Booking schedule</p>
        </Link>
      </div>

      {/* Recent Trips Section */}
      <div style={sectionTitle}>My Active Trips</div>
      <div style={tripsGrid}>
        {mockTrips.map(trip => (
          <div key={trip.id} style={tripCard}>
            <div style={tripHeader}>
              <h4 style={tripTitle}>{trip.title}</h4>
              <span style={{...tripBadge, backgroundColor: trip.status === "Active" ? "#d1fae5" : "#fef3c7", color: trip.status === "Active" ? "#065f46" : "#92400e"}}>{trip.status}</span>
            </div>
            <div style={tripDetails}>
              <p style={tripItem}><strong>📍 Location:</strong> {trip.destination}</p>
              <p style={tripItem}><strong>⏱️ Duration:</strong> {trip.days} days</p>
              <p style={tripItem}><strong>💵 Price:</strong> ${trip.price}</p>
              <p style={tripItem}><strong>📊 Bookings:</strong> {trip.bookings}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings Section */}
      <div style={sectionTitle}>Recent Bookings</div>
      <div style={bookingsCard}>
        {mockBookings.length === 0 ? (
          <p style={{textAlign: "center", color: "#64748b"}}>No recent bookings</p>
        ) : (
          <div style={bookingsList}>
            {mockBookings.map(booking => (
              <div key={booking.id} style={bookingItem}>
                <div style={bookingInfo}>
                  <p style={bookingTraveler}>{booking.traveler}</p>
                  <p style={bookingTrip}>{booking.trip}</p>
                </div>
                <div style={bookingMeta}>
                  <span style={bookingDate}>{new Date(booking.date).toLocaleDateString()}</span>
                  <span style={{
                    padding: "4px 12px",
                    borderRadius: "20px",
                    backgroundColor: booking.status === "confirmed" ? "#d1fae5" : "#fef3c7",
                    color: booking.status === "confirmed" ? "#065f46" : "#92400e",
                    fontSize: "12px",
                    fontWeight: "600"
                  }}>
                    {booking.status === "confirmed" ? "✓ Confirmed" : "⏳ Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
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
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", marginBottom: "40px" };
const card = { padding: "30px", backgroundColor: "#fff", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", textDecoration: "none", color: "inherit", textAlign: "center", transition: "all 0.3s", cursor: "pointer" };
const icon = { fontSize: "48px", marginBottom: "15px" };
const tripsGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px", marginBottom: "40px" };
const tripCard = { padding: "24px", backgroundColor: "#fff", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", borderLeft: "4px solid #667eea" };
const tripHeader = { display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" };
const tripTitle = { fontSize: "16px", fontWeight: "700", color: "#112647", margin: "0" };
const tripBadge = { display: "inline-block", padding: "4px 12px", backgroundColor: "#f0f4ff", color: "#667eea", borderRadius: "20px", fontSize: "12px", fontWeight: "600" };
const tripDetails = { display: "flex", flexDirection: "column", gap: "8px" };
const tripItem = { fontSize: "14px", color: "#495057", margin: "0" };
const bookingsCard = { padding: "24px", backgroundColor: "#fff", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: "40px" };
const bookingsList = { display: "flex", flexDirection: "column", gap: "16px" };
const bookingItem = { display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid #e2e8f0" };
const bookingInfo = { flex: "1" };
const bookingTraveler = { fontSize: "14px", fontWeight: "600", color: "#112647", margin: "0" };
const bookingTrip = { fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" };
const bookingMeta = { display: "flex", gap: "12px", alignItems: "center" };
const bookingDate = { fontSize: "13px", color: "#64748b" };

export default AgencyDashboard;