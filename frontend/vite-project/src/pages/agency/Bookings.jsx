import React, { useState, useEffect } from "react";
import API from "../../api/api";

const AgencyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchAgencyBookings();
  }, []);

  const fetchAgencyBookings = async () => {
    try {
      // You'll need to create this endpoint
      const response = await API.get("/bookings/agency");
      setBookings(response.data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  return (
    <div style={{ padding: "40px 20px" }}>
      <h1>All Bookings for My Trips</h1>
      {/* Display bookings table here */}
    </div>
  );
};

export default AgencyBookings;