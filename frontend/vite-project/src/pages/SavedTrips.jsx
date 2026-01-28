import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import TripCard from "../components/TripCard";

const SavedTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedTrips();
    // Refresh when page comes into focus
    window.addEventListener("focus", fetchSavedTrips);
    return () => window.removeEventListener("focus", fetchSavedTrips);
  }, []);

  const fetchSavedTrips = async () => {
    setLoading(true);
    
    // Mock trips data
    const mockTripsData = {
      "1": { _id: "1", title: "Paris City Tour", destination: "Paris", days: 5, price: 1299, description: "Experience the magic of Paris with guided tours of the Eiffel Tower, Louvre Museum, and charming cafes.", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80", budget: "Premium" },
      "2": { _id: "2", title: "Tokyo Adventure", destination: "Tokyo", days: 7, price: 1899, description: "Immerse yourself in Japanese culture with temple visits, street food tours, and modern city exploration.", image: "https://images.unsplash.com/photo-1540959375944-7049f642e9ba?auto=format&fit=crop&w=800&q=80", budget: "Luxury" },
      "3": { _id: "3", title: "New York Escape", destination: "New York", days: 4, price: 899, description: "Discover the iconic landmarks of NYC including Times Square, Central Park, and Broadway shows.", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80", budget: "Standard" },
      "4": { _id: "4", title: "Barcelona Beach Getaway", destination: "Barcelona", days: 6, price: 1499, description: "Relax on beautiful beaches and explore the architectural wonders of Gaudí and vibrant nightlife.", image: "https://images.unsplash.com/photo-1562883676-8c6e5fd27c14?auto=format&fit=crop&w=800&q=80", budget: "Premium" },
      "5": { _id: "5", title: "Dubai Luxury Experience", destination: "Dubai", days: 5, price: 2299, description: "Experience luxury shopping, desert safaris, and stunning skyscrapers in the heart of the UAE.", image: "https://images.unsplash.com/photo-1512453736506-4c0c8a2e4cc6?auto=format&fit=crop&w=800&q=80", budget: "Luxury" },
      "6": { _id: "6", title: "Rome Historical Tour", destination: "Rome", days: 5, price: 1199, description: "Walk through ancient history with visits to the Colosseum, Vatican, and classic Roman cuisine.", image: "https://images.unsplash.com/photo-1552832860-cfde47f1835d?auto=format&fit=crop&w=800&q=80", budget: "Premium" },
      "7": { _id: "7", title: "Amsterdam Canal Tour", destination: "Amsterdam", days: 4, price: 899, description: "Cruise through picturesque canals, visit museums, and experience the vibrant Dutch culture.", image: "https://images.unsplash.com/photo-1502316917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80", budget: "Standard" },
      "8": { _id: "8", title: "Bangkok Cultural Immersion", destination: "Bangkok", days: 6, price: 799, description: "Discover ornate temples, bustling markets, and delicious street food in Thailand's vibrant capital.", image: "https://images.unsplash.com/photo-1517695712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80", budget: "Budget" },
      "9": { _id: "9", title: "Sydney Harbor Adventure", destination: "Sydney", days: 7, price: 1699, description: "Explore iconic Opera House, beautiful beaches, and outdoor adventure activities down under.", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80", budget: "Premium" },
    };

    try {
      // Try API first
      const { data } = await API.get("/trips/traveler/saved");
      if (Array.isArray(data.trips) && data.trips.length > 0) {
        setTrips(data.trips);
        setError("");
        setLoading(false);
        return;
      }
    } catch (err) {
      console.log("API not available, using localStorage");
    }

    // Fallback: Load from localStorage
    const savedTripIds = JSON.parse(localStorage.getItem("savedTrips") || "[]");
    console.log("Saved trip IDs from localStorage:", savedTripIds);

    // Convert to actual trip objects
    const savedTripsData = savedTripIds.map(id => {
      const tripId = String(id).trim();
      return mockTripsData[tripId];
    }).filter(trip => trip !== undefined);

    console.log("Loaded trips:", savedTripsData);

    setTrips(savedTripsData);
    setError("");
    setLoading(false);
  };

  return (
    <div style={pageWrapper}>
      {/* HERO SECTION */}
      <div style={heroSection}>
        <div style={heroContent}>
          <h1 style={heroTitle}>
            My <span style={accentText}>Saved Trips</span>
          </h1>
          <p style={heroSubtitle}>
            Your collection of favorite travel experiences. Book any of these trips whenever you're ready.
          </p>
        </div>
      </div>

      {/* HEADER WITH COUNT */}
      <header style={headerSection}>
        <div>
          <h2 style={sectionTitle}>
            {loading ? "Loading..." : `${trips.length} Saved Trip${trips.length !== 1 ? "s" : ""}`}
          </h2>
        </div>
      </header>

      {/* GRID SECTION */}
      {loading ? (
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <p style={{ color: "#64748b" }}>Loading your saved trips...</p>
        </div>
      ) : error ? (
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <p style={{ color: "red" }}>{error}</p>
        </div>
      ) : trips.length === 0 ? (
        <div style={emptyState}>
          <div style={emptyIcon}>❤️</div>
          <h3 style={emptyTitle}>No Saved Trips Yet</h3>
          <p style={emptySubtitle}>Start exploring and save your favorite trips to see them here.</p>
          <button onClick={() => navigate("/trips")} style={exploreBtn}>
            Explore All Trips
          </button>
        </div>
      ) : (
        <div style={grid}>
          {trips.map((trip) => (
            <TripCard key={trip._id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
};

const pageWrapper = {
  padding: "0 20px 60px 20px",
  maxWidth: "1440px",
  margin: "0 auto",
};

const heroSection = {
  padding: "60px 20px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  borderRadius: "24px",
  textAlign: "center",
  marginBottom: "60px",
  marginTop: "20px",
};

const heroContent = {
  maxWidth: "700px",
  margin: "0 auto",
};

const heroTitle = {
  fontSize: "48px",
  fontWeight: "900",
  margin: "0 0 16px 0",
  letterSpacing: "-1px",
};

const accentText = {
  background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
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

const headerSection = {
  marginBottom: "40px",
};

const sectionTitle = {
  fontSize: "28px",
  fontWeight: "800",
  color: "#112647",
  margin: "0",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "30px",
  marginBottom: "40px",
};

const emptyState = {
  padding: "80px 20px",
  textAlign: "center",
};

const emptyIcon = {
  fontSize: "64px",
  marginBottom: "16px",
};

const emptyTitle = {
  fontSize: "28px",
  fontWeight: "800",
  color: "#112647",
  margin: "0 0 8px 0",
};

const emptySubtitle = {
  fontSize: "16px",
  color: "#64748b",
  margin: "0 0 24px 0",
};

const exploreBtn = {
  backgroundColor: "#667eea",
  color: "white",
  padding: "12px 32px",
  borderRadius: "12px",
  border: "none",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s",
};

export default SavedTrips;
