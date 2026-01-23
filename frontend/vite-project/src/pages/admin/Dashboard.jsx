import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div style={container}>
      <h1>Admin Dashboard</h1>
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
    </div>
  );
};

const container = { padding: "40px 20px" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", marginTop: "30px" };
const card = { padding: "30px", backgroundColor: "#fff", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", textDecoration: "none", color: "inherit", textAlign: "center" };
const icon = { fontSize: "48px", marginBottom: "15px" };

export default AdminDashboard;