import React, { useEffect, useState } from "react";
import API from "../api/api";
import TripCard from "../components/TripCard";

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock trips data
  const mockTripsData = [
    { _id: "1", title: "Paris City Tour", destination: "Paris", days: 5, price: 1299, description: "Experience the magic of Paris with guided tours of the Eiffel Tower, Louvre Museum, and charming cafes.", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80", budget: "Premium" },
    { _id: "2", title: "Tokyo Adventure", destination: "Tokyo", days: 7, price: 1899, description: "Immerse yourself in Japanese culture with temple visits, street food tours, and modern city exploration.", image: "https://images.unsplash.com/photo-1540959375944-7049f642e9ba?auto=format&fit=crop&w=800&q=80", budget: "Luxury" },
    { _id: "3", title: "New York Escape", destination: "New York", days: 4, price: 899, description: "Discover the iconic landmarks of NYC including Times Square, Central Park, and Broadway shows.", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80", budget: "Standard" },
    { _id: "4", title: "Barcelona Beach Getaway", destination: "Barcelona", days: 6, price: 1499, description: "Relax on beautiful beaches and explore the architectural wonders of Gaudí and vibrant nightlife.", image: "https://images.unsplash.com/photo-1562883676-8c6e5fd27c14?auto=format&fit=crop&w=800&q=80", budget: "Premium" },
    { _id: "5", title: "Dubai Luxury Experience", destination: "Dubai", days: 5, price: 2299, description: "Experience luxury shopping, desert safaris, and stunning skyscrapers in the heart of the UAE.", image: "https://images.unsplash.com/photo-1512453736506-4c0c8a2e4cc6?auto=format&fit=crop&w=800&q=80", budget: "Luxury" },
    { _id: "6", title: "Rome Historical Tour", destination: "Rome", days: 5, price: 1199, description: "Walk through ancient history with visits to the Colosseum, Vatican, and classic Roman cuisine.", image: "https://images.unsplash.com/photo-1552832860-cfde47f1835d?auto=format&fit=crop&w=800&q=80", budget: "Premium" },
    { _id: "7", title: "Amsterdam Canal Tour", destination: "Amsterdam", days: 4, price: 899, description: "Cruise through picturesque canals, visit museums, and experience the vibrant Dutch culture.", image: "https://images.unsplash.com/photo-1502316917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80", budget: "Standard" },
    { _id: "8", title: "Bangkok Cultural Immersion", destination: "Bangkok", days: 6, price: 799, description: "Discover ornate temples, bustling markets, and delicious street food in Thailand's vibrant capital.", image: "https://images.unsplash.com/photo-1517695712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80", budget: "Budget" },
    { _id: "9", title: "Sydney Harbor Adventure", destination: "Sydney", days: 7, price: 1699, description: "Explore iconic Opera House, beautiful beaches, and outdoor adventure activities down under.", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80", budget: "Premium" },
  ];

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data } = await API.get("/trips");
        const fetchedTrips = Array.isArray(data.trips) ? data.trips : [];
        
        // If no trips from API, use mock data
        if (fetchedTrips.length === 0) {
          setTrips(mockTripsData);
        } else {
          setTrips(fetchedTrips);
        }
      } catch (err) {
        console.error(err);
        // Use mock data as fallback
        setTrips(mockTripsData);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  // Filter trips based on search and filter
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = trip.destination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trip.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div style={pageWrapper}>
      {/* HERO SECTION */}
      <div style={heroSection}>
        <div style={heroContent}>
          <h1 style={heroTitle}>
            Discover Your Next <span style={accentText}>Adventure</span>
          </h1>
          <p style={heroSubtitle}>
            Explore curated travel experiences from around the globe. AI-powered itineraries crafted just for you.
          </p>
        </div>
        
        {/* SEARCH BAR */}
        <div style={searchContainer}>
          <div style={searchWrapper}>
            <span style={searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search destinations, cities, countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={searchInput}
            />
          </div>
        </div>
      </div>

      {/* STATS SECTION */}
      <div style={statsSection}>
        <div style={statCard}>
          <div style={statIcon}>🌍</div>
          <div style={statNumber}>{trips.length}+</div>
          <div style={statLabel}>Destinations</div>
        </div>
        <div style={statCard}>
          <div style={statIcon}>✨</div>
          <div style={statNumber}>AI</div>
          <div style={statLabel}>Powered</div>
        </div>
        <div style={statCard}>
          <div style={statIcon}>⭐</div>
          <div style={statNumber}>4.9</div>
          <div style={statLabel}>Rating</div>
        </div>
        <div style={statCard}>
          <div style={statIcon}>🎯</div>
          <div style={statNumber}>100%</div>
          <div style={statLabel}>Personalized</div>
        </div>
      </div>

      {/* HEADER WITH FILTERS */}
      <header style={headerSection}>
        <div>
          <h2 style={sectionTitle}>
            {searchQuery ? `Results for "${searchQuery}"` : "All Destinations"}
          </h2>
          <p style={resultsCount}>
            {filteredTrips.length} {filteredTrips.length === 1 ? 'trip' : 'trips'} found
          </p>
        </div>
      </header>

      {/* GRID SECTION */}
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
          <button style={retryButton} onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      ) : filteredTrips.length > 0 ? (
        <div style={tripsGrid}>
          {filteredTrips.map((trip) => (
            <div key={trip._id} style={cardWrapper}>
              <TripCard trip={trip} />
            </div>
          ))}
        </div>
      ) : (
        <div style={emptyState}>
          <div style={emptyIcon}>🔍</div>
          <h3 style={emptyTitle}>No trips found</h3>
          <p style={emptyText}>
            {searchQuery 
              ? `We couldn't find any trips matching "${searchQuery}". Try a different search term.`
              : "No trips available yet. Be the first to create one with our AI Trip Planner!"
            }
          </p>
          <button style={createButton} onClick={() => window.location.href = '/ai'}>
            ✨ Create Your Trip
          </button>
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
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
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
  background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
  padding: "80px 5% 60px 5%",
  color: "#fff",
  position: "relative",
  overflow: "hidden",
};

const heroContent = {
  maxWidth: "1400px",
  margin: "0 auto",
  textAlign: "center",
  position: "relative",
  zIndex: 1,
};

const heroTitle = {
  fontSize: "clamp(36px, 6vw, 56px)",
  fontWeight: "900",
  letterSpacing: "-0.03em",
  marginBottom: "20px",
  lineHeight: "1.2",
};

const accentText = {
  background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const heroSubtitle = {
  fontSize: "18px",
  opacity: 0.9,
  maxWidth: "600px",
  margin: "0 auto 40px auto",
  lineHeight: "1.6",
};

const searchContainer = {
  maxWidth: "700px",
  margin: "0 auto",
};

const searchWrapper = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  backgroundColor: "#fff",
  borderRadius: "16px",
  padding: "8px 20px",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
};

const searchIcon = {
  fontSize: "24px",
  marginRight: "12px",
};

const searchInput = {
  flex: 1,
  border: "none",
  outline: "none",
  fontSize: "16px",
  padding: "12px 0",
  color: "#1e293b",
  backgroundColor: "transparent",
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
  padding: "30px",
  borderRadius: "20px",
  textAlign: "center",
  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
  border: "1px solid #e2e8f0",
  transition: "all 0.3s ease",
};

const statIcon = {
  fontSize: "36px",
  marginBottom: "10px",
};

const statNumber = {
  fontSize: "32px",
  fontWeight: "800",
  color: "#1e40af",
  marginBottom: "5px",
};

const statLabel = {
  fontSize: "14px",
  color: "#64748b",
  fontWeight: "600",
};

const headerSection = {
  maxWidth: "1400px",
  margin: "0 auto 40px auto",
  padding: "0 5%",
};

const sectionTitle = {
  fontSize: "28px",
  fontWeight: "800",
  color: "#1e293b",
  marginBottom: "8px",
};

const resultsCount = {
  fontSize: "14px",
  color: "#64748b",
  fontWeight: "600",
};

const tripsGrid = {
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "0 5%",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: "32px",
};

const cardWrapper = {
  animation: "slideUp 0.5s ease",
};

const skeletonGrid = {
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "0 5%",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: "32px",
};

const skeletonCard = {
  backgroundColor: "#fff",
  borderRadius: "24px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
};

const skeletonImage = {
  height: "220px",
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
  maxWidth: "600px",
  margin: "80px auto",
  textAlign: "center",
  padding: "60px 40px",
  backgroundColor: "#fff",
  borderRadius: "32px",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
};

const emptyIcon = {
  fontSize: "64px",
  marginBottom: "20px",
  animation: "float 3s ease-in-out infinite",
};

const emptyTitle = {
  fontSize: "24px",
  fontWeight: "800",
  color: "#1e293b",
  marginBottom: "12px",
};

const emptyText = {
  fontSize: "16px",
  color: "#64748b",
  lineHeight: "1.6",
  marginBottom: "30px",
};

const createButton = {
  padding: "16px 32px",
  backgroundColor: "#1e40af",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 10px 30px rgba(30, 64, 175, 0.3)",
  transition: "all 0.3s ease",
};

const retryButton = {
  padding: "14px 28px",
  backgroundColor: "#f1f5f9",
  color: "#1e40af",
  border: "2px solid #e2e8f0",
  borderRadius: "12px",
  fontSize: "15px",
  fontWeight: "700",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

export default Trips;