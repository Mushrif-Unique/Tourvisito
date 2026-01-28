import React, { useState, useEffect } from "react";
import API from "../../api/api";

const AgencyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mockBookings] = useState([
    { id: "1", tripName: "Paris City Tour", startDate: new Date(2024, 1, 10), endDate: new Date(2024, 1, 15), travelers: 2, status: "confirmed" },
    { id: "2", tripName: "Tokyo Adventure", startDate: new Date(2024, 1, 18), endDate: new Date(2024, 1, 25), travelers: 1, status: "confirmed" },
    { id: "3", tripName: "NYC Escape", startDate: new Date(2024, 1, 28), endDate: new Date(2024, 2, 3), travelers: 3, status: "pending" },
    { id: "4", tripName: "Paris City Tour", startDate: new Date(2024, 2, 5), endDate: new Date(2024, 2, 10), travelers: 1, status: "confirmed" }
  ]);
  const [selectedDay, setSelectedDay] = useState(null);

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getBookingsForDay = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return mockBookings.filter(booking => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      return date >= start && date <= end;
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate calendar grid
  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(<div key={`empty-${i}`} style={emptyDay}></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dayBookings = getBookingsForDay(day);
    const isBooked = dayBookings.length > 0;
    const isToday = day === new Date().getDate() && 
                    currentDate.getMonth() === new Date().getMonth() &&
                    currentDate.getFullYear() === new Date().getFullYear();
    const isSelected = day === selectedDay;

    calendarDays.push(
      <div
        key={day}
        onClick={() => handleDayClick(day)}
        style={{
          ...dayCell,
          ...(isBooked && bookedDay),
          ...(isToday && todayStyle),
          ...(isSelected && selectedDayStyle),
        }}
      >
        <span style={dayNumber}>{day}</span>
        {isBooked && <div style={bookingIndicator}>{dayBookings.length}</div>}
      </div>
    );
  }

  const selectedBookings = selectedDay ? getBookingsForDay(selectedDay) : [];

  return (
    <div style={container}>
      <div style={headerSection}>
        <h1 style={pageTitle}>Booking Calendar</h1>
        <p style={pageSubtitle}>Track all bookings for your trips</p>
      </div>

      <div style={calendarWrapper}>
        {/* Month Navigation */}
        <div style={monthHeader}>
          <button onClick={handlePrevMonth} style={navBtn}>←</button>
          <h2 style={monthTitle}>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <button onClick={handleNextMonth} style={navBtn}>→</button>
        </div>

        {/* Day Names */}
        <div style={dayNamesRow}>
          {dayNames.map(day => (
            <div key={day} style={dayNameCell}>{day}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={calendarGrid}>
          {calendarDays}
        </div>
      </div>

      {/* Selected Day Details */}
      {selectedDay && (
        <div style={selectedDaySection}>
          <h3 style={selectedDayTitle}>
            Bookings for {monthNames[currentDate.getMonth()]} {selectedDay}, {currentDate.getFullYear()}
          </h3>
          
          {selectedBookings.length === 0 ? (
            <p style={{ color: "#64748b", textAlign: "center", padding: "20px" }}>No bookings on this day</p>
          ) : (
            <div style={bookingsList}>
              {selectedBookings.map(booking => (
                <div key={booking.id} style={bookingCard}>
                  <div style={bookingCardHeader}>
                    <h4 style={bookingCardTitle}>{booking.tripName}</h4>
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
                  <div style={bookingCardDetails}>
                    <p><strong>📅 Duration:</strong> {booking.startDate.toLocaleDateString()} - {booking.endDate.toLocaleDateString()}</p>
                    <p><strong>👥 Travelers:</strong> {booking.travelers}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const container = { padding: "40px 20px", maxWidth: "1400px", margin: "0 auto" };
const headerSection = { marginBottom: "40px" };
const pageTitle = { fontSize: "32px", fontWeight: "800", color: "#112647", margin: "0 0 8px 0" };
const pageSubtitle = { fontSize: "14px", color: "#64748b", margin: "0" };
const calendarWrapper = { backgroundColor: "#fff", borderRadius: "16px", padding: "30px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: "40px" };
const monthHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" };
const monthTitle = { fontSize: "24px", fontWeight: "800", color: "#112647", margin: "0" };
const navBtn = { backgroundColor: "#667eea", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "16px", fontWeight: "600" };
const dayNamesRow = { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0", marginBottom: "10px" };
const dayNameCell = { padding: "12px", textAlign: "center", fontWeight: "700", color: "#64748b", fontSize: "12px" };
const calendarGrid = { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" };
const emptyDay = { backgroundColor: "#f8fafc", borderRadius: "8px" };
const dayCell = { padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px", cursor: "pointer", textAlign: "center", position: "relative", minHeight: "80px", display: "flex", flexDirection: "column", justifyContent: "flex-start", transition: "all 0.3s" };
const bookedDay = { backgroundColor: "#e0e7ff", borderLeft: "4px solid #667eea" };
const todayStyle = { backgroundColor: "#fef3c7", border: "2px solid #f59e0b" };
const selectedDayStyle = { backgroundColor: "#dbeafe", border: "2px solid #667eea" };
const dayNumber = { fontSize: "14px", fontWeight: "600", color: "#112647" };
const bookingIndicator = { marginTop: "4px", fontSize: "11px", backgroundColor: "#667eea", color: "white", borderRadius: "12px", padding: "2px 6px", display: "inline-block" };
const selectedDaySection = { backgroundColor: "#fff", borderRadius: "16px", padding: "30px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" };
const selectedDayTitle = { fontSize: "20px", fontWeight: "700", color: "#112647", margin: "0 0 20px 0" };
const bookingsList = { display: "flex", flexDirection: "column", gap: "16px" };
const bookingCard = { padding: "16px", backgroundColor: "#f8fafc", borderRadius: "12px", borderLeft: "4px solid #667eea" };
const bookingCardHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" };
const bookingCardTitle = { fontSize: "16px", fontWeight: "700", color: "#112647", margin: "0" };
const bookingCardDetails = { fontSize: "14px", color: "#495057" };

export default AgencyCalendar;