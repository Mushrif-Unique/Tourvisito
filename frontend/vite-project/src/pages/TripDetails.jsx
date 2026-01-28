import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../api/api";

const TripDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [token, setToken] = useState(null);

  // Check user role and saved status on mount
  useEffect(() => {
    const userToken = localStorage.getItem("token");
    setToken(userToken);
    
    if (userToken) {
      try {
        const decoded = jwtDecode(userToken);
        setUserRole(decoded.role);
        checkSavedStatus();
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, [tripId]);

  // Mock trip details data
  const mockTripsData = {
    "1": { title: "Paris City Tour", destination: "Paris", days: 5, price: 1299, description: "Experience the magic of Paris with guided tours of the Eiffel Tower, Louvre Museum, and charming cafes.", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80", budget: "Premium", rating: 4.8, reviews: 245 },
    "2": { title: "Tokyo Adventure", destination: "Tokyo", days: 7, price: 1899, description: "Immerse yourself in Japanese culture with temple visits, street food tours, and modern city exploration.", image: "https://images.unsplash.com/photo-1540959375944-7049f642e9ba?auto=format&fit=crop&w=800&q=80", budget: "Luxury", rating: 4.9, reviews: 312 },
    "3": { title: "New York Escape", destination: "New York", days: 4, price: 899, description: "Discover the iconic landmarks of NYC including Times Square, Central Park, and Broadway shows.", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80", budget: "Standard", rating: 4.7, reviews: 189 },
    "4": { title: "Barcelona Beach Getaway", destination: "Barcelona", days: 6, price: 1499, description: "Relax on beautiful beaches and explore the architectural wonders of Gaudí and vibrant nightlife.", image: "https://images.unsplash.com/photo-1562883676-8c6e5fd27c14?auto=format&fit=crop&w=800&q=80", budget: "Premium", rating: 4.8, reviews: 276 },
    "5": { title: "Dubai Luxury Experience", destination: "Dubai", days: 5, price: 2299, description: "Experience luxury shopping, desert safaris, and stunning skyscrapers in the heart of the UAE.", image: "https://images.unsplash.com/photo-1512453736506-4c0c8a2e4cc6?auto=format&fit=crop&w=800&q=80", budget: "Luxury", rating: 4.9, reviews: 421 },
    "6": { title: "Rome Historical Tour", destination: "Rome", days: 5, price: 1199, description: "Walk through ancient history with visits to the Colosseum, Vatican, and classic Roman cuisine.", image: "https://images.unsplash.com/photo-1552832860-cfde47f1835d?auto=format&fit=crop&w=800&q=80", budget: "Premium", rating: 4.8, reviews: 234 },
    "7": { title: "Amsterdam Canal Tour", destination: "Amsterdam", days: 4, price: 899, description: "Cruise through picturesque canals, visit museums, and experience the vibrant Dutch culture.", image: "https://images.unsplash.com/photo-1502316917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80", budget: "Standard", rating: 4.6, reviews: 167 },
    "8": { title: "Bangkok Cultural Immersion", destination: "Bangkok", days: 6, price: 799, description: "Discover ornate temples, bustling markets, and delicious street food in Thailand's vibrant capital.", image: "https://images.unsplash.com/photo-1517695712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80", budget: "Budget", rating: 4.7, reviews: 298 },
    "9": { title: "Sydney Harbor Adventure", destination: "Sydney", days: 7, price: 1699, description: "Explore iconic Opera House, beautiful beaches, and outdoor adventure activities down under.", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80", budget: "Premium", rating: 4.9, reviews: 356 },
  };

  const trip = mockTripsData[tripId];

  // Generate formatted trip ID
  const formattedTripId = `TRIP-${String(tripId).padStart(3, '0')}-${Date.now().toString().slice(-4)}`;

  if (!trip) {
    return (
      <div style={container}>
        <button onClick={() => navigate("/trips")} style={backBtn}>← Back to Trips</button>
        <p style={{ textAlign: "center", color: "red", fontSize: "18px" }}>Trip not found</p>
      </div>
    );
  }

  const handleSaveTrip = async () => {
    // Check authentication
    if (!token) {
      navigate("/login");
      return;
    }

    // Check role
    if (userRole && userRole !== "traveler") {
      alert("Only travelers can save trips. Please login as a traveler.");
      return;
    }

    setLoading(true);
    try {
      // Get current saved trips from localStorage
      const savedTrips = JSON.parse(localStorage.getItem("savedTrips") || "[]");

      if (isSaved) {
        // Remove from saved
        const updated = savedTrips.filter(id => id !== tripId);
        localStorage.setItem("savedTrips", JSON.stringify(updated));
        setIsSaved(false);
        
        // Try API delete as backup
        try {
          await API.delete(`/trips/${tripId}/save`);
        } catch (apiError) {
          console.log("API delete not available, using localStorage");
        }
      } else {
        // Add to saved
        if (!savedTrips.includes(tripId)) {
          savedTrips.push(tripId);
        }
        localStorage.setItem("savedTrips", JSON.stringify(savedTrips));
        setIsSaved(true);
        
        // Try API post as backup
        try {
          await API.post(`/trips/${tripId}/save`);
        } catch (apiError) {
          console.log("API post not available, using localStorage");
        }
      }
    } catch (error) {
      console.error("Error saving trip:", error);
      alert("Failed to save trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const checkSavedStatus = async () => {
    try {
      // Try API first
      const { data } = await API.get(`/trips/${tripId}/saved-status`);
      setIsSaved(data.isSaved);
    } catch (error) {
      // Fallback to localStorage if API fails
      const savedTrips = JSON.parse(localStorage.getItem("savedTrips") || "[]");
      setIsSaved(savedTrips.includes(tripId));
    }
  };

  return (
    <div style={container}>
      <button onClick={() => navigate("/trips")} style={backBtn}>← Back to Trips</button>

      {/* Hero Image Section */}
      <div style={{ ...heroImage, backgroundImage: `url(${trip.image})` }}>
        <div style={imageOverlay}>
          <div style={headerContent}>
            <h1 style={tripTitle}>{trip.title}</h1>
            <button 
              onClick={handleSaveTrip}
              disabled={loading}
              style={{
                ...saveTripsBtn,
                backgroundColor: isSaved ? "#ff1654" : "rgba(255, 255, 255, 0.2)",
                color: isSaved ? "white" : "white",
                border: isSaved ? "none" : "2px solid white"
              }}
            >
              {isSaved ? "❤️ Saved" : "🤍 Save Trip"}
            </button>
          </div>
        </div>
      </div>

      {/* Trip Info Cards */}
      <div style={infoGrid}>
        <div style={infoCard}>
          <div style={infoIcon}>📍</div>
          <div style={infoLabel}>Destination</div>
          <div style={infoValue}>{trip.destination}</div>
        </div>
        <div style={infoCard}>
          <div style={infoIcon}>⏱️</div>
          <div style={infoLabel}>Duration</div>
          <div style={infoValue}>{trip.days} Days</div>
        </div>
        <div style={infoCard}>
          <div style={infoIcon}>💰</div>
          <div style={infoLabel}>Price</div>
          <div style={infoValue}>${trip.price}</div>
        </div>
        <div style={infoCard}>
          <div style={infoIcon}>⭐</div>
          <div style={infoLabel}>Rating</div>
          <div style={infoValue}>{trip.rating} ({trip.reviews} reviews)</div>
        </div>
      </div>

      {/* Trip ID & Details */}
      <div style={detailsSection}>
        <div style={detailBox}>
          <h3 style={detailTitle}>Trip ID</h3>
          <div style={tripIdBox}>
            <code style={tripIdCode}>{formattedTripId}</code>
          </div>
          <p style={tripIdNote}>Use this ID for booking reference</p>
        </div>

        <div style={detailBox}>
          <h3 style={detailTitle}>About This Trip</h3>
          <p style={tripDescription}>{trip.description}</p>
        </div>

        <div style={detailBox}>
          <h3 style={detailTitle}>What's Included</h3>
          <ul style={featureList}>
            <li style={featureItem}>🏨 Accommodation in {trip.budget} hotels</li>
            <li style={featureItem}>🚌 Daily transportation and guided tours</li>
            <li style={featureItem}>🍽️ Breakfast and select meals included</li>
            <li style={featureItem}>📸 Professional photography and memories</li>
            <li style={featureItem}>👨‍🏫 Expert local guides</li>
            <li style={featureItem}>🎒 Travel insurance included</li>
          </ul>
        </div>

        <div style={detailBox}>
          <h3 style={detailTitle}>Travel Dates</h3>
          <p style={travelInfo}>
            🗓️ Flexible dates available<br/>
            Best time to visit: Next 3-6 months<br/>
            Availability: Limited seats remaining
          </p>
        </div>
      </div>

      {/* Booking Button */}
      <div style={bookingSection}>
        <div style={priceDisplay}>
          <span style={priceLabel}>Total Price</span>
          <span style={priceValue}>${trip.price}</span>
        </div>
        <button onClick={() => navigate("/booking", { state: { tripId: formattedTripId, tripData: trip } })} style={bookBtn}>
          Book This Trip Now
        </button>
      </div>
    </div>
  );
};

const container = { padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" };
const backBtn = { padding: "10px 20px", backgroundColor: "#667eea", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px", marginBottom: "20px", fontWeight: "600" };
const heroImage = { height: "400px", backgroundSize: "cover", backgroundPosition: "center", borderRadius: "16px", position: "relative", marginBottom: "40px", display: "flex", alignItems: "flex-end" };
const imageOverlay = { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)", borderRadius: "16px" };
const headerContent = { position: "relative", zIndex: 1, padding: "30px", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-end", color: "white" };
const tripTitle = { fontSize: "42px", fontWeight: "900", margin: 0 };
const saveTripsBtn = { padding: "12px 24px", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s" };
const infoGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" };
const infoCard = { padding: "24px", backgroundColor: "#fff", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", textAlign: "center" };
const infoIcon = { fontSize: "32px", marginBottom: "12px" };
const infoLabel = { fontSize: "12px", color: "#64748b", textTransform: "uppercase", fontWeight: "600", marginBottom: "8px" };
const infoValue = { fontSize: "24px", fontWeight: "800", color: "#112647" };
const detailsSection = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px", marginBottom: "40px" };
const detailBox = { backgroundColor: "#fff", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" };
const detailTitle = { fontSize: "20px", fontWeight: "700", color: "#112647", margin: "0 0 16px 0" };
const tripIdBox = { backgroundColor: "#f8fafc", padding: "16px", borderRadius: "12px", border: "2px dashed #667eea", marginBottom: "12px" };
const tripIdCode = { fontSize: "14px", fontFamily: "monospace", fontWeight: "600", color: "#667eea", wordBreak: "break-all" };
const tripIdNote = { fontSize: "12px", color: "#64748b", margin: "0" };
const tripDescription = { fontSize: "16px", lineHeight: "1.6", color: "#495057", margin: 0 };
const featureList = { padding: 0, margin: 0, listStyle: "none" };
const featureItem = { fontSize: "15px", color: "#495057", padding: "8px 0", borderBottom: "1px solid #e2e8f0" };
const travelInfo = { fontSize: "15px", lineHeight: "1.6", color: "#495057", margin: 0 };
const bookingSection = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "30px", backgroundColor: "#f8fafc", borderRadius: "16px", marginBottom: "40px", gap: "20px" };
const priceDisplay = { display: "flex", flexDirection: "column", alignItems: "flex-start" };
const priceLabel = { fontSize: "14px", color: "#64748b", fontWeight: "600" };
const priceValue = { fontSize: "32px", fontWeight: "900", color: "#667eea" };
const bookBtn = { padding: "16px 48px", backgroundColor: "#667eea", color: "white", border: "none", borderRadius: "12px", fontSize: "18px", fontWeight: "700", cursor: "pointer", transition: "all 0.3s", minWidth: "200px" };

export default TripDetails;
