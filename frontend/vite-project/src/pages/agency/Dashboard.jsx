import React from "react";
import { Link } from "react-router-dom";

const AgencyDashboard = () => {
  return (
    <div style={container}>
      <h1>Agency Dashboard</h1>
      <div style={grid}>
        <Link to="/agency/my-trips" style={card}>
          <div style={icon}>🗺️</div>
          <h3>My Trips</h3>
          <p>Manage your trips</p>
        </Link>
        <Link to="/agency/bookings" style={card}>
          <div style={icon}>📋</div>
          <h3>Bookings</h3>
          <p>View all bookings</p>
        </Link>
        <Link to="/agency/calendar" style={card}>
          <div style={icon}>📅</div>
          <h3>Calendar</h3>
          <p>Booking schedule</p>
        </Link>
      </div>
    </div>
  );
};

const container = { padding: "40px 20px" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", marginTop: "30px" };
const card = { padding: "30px", backgroundColor: "#fff", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", textDecoration: "none", color: "inherit", textAlign: "center", transition: "transform 0.2s" };
const icon = { fontSize: "48px", marginBottom: "15px" };

export default AgencyDashboard;