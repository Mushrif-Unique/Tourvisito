import React, { useState, useEffect } from "react";
import API from "../../api/api";

const AgencyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Mock bookings data
  const mockBookings = [
    {
      id: "1",
      travelerName: "John Smith",
      tripName: "Paris City Tour",
      tripId: "trip_1",
      date: "2024-02-15",
      status: "confirmed",
      paymentStatus: "paid",
      travelers: 2,
      totalAmount: 2598,
      createdAt: "2024-01-28"
    },
    {
      id: "2",
      travelerName: "Sarah Johnson",
      tripName: "Tokyo Adventure",
      tripId: "trip_2",
      date: "2024-03-10",
      status: "pending",
      paymentStatus: "pending",
      travelers: 1,
      totalAmount: 1899,
      createdAt: "2024-01-27"
    },
    {
      id: "3",
      travelerName: "Michael Chen",
      tripName: "New York Escape",
      tripId: "trip_3",
      date: "2024-02-20",
      status: "confirmed",
      paymentStatus: "paid",
      travelers: 3,
      totalAmount: 2697,
      createdAt: "2024-01-26"
    },
    {
      id: "4",
      travelerName: "Emma Wilson",
      tripName: "Paris City Tour",
      tripId: "trip_1",
      date: "2024-04-05",
      status: "cancelled",
      paymentStatus: "refunded",
      travelers: 2,
      totalAmount: 2598,
      createdAt: "2024-01-25"
    },
    {
      id: "5",
      travelerName: "David Brown",
      tripName: "Tokyo Adventure",
      tripId: "trip_2",
      date: "2024-03-20",
      status: "confirmed",
      paymentStatus: "paid",
      travelers: 1,
      totalAmount: 1899,
      createdAt: "2024-01-24"
    }
  ];

  useEffect(() => {
    fetchAgencyBookings();
  }, []);

  const fetchAgencyBookings = async () => {
    setLoading(true);
    try {
      // Try to fetch from backend, fall back to mock data
      const response = await API.get("/bookings/agency/all");
      setBookings(response.data.bookings || mockBookings);
    } catch (error) {
      console.error("Error fetching bookings, using mock data:", error);
      setBookings(mockBookings);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      confirmed: { bg: "#d1fae5", color: "#065f46", label: "Confirmed" },
      pending: { bg: "#fef3c7", color: "#92400e", label: "Pending" },
      cancelled: { bg: "#fee2e2", color: "#991b1b", label: "Cancelled" }
    };
    const style = statusMap[status] || statusMap.pending;
    return (
      <span style={{
        padding: "6px 12px",
        borderRadius: "20px",
        backgroundColor: style.bg,
        color: style.color,
        fontSize: "12px",
        fontWeight: "600",
      }}>
        {style.label}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const statusMap = {
      paid: { bg: "#d1fae5", color: "#065f46", label: "Paid" },
      pending: { bg: "#fef3c7", color: "#92400e", label: "Pending" },
      refunded: { bg: "#dbeafe", color: "#0c4a6e", label: "Refunded" }
    };
    const style = statusMap[status] || statusMap.pending;
    return (
      <span style={{
        padding: "6px 12px",
        borderRadius: "20px",
        backgroundColor: style.bg,
        color: style.color,
        fontSize: "12px",
        fontWeight: "600",
      }}>
        {style.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={container}>
        <h1 style={pageTitle}>All Bookings for My Trips</h1>
        <p>Loading bookings...</p>
      </div>
    );
  }

  if (error && bookings.length === 0) {
    return (
      <div style={container}>
        <h1 style={pageTitle}>All Bookings for My Trips</h1>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={container}>
      <div style={headerSection}>
        <h1 style={pageTitle}>All Bookings for My Trips</h1>
        <p style={subtitle}>Manage and track all bookings from travelers</p>
      </div>

      {bookings.length === 0 ? (
        <div style={emptyState}>
          <p style={emptyStateIcon}>📭</p>
          <p style={emptyStateText}>No bookings yet</p>
        </div>
      ) : (
        <div style={tableWrapper}>
          <table style={table}>
            <thead>
              <tr style={tableHeader}>
                <th style={tableCell}>Traveler Name</th>
                <th style={tableCell}>Trip Name</th>
                <th style={tableCell}>Date</th>
                <th style={tableCell}>Travelers</th>
                <th style={tableCell}>Amount</th>
                <th style={tableCell}>Status</th>
                <th style={tableCell}>Payment</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} style={tableRow}>
                  <td style={tableCell}>{booking.travelerName}</td>
                  <td style={tableCell}>{booking.tripName}</td>
                  <td style={tableCell}>{formatDate(booking.date)}</td>
                  <td style={tableCell}>{booking.travelers}</td>
                  <td style={tableCell}>
                    <strong>${booking.totalAmount.toLocaleString()}</strong>
                  </td>
                  <td style={tableCell}>{getStatusBadge(booking.status)}</td>
                  <td style={tableCell}>{getPaymentBadge(booking.paymentStatus)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={statsSection}>
        <div style={statCard}>
          <p style={statLabel}>Total Bookings</p>
          <p style={statValue}>{bookings.length}</p>
        </div>
        <div style={statCard}>
          <p style={statLabel}>Confirmed</p>
          <p style={statValue}>{bookings.filter(b => b.status === "confirmed").length}</p>
        </div>
        <div style={statCard}>
          <p style={statLabel}>Total Revenue</p>
          <p style={statValue}>${bookings.reduce((sum, b) => b.paymentStatus === "paid" ? sum + b.totalAmount : sum, 0).toLocaleString()}</p>
        </div>
        <div style={statCard}>
          <p style={statLabel}>Pending Payment</p>
          <p style={statValue}>${bookings.reduce((sum, b) => b.paymentStatus === "pending" ? sum + b.totalAmount : sum, 0).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

const container = { padding: "40px 20px", maxWidth: "1400px", margin: "0 auto" };
const headerSection = { marginBottom: "40px" };
const pageTitle = { fontSize: "32px", fontWeight: "800", color: "#112647", margin: "0 0 8px 0" };
const subtitle = { fontSize: "14px", color: "#64748b", margin: "0" };
const emptyState = { textAlign: "center", padding: "60px 20px" };
const emptyStateIcon = { fontSize: "48px", margin: "0" };
const emptyStateText = { fontSize: "16px", color: "#64748b", margin: "16px 0 0 0" };
const tableWrapper = { overflowX: "auto", marginBottom: "40px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" };
const table = { width: "100%", borderCollapse: "collapse", backgroundColor: "#fff" };
const tableHeader = { backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" };
const tableRow = { borderBottom: "1px solid #e2e8f0", transition: "background-color 0.3s" };
const tableCell = { padding: "16px", textAlign: "left", fontSize: "14px", color: "#495057" };
const statsSection = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" };
const statCard = { padding: "24px", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", textAlign: "center" };
const statLabel = { fontSize: "13px", color: "#64748b", textTransform: "uppercase", margin: "0", fontWeight: "600" };
const statValue = { fontSize: "28px", fontWeight: "800", color: "#112647", margin: "8px 0 0 0" };

export default AgencyBookings;