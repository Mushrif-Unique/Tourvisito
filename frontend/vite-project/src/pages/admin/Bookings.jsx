import React, { useState, useEffect } from "react";
import API from "../../api/api";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Mock all system bookings data
  const mockBookings = [
    {
      _id: "1",
      user: { name: "John Smith", email: "john@example.com" },
      trip: { title: "Paris City Tour", destination: "Paris", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80" },
      agency: { name: "Euro Travels" },
      startDate: "2024-02-15",
      status: "confirmed",
      paymentStatus: "paid",
      travelers: 2,
      totalAmount: 2598,
      bookingReference: "BK-2024-001",
      createdAt: "2024-01-28"
    },
    {
      _id: "2",
      user: { name: "Sarah Johnson", email: "sarah@example.com" },
      trip: { title: "Tokyo Adventure", destination: "Tokyo", image: "https://images.unsplash.com/photo-1540959375944-7049f642e9ba?auto=format&fit=crop&w=800&q=80" },
      agency: { name: "Asia Explorers" },
      startDate: "2024-03-10",
      status: "pending",
      paymentStatus: "pending",
      travelers: 1,
      totalAmount: 1899,
      bookingReference: "BK-2024-002",
      createdAt: "2024-01-27"
    },
    {
      _id: "3",
      user: { name: "Michael Chen", email: "michael@example.com" },
      trip: { title: "New York Escape", destination: "New York", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80" },
      agency: { name: "US Travel Co" },
      startDate: "2024-02-20",
      status: "confirmed",
      paymentStatus: "paid",
      travelers: 3,
      totalAmount: 2697,
      bookingReference: "BK-2024-003",
      createdAt: "2024-01-26"
    },
    {
      _id: "4",
      user: { name: "Emma Wilson", email: "emma@example.com" },
      trip: { title: "Paris City Tour", destination: "Paris", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80" },
      agency: { name: "Euro Travels" },
      startDate: "2024-04-05",
      status: "cancelled",
      paymentStatus: "refunded",
      travelers: 2,
      totalAmount: 2598,
      bookingReference: "BK-2024-004",
      createdAt: "2024-01-25"
    },
    {
      _id: "5",
      user: { name: "David Brown", email: "david@example.com" },
      trip: { title: "Tokyo Adventure", destination: "Tokyo", image: "https://images.unsplash.com/photo-1540959375944-7049f642e9ba?auto=format&fit=crop&w=800&q=80" },
      agency: { name: "Asia Explorers" },
      startDate: "2024-03-20",
      status: "confirmed",
      paymentStatus: "paid",
      travelers: 1,
      totalAmount: 1899,
      bookingReference: "BK-2024-005",
      createdAt: "2024-01-24"
    },
    {
      _id: "6",
      user: { name: "Lisa Anderson", email: "lisa@example.com" },
      trip: { title: "Rome Historical Tour", destination: "Rome", image: "https://images.unsplash.com/photo-1552832860-cfde47f1835d?auto=format&fit=crop&w=800&q=80" },
      agency: { name: "Italian Tours" },
      startDate: "2024-05-12",
      status: "confirmed",
      paymentStatus: "paid",
      travelers: 4,
      totalAmount: 4796,
      bookingReference: "BK-2024-006",
      createdAt: "2024-01-23"
    }
  ];

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    setLoading(true);
    try {
      const response = await API.get("/bookings/admin/all");
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

  return (
    <div style={pageWrapper}>
      {/* HERO SECTION */}
      <div style={heroSection}>
        <div style={heroContent}>
          <h1 style={heroTitle}>
            All System <span style={accentText}>Bookings</span>
          </h1>
          <p style={heroSubtitle}>
            View and manage all bookings across the platform
          </p>
        </div>
      </div>

      {/* STATS SECTION */}
      <div style={statsSection}>
        <div style={statCard}>
          <div style={statIcon}>📋</div>
          <div style={statNumber}>{bookings.length}</div>
          <div style={statLabel}>Total Bookings</div>
        </div>
        <div style={statCard}>
          <div style={statIcon}>✅</div>
          <div style={statNumber}>{bookings.filter(b => b.status === "confirmed").length}</div>
          <div style={statLabel}>Confirmed</div>
        </div>
        <div style={statCard}>
          <div style={statIcon}>💰</div>
          <div style={statNumber}>${bookings.reduce((sum, b) => b.paymentStatus === "paid" ? sum + b.totalAmount : sum, 0).toLocaleString()}</div>
          <div style={statLabel}>Total Revenue</div>
        </div>
        <div style={statCard}>
          <div style={statIcon}>🏢</div>
          <div style={statNumber}>{new Set(bookings.map(b => b.agency?.name)).size}</div>
          <div style={statLabel}>Active Agencies</div>
        </div>
      </div>

      {/* HEADER */}
      <header style={headerSection}>
        <h2 style={sectionTitle}>
          {loading ? "Loading..." : `${bookings.length} Booking${bookings.length !== 1 ? "s" : ""}`}
        </h2>
      </header>

      {/* BOOKINGS GRID */}
      {loading ? (
        <div style={skeletonGrid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={skeletonCard}>
              <div style={skeletonImage}></div>
              <div style={skeletonContent}>
                <div style={skeletonLine}></div>
                <div style={{...skeletonLine, width: '60%'}}></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div style={emptyState}>
          <div style={emptyIcon}>❌</div>
          <h3 style={emptyTitle}>Oops! Something went wrong</h3>
          <p style={emptyText}>{error}</p>
        </div>
      ) : bookings.length === 0 ? (
        <div style={emptyState}>
          <div style={emptyIcon}>📭</div>
          <h3 style={emptyTitle}>No Bookings Yet</h3>
          <p style={emptyText}>No bookings in the system.</p>
        </div>
      ) : (
        <div style={bookingsGrid}>
          {bookings.map((booking) => (
            <div key={booking._id} style={bookingCard}>
              <div style={cardImageSection}>
                <img 
                  src={booking.trip?.image || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80"} 
                  alt={booking.trip?.title || "Trip"}
                  style={cardImage}
                />
                <div style={cardImageOverlay}>
                  {getStatusBadge(booking.status)}
                </div>
              </div>
              <div style={cardContent}>
                <h3 style={cardTitle}>{booking.trip?.title || "Trip"}</h3>
                <p style={cardSubtitle}>📍 {booking.trip?.destination || "Unknown"}</p>
                
                <div style={bookingInfo}>
                  <div style={infoRow}>
                    <span style={infoLabel}>Traveler:</span>
                    <span style={infoValue}>{booking.user?.name || "N/A"}</span>
                  </div>
                  <div style={infoRow}>
                    <span style={infoLabel}>Agency:</span>
                    <span style={infoValue}>{booking.agency?.name || "N/A"}</span>
                  </div>
                  <div style={infoRow}>
                    <span style={infoLabel}>Date:</span>
                    <span style={infoValue}>{formatDate(booking.startDate)}</span>
                  </div>
                  <div style={infoRow}>
                    <span style={infoLabel}>Travelers:</span>
                    <span style={infoValue}>{booking.travelers}</span>
                  </div>
                  <div style={infoRow}>
                    <span style={infoLabel}>Payment:</span>
                    {getPaymentBadge(booking.paymentStatus)}
                  </div>
                  <div style={priceRow}>
                    <span style={infoLabel}>Total:</span>
                    <span style={priceValue}>${booking.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

/* --- STYLES --- */
const pageWrapper = {
  minHeight: "100vh",
  backgroundColor: "#f8fafc",
  paddingBottom: "100px",
};

const heroSection = {
  background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
  padding: "60px 5% 80px 5%",
  color: "#fff",
  textAlign: "center",
};

const heroContent = {
  maxWidth: "700px",
  margin: "0 auto",
};

const heroTitle = {
  fontSize: "clamp(32px, 5vw, 48px)",
  fontWeight: "900",
  marginBottom: "16px",
  letterSpacing: "-0.03em",
};

const accentText = {
  background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const heroSubtitle = {
  fontSize: "18px",
  opacity: "0.95",
  margin: "0",
  lineHeight: "1.6",
};

const statsSection = {
  maxWidth: "1400px",
  margin: "-40px auto 60px auto",
  padding: "0 5%",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  position: "relative",
  zIndex: 10,
};

const statCard = {
  backgroundColor: "#fff",
  padding: "24px",
  borderRadius: "16px",
  textAlign: "center",
  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
  border: "1px solid #e2e8f0",
};

const statIcon = {
  fontSize: "32px",
  marginBottom: "8px",
};

const statNumber = {
  fontSize: "28px",
  fontWeight: "800",
  color: "#7c3aed",
  marginBottom: "4px",
};

const statLabel = {
  fontSize: "13px",
  color: "#64748b",
  fontWeight: "600",
  textTransform: "uppercase",
};

const headerSection = {
  maxWidth: "1400px",
  margin: "0 auto 30px auto",
  padding: "0 5%",
};

const sectionTitle = {
  fontSize: "28px",
  fontWeight: "800",
  color: "#1e293b",
  marginBottom: "8px",
};

const bookingsGrid = {
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "0 5%",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
  gap: "30px",
};

const bookingCard = {
  backgroundColor: "#fff",
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease",
  animation: "slideUp 0.5s ease",
};

const cardImageSection = {
  position: "relative",
  height: "180px",
  overflow: "hidden",
};

const cardImage = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const cardImageOverlay = {
  position: "absolute",
  top: "12px",
  right: "12px",
};

const cardContent = {
  padding: "20px",
};

const cardTitle = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#1e293b",
  marginBottom: "4px",
};

const cardSubtitle = {
  fontSize: "14px",
  color: "#64748b",
  marginBottom: "16px",
};

const bookingInfo = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const infoRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const priceRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "8px",
  paddingTop: "12px",
  borderTop: "1px solid #e2e8f0",
};

const infoLabel = {
  fontSize: "13px",
  color: "#64748b",
  fontWeight: "500",
};

const infoValue = {
  fontSize: "13px",
  color: "#1e293b",
  fontWeight: "600",
};

const priceValue = {
  fontSize: "20px",
  fontWeight: "800",
  color: "#059669",
};

const skeletonGrid = {
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "0 5%",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
  gap: "30px",
};

const skeletonCard = {
  backgroundColor: "#fff",
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
};

const skeletonImage = {
  height: "180px",
  backgroundColor: "#e2e8f0",
  animation: "pulse 1.5s infinite ease-in-out",
};

const skeletonContent = {
  padding: "20px",
};

const skeletonLine = {
  height: "16px",
  backgroundColor: "#e2e8f0",
  borderRadius: "8px",
  marginBottom: "12px",
  animation: "pulse 1.5s infinite ease-in-out",
};

const emptyState = {
  maxWidth: "500px",
  margin: "60px auto",
  textAlign: "center",
  padding: "60px 40px",
  backgroundColor: "#fff",
  borderRadius: "24px",
  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
};

const emptyIcon = {
  fontSize: "56px",
  marginBottom: "16px",
};

const emptyTitle = {
  fontSize: "24px",
  fontWeight: "800",
  color: "#1e293b",
  marginBottom: "8px",
};

const emptyText = {
  fontSize: "16px",
  color: "#64748b",
  margin: "0",
};

export default AdminBookings;