import React, { useState, useEffect } from "react";
import API from "../../api/api";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      // You'll need to create this endpoint
      const response = await API.get("/bookings/admin/all");
      setBookings(response.data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  return (
    <div style={{ padding: "40px 20px" }}>
      <h1>All System Bookings</h1>
      {/* Display all bookings table */}
    </div>
  );
};

export default AdminBookings;