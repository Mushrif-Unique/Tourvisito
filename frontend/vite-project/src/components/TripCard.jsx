import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { jwtDecode } from "jwt-decode";

const TripCard = ({ trip }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check if user is logged in and is a traveler
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
        if (decoded.role === "traveler" && (trip._id || trip.id)) {
          checkSavedStatus();
        }
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, [trip._id || trip.id]);

  const checkSavedStatus = async () => {
    try {
      const tripId = trip._id || trip.id;
      const { data } = await API.get(`/trips/${tripId}/saved-status`);
      setIsSaved(data.isSaved);
    } catch (error) {
      // Fallback to localStorage
      const savedTrips = JSON.parse(localStorage.getItem("savedTrips") || "[]");
      const tripId = trip._id || trip.id;
      setIsSaved(savedTrips.includes(String(tripId)));
    }
  };

  const handleSaveTrip = async (e) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      // Not logged in - redirect to login
      navigate("/login");
      return;
    }

    // Check if user is traveler
    if (userRole && userRole !== "traveler") {
      alert("Only travelers can save trips. Please login as a traveler.");
      return;
    }

    setLoading(true);
    try {
      const tripId = String(trip._id || trip.id);
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

  return (
    <div
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-10px)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(17, 38, 71, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.05)";
      }}
    >
      {/* IMAGE SECTION WITH BADGE */}
      <div style={imageWrapper}>
        <div style={{...imageContainer, backgroundImage: `url(${trip.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"})`}}>
          <div style={overlayGradient} />
          <div style={badgeStyle}>{trip.budget || "Value"}</div>
          {/* Show save button for logged-in travelers or anyone if not logged in (login will be triggered) */}
          <button 
            onClick={handleSaveTrip}
            disabled={loading}
            style={{
              ...saveBtn,
              backgroundColor: isSaved ? "#ff1654" : "rgba(255, 255, 255, 0.9)",
              color: isSaved ? "white" : "#112647"
            }}
            title={isSaved ? "Remove from favorites" : "Add to favorites"}
          >
            {isSaved ? "❤️" : "🤍"}
          </button>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div style={contentSection}>
        <div style={headerRow}>
          <h2 style={destinationTitle}>{trip.destination}</h2>
          <div style={daysIndicator}>
            <span style={{ fontSize: "16px" }}>📅</span> {trip.days} Days
          </div>
        </div>

        <p style={descriptionText}>
          {trip.description || "Discover hidden gems and local culture in this curated AI experience."}
        </p>

        {/* PRICE & ACTION ROW */}
        <div style={footerRow}>
          <div style={priceContainer}>
            <span style={priceLabel}>Starting at</span>
            <span style={priceAmount}>${trip.price || "1,299"}</span>
          </div>
          <button onClick={() => navigate(`/trip-details/${trip._id || trip.id}`)} style={bookBtn}>
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

/* --- STYLISH TRIP CARD STYLES --- */

const cardStyle = {
  background: "#fff",
  borderRadius: "24px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  cursor: "pointer",
  border: "1px solid #f1f5f9",
};

const imageWrapper = {
  position: "relative",
  padding: "12px", // Creates a "framed" look
};

const imageContainer = {
  height: "220px",
  borderRadius: "18px",
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
  overflow: "hidden",
};

const overlayGradient = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(to bottom, transparent 50%, rgba(17, 38, 71, 0.4))",
};

const badgeStyle = {
  position: "absolute",
  top: "12px",
  right: "12px",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(4px)",
  padding: "6px 14px",
  borderRadius: "100px",
  fontSize: "12px",
  fontWeight: "700",
  color: "var(--color-primary)",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const saveBtn = {
  position: "absolute",
  top: "12px",
  left: "12px",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  border: "none",
  fontSize: "20px",
  cursor: "pointer",
  transition: "all 0.3s",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const contentSection = {
  padding: "20px 24px 24px 24px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
};

const destinationTitle = {
  fontSize: "22px",
  fontWeight: "850",
  color: "var(--color-primary)",
  margin: 0,
  letterSpacing: "-0.5px",
};

const daysIndicator = {
  fontSize: "13px",
  fontWeight: "700",
  color: "#64748b",
  backgroundColor: "#f8fafc",
  padding: "4px 10px",
  borderRadius: "8px",
};

const descriptionText = {
  fontSize: "14px",
  color: "#64748b",
  lineHeight: "1.6",
  margin: 0,
  display: "-webkit-box",
  WebkitLineClamp: "2",
  WebkitBoxOrient: "vertical",
  overflow: "hidden", // Clamps text to 2 lines
};

const footerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "8px",
  paddingTop: "16px",
  borderTop: "1px solid #f1f5f9",
};

const priceContainer = {
  display: "flex",
  flexDirection: "column",
};

const priceLabel = {
  fontSize: "11px",
  textTransform: "uppercase",
  color: "#94a3b8",
  fontWeight: "700",
  letterSpacing: "0.5px",
};

const priceAmount = {
  fontSize: "20px",
  fontWeight: "800",
  color: "var(--color-primary)",
};

const bookBtn = {
  backgroundColor: "var(--color-accent)",
  color: "#fff",
  padding: "10px 24px",
  borderRadius: "12px",
  border: "none",
  fontWeight: "700",
  fontSize: "14px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxShadow: "0 6px 15px rgba(238, 22, 96, 0.2)",
};

export default TripCard;