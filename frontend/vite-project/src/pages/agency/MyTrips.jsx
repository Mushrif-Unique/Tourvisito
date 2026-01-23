import React, { useState, useEffect } from "react";
import API from "../../api/api";

const AgencyTrips = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    fetchMyTrips();
  }, []);

  const fetchMyTrips = async () => {
    try {
      // You'll need to create this endpoint
      const response = await API.get("/trips/my-trips");
      setTrips(response.data.trips);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  return (
    <div style={{ padding: "40px 20px" }}>
      <h1>My Trips</h1>
      <button style={createBtn}>+ Create New Trip</button>
      {/* Display trips here */}
    </div>
  );
};

const createBtn = { padding: "12px 24px", backgroundColor: "#667eea", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer" };

export default AgencyTrips;