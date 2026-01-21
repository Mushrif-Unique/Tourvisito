import React, { useEffect, useState } from "react";
import API from "../api/api";
import TripCard from "../components/TripCard";

const Trips = () => {
  const [trips, setTrips] = useState([]); // always an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // optional: show error message

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data } = await API.get("/trips");
        // Ensure trips is always an array, even if API response is unexpected
        setTrips(Array.isArray(data.trips) ? data.trips : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load trips. Please try again later.");
        setTrips([]); // fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div style={pageWrapper}>
      {/* HEADER */}
      <header style={headerSection}>
        <div>
          <h1 style={titleStyle}>Explore Destinations</h1>
          <p style={subtitleStyle}>
            Hand-picked adventures curated by our AI and travel experts.
          </p>
        </div>
        <div style={filterPlaceholder}>
          <span>Sorted by: <b>Trending</b></span>
        </div>
      </header>

      {/* GRID SECTION */}
      {loading ? (
        <div style={skeletonGrid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={skeletonCard}></div>
          ))}
        </div>
      ) : error ? (
        <div style={emptyState}>
          <p>{error}</p>
        </div>
      ) : trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <div key={trip._id} style={cardHoverWrapper}>
              <TripCard trip={trip} />
            </div>
          ))}
        </div>
      ) : (
        <div style={emptyState}>
          <p>No trips found. Try generating one with AI!</p>
        </div>
      )}
    </div>
  );
};

/* --- STYLES --- */
const pageWrapper = {
  minHeight: "100vh",
  backgroundColor: "var(--color-bg)",
  padding: "60px 5% 100px 5%",
  maxWidth: "1400px",
  margin: "0 auto",
};

const headerSection = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  marginBottom: "48px",
  flexWrap: "wrap",
  gap: "20px",
};

const titleStyle = {
  fontSize: "clamp(32px, 5vw, 42px)",
  fontWeight: "800",
  color: "var(--color-primary)",
  letterSpacing: "-0.03em",
  marginBottom: "8px",
};

const subtitleStyle = {
  color: "#64748b",
  fontSize: "16px",
  maxWidth: "500px",
};

const filterPlaceholder = {
  padding: "10px 20px",
  backgroundColor: "#fff",
  borderRadius: "100px",
  fontSize: "14px",
  color: "var(--color-primary)",
  border: "1px solid #e2e8f0",
  boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
};

const cardHoverWrapper = {
  transition: "transform 0.3s ease",
  cursor: "pointer",
};

const skeletonGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "32px",
};

const skeletonCard = {
  height: "380px",
  backgroundColor: "#edf2f7",
  borderRadius: "20px",
  animation: "pulse 1.5s infinite ease-in-out",
};

const emptyState = {
  textAlign: "center",
  padding: "100px 20px",
  color: "#94a3b8",
  fontSize: "18px",
  backgroundColor: "#fff",
  borderRadius: "24px",
  border: "2px dashed #e2e8f0",
};

export default Trips;
