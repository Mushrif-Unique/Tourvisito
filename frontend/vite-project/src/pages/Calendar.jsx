import React from "react";
import BookingCalendar from "../components/BookingCalendar";

const Calendar = () => {
  return (
    <div style={container}>
      <h1 style={title}>System-Wide Booking Calendar</h1>
      <p style={subtitle}>View all bookings across all trips</p>
      <BookingCalendar />
    </div>
  );
};

const container = { padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" };
const title = { fontSize: "32px", fontWeight: "800", color: "#112647", marginBottom: "8px" };
const subtitle = { fontSize: "16px", color: "#64748b", marginBottom: "30px" };

export default Calendar;