import React, { useState, useEffect } from "react";
import API from "../api/api";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const response = await API.get("/bookings");
      setBookings(response.data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <h1>My Bookings</h1>
      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        <div style={bookingGrid}>
          {bookings.map(booking => (
            <div key={booking._id} style={bookingCard}>
              <h3>{booking.trip?.title}</h3>
              <p>Start: {new Date(booking.startDate).toLocaleDateString()}</p>
              <p>Status: {booking.status}</p>
              <p>Amount: ${booking.totalAmount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const container = { padding: "40px 20px" };
const bookingGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" };
const bookingCard = { padding: "20px", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" };

export default MyBookings;