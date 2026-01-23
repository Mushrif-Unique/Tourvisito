import React, { useState, useEffect } from "react";

const BookingCalendar = ({ tripId }) => {
  const [bookings, setBookings] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [tripId, currentDate]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const response = await fetch(
        `http://localhost:5000/api/v1/bookings/calendar/${tripId}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error("Error fetching calendar:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const isDateBooked = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return bookings.filter(booking => {
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
    const bookedOnDay = isDateBooked(day);
    if (bookedOnDay.length > 0) {
      setSelectedBooking(bookedOnDay[0]);
    }
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
    const bookedOnDay = isDateBooked(day);
    const isBooked = bookedOnDay.length > 0;
    const isToday = day === new Date().getDate() && 
                    currentDate.getMonth() === new Date().getMonth() &&
                    currentDate.getFullYear() === new Date().getFullYear();

    calendarDays.push(
      <div
        key={day}
        style={{
          ...dayCell,
          ...(isBooked && bookedDay),
          ...(isToday && todayStyle),
        }}
        onClick={() => handleDayClick(day)}
      >
        <span style={dayNumber}>{day}</span>
        {isBooked && <div style={bookingIndicator}>{bookedOnDay.length}</div>}
      </div>
    );
  }

  return (
    <div style={container}>
      <div style={header}>
        <h2 style={title}>📅 Booking Calendar</h2>
        <p style={subtitle}>View booked dates for this trip</p>
      </div>

      {loading ? (
        <div style={loadingStyle}>Loading calendar...</div>
      ) : (
        <>
          <div style={calendarHeader}>
            <button onClick={handlePrevMonth} style={navButton}>◀</button>
            <h3 style={monthTitle}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button onClick={handleNextMonth} style={navButton}>▶</button>
          </div>

          <div style={calendarGrid}>
            {dayNames.map(day => (
              <div key={day} style={dayName}>{day}</div>
            ))}
            {calendarDays}
          </div>

          <div style={legend}>
            <div style={legendItem}>
              <div style={{...legendBox, backgroundColor: "#e8f5e9"}}></div>
              <span>Available</span>
            </div>
            <div style={legendItem}>
              <div style={{...legendBox, backgroundColor: "#ffebee"}}></div>
              <span>Booked</span>
            </div>
            <div style={legendItem}>
              <div style={{...legendBox, border: "2px solid #667eea"}}></div>
              <span>Today</span>
            </div>
          </div>

          {selectedBooking && (
            <div style={bookingDetails}>
              <div style={detailsHeader}>
                <h4 style={detailsTitle}>Booking Details</h4>
                <button onClick={() => setSelectedBooking(null)} style={closeButton}>✕</button>
              </div>
              <div style={detailRow}>
                <strong>Start Date:</strong>
                <span>{new Date(selectedBooking.startDate).toLocaleDateString()}</span>
              </div>
              <div style={detailRow}>
                <strong>End Date:</strong>
                <span>{new Date(selectedBooking.endDate).toLocaleDateString()}</span>
              </div>
              <div style={detailRow}>
                <strong>Travelers:</strong>
                <span>{selectedBooking.travelers}</span>
              </div>
              <div style={detailRow}>
                <strong>Status:</strong>
                <span style={statusBadge(selectedBooking.status)}>
                  {selectedBooking.status}
                </span>
              </div>
            </div>
          )}

          <div style={statsBox}>
            <div style={statItem}>
              <div style={statNumber}>{bookings.length}</div>
              <div style={statLabel}>Total Bookings</div>
            </div>
            <div style={statItem}>
              <div style={statNumber}>
                {bookings.reduce((sum, b) => sum + b.travelers, 0)}
              </div>
              <div style={statLabel}>Total Travelers</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Styles
const container = {
  maxWidth: "800px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "24px",
  padding: "40px",
  boxShadow: "0 20px 40px rgba(17, 38, 71, 0.08)"
};

const header = {
  textAlign: "center",
  marginBottom: "30px"
};

const title = {
  fontSize: "28px",
  fontWeight: "800",
  color: "#1e293b",
  margin: "0 0 10px 0"
};

const subtitle = {
  fontSize: "14px",
  color: "#64748b",
  margin: "0"
};

const calendarHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px"
};

const monthTitle = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#667eea",
  margin: "0"
};

const navButton = {
  backgroundColor: "#f1f5f9",
  border: "none",
  padding: "10px 20px",
  borderRadius: "10px",
  fontSize: "18px",
  cursor: "pointer",
  transition: "all 0.2s"
};

const calendarGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "8px",
  marginBottom: "30px"
};

const dayName = {
  textAlign: "center",
  fontSize: "12px",
  fontWeight: "700",
  color: "#64748b",
  padding: "10px",
  textTransform: "uppercase"
};

const emptyDay = {
  padding: "10px"
};

const dayCell = {
  position: "relative",
  padding: "15px",
  textAlign: "center",
  borderRadius: "12px",
  backgroundColor: "#e8f5e9",
  cursor: "pointer",
  transition: "all 0.2s",
  minHeight: "60px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center"
};

const bookedDay = {
  backgroundColor: "#ffebee",
  fontWeight: "700"
};

const todayStyle = {
  border: "2px solid #667eea",
  fontWeight: "700"
};

const dayNumber = {
  fontSize: "16px",
  color: "#1e293b"
};

const bookingIndicator = {
  marginTop: "4px",
  backgroundColor: "#667eea",
  color: "white",
  borderRadius: "50%",
  width: "20px",
  height: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "10px",
  fontWeight: "700"
};

const legend = {
  display: "flex",
  justifyContent: "center",
  gap: "20px",
  marginBottom: "30px",
  padding: "15px",
  backgroundColor: "#f8f9fa",
  borderRadius: "12px"
};

const legendItem = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "14px",
  color: "#495057"
};

const legendBox = {
  width: "20px",
  height: "20px",
  borderRadius: "4px"
};

const bookingDetails = {
  backgroundColor: "#f8f9fa",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "20px",
  border: "1px solid #e9ecef"
};

const detailsHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "15px"
};

const detailsTitle = {
  fontSize: "16px",
  fontWeight: "700",
  color: "#667eea",
  margin: "0"
};

const closeButton = {
  backgroundColor: "transparent",
  border: "none",
  fontSize: "20px",
  cursor: "pointer",
  color: "#64748b"
};

const detailRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
  fontSize: "14px",
  color: "#495057"
};

const statusBadge = (status) => ({
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
  backgroundColor: status === "confirmed" ? "#d4edda" : "#fff3cd",
  color: status === "confirmed" ? "#155724" : "#856404"
});

const statsBox = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px"
};

const statItem = {
  textAlign: "center",
  padding: "20px",
  backgroundColor: "#f8f9fa",
  borderRadius: "12px",
  border: "1px solid #e9ecef"
};

const statNumber = {
  fontSize: "32px",
  fontWeight: "800",
  color: "#667eea",
  marginBottom: "5px"
};

const statLabel = {
  fontSize: "14px",
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.5px"
};

const loadingStyle = {
  textAlign: "center",
  padding: "40px",
  fontSize: "16px",
  color: "#6c757d"
};

export default BookingCalendar;