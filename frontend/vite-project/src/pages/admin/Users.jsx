import React, { useState, useEffect } from "react";
import API from "../../api/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await API.get("/users/admin/all");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <div style={{ padding: "40px 20px" }}>
      <h1>User Management</h1>
      {/* Display users table */}
    </div>
  );
};

export default AdminUsers;