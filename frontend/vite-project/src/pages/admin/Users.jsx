import React, { useState, useEffect } from "react";
import API from "../../api/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await API.get("/users/admin/all");
      setUsers(response.data.users || []);
      setError("");
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <h1>User Management</h1>
      {loading ? (
        <p style={loadingText}>Loading users...</p>
      ) : error ? (
        <p style={errorText}>{error}</p>
      ) : users.length === 0 ? (
        <p style={emptyText}>No users registered yet.</p>
      ) : (
        <div style={tableWrapper}>
          <table style={table}>
            <thead>
              <tr style={headerRow}>
                <th style={headerCell}>Name</th>
                <th style={headerCell}>Email</th>
                <th style={headerCell}>Role</th>
                <th style={headerCell}>Joined</th>
                <th style={headerCell}>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={bodyRow}>
                  <td style={bodyCell}>{u.name}</td>
                  <td style={bodyCell}>{u.email}</td>
                  <td style={bodyCell}><span style={roleBadge(u.role)}>{u.role}</span></td>
                  <td style={bodyCell}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={bodyCell}><span style={statusBadge(u.isActive)}>{u.isActive ? "Active" : "Inactive"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const container = { padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" };
const loadingText = { textAlign: "center", color: "#64748b", fontSize: "16px" };
const errorText = { color: "#c41e3a", padding: "16px", backgroundColor: "#fff5f5", borderRadius: "8px" };
const emptyText = { textAlign: "center", color: "#64748b", fontSize: "16px" };
const tableWrapper = { overflowX: "auto" };
const table = { width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" };
const headerRow = { backgroundColor: "#f8f9fa", borderBottom: "2px solid #e9ecef" };
const headerCell = { padding: "16px 12px", textAlign: "left", fontWeight: "700", color: "#112647", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" };
const bodyRow = { borderBottom: "1px solid #e9ecef", transition: "background-color 0.2s" };
const bodyCell = { padding: "14px 12px", fontSize: "14px", color: "#495057" };
const roleBadge = (role) => ({
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
  backgroundColor: role === "admin" ? "#fee" : role === "agency" ? "#f0f4ff" : "#f0fdf4",
  color: role === "admin" ? "#c41e3a" : role === "agency" ? "#667eea" : "#15803d"
});
const statusBadge = (isActive) => ({
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
  backgroundColor: isActive ? "#f0fdf4" : "#fef2f2",
  color: isActive ? "#15803d" : "#991b1b"
});

export default AdminUsers;