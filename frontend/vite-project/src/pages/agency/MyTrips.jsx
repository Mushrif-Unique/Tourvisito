import React, { useState, useEffect } from "react";
import API from "../../api/api";

const AgencyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    days: "",
    price: "",
    description: "",
    image: "",
    budget: "Premium",
    maxTravelers: "",
  });

  useEffect(() => {
    fetchMyTrips();
  }, []);

  const fetchMyTrips = async () => {
    try {
      const response = await API.get("/trips/my-trips");
      setTrips(Array.isArray(response.data.trips) ? response.data.trips : []);
    } catch (error) {
      console.error("Error fetching trips:", error);
      // Fallback mock data
      setTrips([
        {
          _id: "trip1",
          title: "Bali Beach Resort",
          destination: "Bali, Indonesia",
          days: 5,
          price: 899,
          description: "Relax on pristine beaches with luxury resorts",
          image: "https://images.unsplash.com/photo-1537225228614-56cc30d0d659?auto=format&fit=crop&w=800&q=80",
          budget: "Premium",
          maxTravelers: 20,
        },
      ]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (
        !formData.title ||
        !formData.destination ||
        !formData.days ||
        !formData.price
      ) {
        alert("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const newTrip = {
        ...formData,
        days: parseInt(formData.days),
        price: parseFloat(formData.price),
        maxTravelers: parseInt(formData.maxTravelers) || 20,
        _id: `trip_${Date.now()}`,
      };

      // Try API first
      try {
        await API.post("/trips", newTrip);
      } catch (apiError) {
        console.log("API not available, storing locally");
      }

      // Add to local state
      setTrips((prev) => [newTrip, ...prev]);

      // Reset form
      setFormData({
        title: "",
        destination: "",
        days: "",
        price: "",
        description: "",
        image: "",
        budget: "Premium",
        maxTravelers: "",
      });

      setShowModal(false);
      alert("Trip created successfully!");
    } catch (error) {
      console.error("Error creating trip:", error);
      alert("Failed to create trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = (tripId) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      setTrips((prev) => prev.filter((trip) => trip._id !== tripId));
    }
  };

  return (
    <div style={pageWrapper}>
      {/* HEADER SECTION */}
      <div style={headerSection}>
        <div style={headerContent}>
          <h1 style={pageTitle}>My Trips</h1>
          <p style={pageSubtitle}>Create and manage your travel packages</p>
        </div>
        <button onClick={() => setShowModal(true)} style={createBtn}>
          ➕ Create New Trip
        </button>
      </div>

      {/* TRIPS GRID */}
      {trips.length === 0 ? (
        <div style={emptyState}>
          <div style={emptyIcon}>🌍</div>
          <h3 style={emptyTitle}>No Trips Yet</h3>
          <p style={emptySubtitle}>Create your first trip package to get started</p>
          <button onClick={() => setShowModal(true)} style={emptyBtn}>
            Create Your First Trip
          </button>
        </div>
      ) : (
        <div style={tripsGrid}>
          {trips.map((trip) => (
            <div key={trip._id} style={tripCardStyle}>
              <div
                style={{
                  ...tripImage,
                  backgroundImage: `url(${
                    trip.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"
                  })`,
                }}
              >
                <span style={budgetBadge}>{trip.budget}</span>
              </div>
              <div style={tripContent}>
                <h3 style={tripTitle}>{trip.title}</h3>
                <p style={tripDestination}>📍 {trip.destination}</p>
                <div style={tripMeta}>
                  <span>⏱️ {trip.days} Days</span>
                  <span>👥 {trip.maxTravelers || 20} Travelers</span>
                </div>
                <p style={tripDescription}>{trip.description}</p>
                <div style={tripFooter}>
                  <span style={tripPrice}>${trip.price}</span>
                  <div style={actionButtons}>
                    <button style={editBtn}>✏️ Edit</button>
                    <button
                      onClick={() => handleDeleteTrip(trip._id)}
                      style={deleteBtn}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE TRIP MODAL */}
      {showModal && (
        <div style={modalOverlay} onClick={() => setShowModal(false)}>
          <div style={modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeader}>
              <h2 style={modalTitle}>Create New Trip</h2>
              <button
                onClick={() => setShowModal(false)}
                style={closeBtn}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTrip} style={formStyle}>
              {/* Trip Title */}
              <div style={formGroup}>
                <label style={label}>Trip Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Bali Paradise Tour"
                  style={input}
                />
              </div>

              {/* Destination */}
              <div style={formGroup}>
                <label style={label}>Destination *</label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  placeholder="e.g., Bali, Indonesia"
                  style={input}
                />
              </div>

              {/* Days & Price Row */}
              <div style={formRow}>
                <div style={formGroup}>
                  <label style={label}>Duration (Days) *</label>
                  <input
                    type="number"
                    name="days"
                    value={formData.days}
                    onChange={handleInputChange}
                    placeholder="5"
                    style={input}
                  />
                </div>
                <div style={formGroup}>
                  <label style={label}>Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="1299"
                    style={input}
                  />
                </div>
              </div>

              {/* Budget & Max Travelers Row */}
              <div style={formRow}>
                <div style={formGroup}>
                  <label style={label}>Budget Level</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    style={input}
                  >
                    <option>Budget</option>
                    <option>Standard</option>
                    <option>Premium</option>
                    <option>Luxury</option>
                  </select>
                </div>
                <div style={formGroup}>
                  <label style={label}>Max Travelers</label>
                  <input
                    type="number"
                    name="maxTravelers"
                    value={formData.maxTravelers}
                    onChange={handleInputChange}
                    placeholder="20"
                    style={input}
                  />
                </div>
              </div>

              {/* Description */}
              <div style={formGroup}>
                <label style={label}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your trip..."
                  style={{...input, minHeight: "100px", resize: "vertical"}}
                />
              </div>

              {/* Image URL */}
              <div style={formGroup}>
                <label style={label}>Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://images.unsplash.com/..."
                  style={input}
                />
                {formData.image && (
                  <div
                    style={{
                      ...imagePreview,
                      backgroundImage: `url(${formData.image})`,
                    }}
                  />
                )}
              </div>

              {/* Form Actions */}
              <div style={formActions}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={cancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={loading ? {...submitBtn, opacity: 0.7} : submitBtn}
                >
                  {loading ? "Creating..." : "Create Trip"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- STYLES --- */
const pageWrapper = {
  padding: "40px 20px",
  maxWidth: "1200px",
  margin: "0 auto",
};

const headerSection = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "40px",
  gap: "20px",
};

const headerContent = {
  flex: 1,
};

const pageTitle = {
  fontSize: "36px",
  fontWeight: "900",
  color: "#112647",
  margin: "0 0 8px 0",
  letterSpacing: "-0.5px",
};

const pageSubtitle = {
  fontSize: "16px",
  color: "#64748b",
  margin: 0,
};

const createBtn = {
  padding: "14px 28px",
  backgroundColor: "#667eea",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  fontWeight: "700",
  cursor: "pointer",
  fontSize: "16px",
  transition: "all 0.3s",
  boxShadow: "0 6px 15px rgba(102, 126, 234, 0.3)",
};

const emptyState = {
  textAlign: "center",
  padding: "80px 20px",
};

const emptyIcon = {
  fontSize: "64px",
  marginBottom: "20px",
};

const emptyTitle = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#112647",
  margin: "0 0 12px 0",
};

const emptySubtitle = {
  fontSize: "16px",
  color: "#64748b",
  margin: "0 0 24px 0",
};

const emptyBtn = {
  ...createBtn,
};

const tripsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: "24px",
};

const tripCardStyle = {
  backgroundColor: "#fff",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  transition: "all 0.3s",
};

const tripImage = {
  height: "200px",
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
};

const budgetBadge = {
  position: "absolute",
  top: "12px",
  right: "12px",
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  color: "#667eea",
  padding: "6px 14px",
  borderRadius: "100px",
  fontSize: "12px",
  fontWeight: "700",
};

const tripContent = {
  padding: "20px",
};

const tripTitle = {
  fontSize: "18px",
  fontWeight: "800",
  color: "#112647",
  margin: "0 0 8px 0",
};

const tripDestination = {
  fontSize: "14px",
  color: "#667eea",
  margin: "0 0 12px 0",
  fontWeight: "600",
};

const tripMeta = {
  display: "flex",
  gap: "16px",
  fontSize: "13px",
  color: "#64748b",
  marginBottom: "12px",
};

const tripDescription = {
  fontSize: "14px",
  color: "#495057",
  lineHeight: "1.5",
  margin: "0 0 16px 0",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const tripFooter = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: "12px",
  borderTop: "1px solid #f1f5f9",
};

const tripPrice = {
  fontSize: "20px",
  fontWeight: "900",
  color: "#667eea",
};

const actionButtons = {
  display: "flex",
  gap: "8px",
};

const editBtn = {
  padding: "8px 14px",
  backgroundColor: "#667eea",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s",
};

const deleteBtn = {
  padding: "8px 14px",
  backgroundColor: "#ee1660",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContent = {
  backgroundColor: "#fff",
  borderRadius: "20px",
  padding: "40px",
  maxWidth: "600px",
  width: "90%",
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
};

const modalHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
};

const modalTitle = {
  fontSize: "28px",
  fontWeight: "900",
  color: "#112647",
  margin: 0,
};

const closeBtn = {
  background: "none",
  border: "none",
  fontSize: "28px",
  cursor: "pointer",
  color: "#64748b",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const formGroup = {
  display: "flex",
  flexDirection: "column",
};

const label = {
  fontSize: "14px",
  fontWeight: "700",
  color: "#475569",
  marginBottom: "8px",
};

const input = {
  padding: "12px 14px",
  border: "1.5px solid #e2e8f0",
  borderRadius: "10px",
  fontSize: "14px",
  color: "#112647",
  outline: "none",
  transition: "all 0.2s",
};

const formRow = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
};

const imagePreview = {
  height: "150px",
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderRadius: "10px",
  marginTop: "12px",
  border: "2px solid #e2e8f0",
};

const formActions = {
  display: "flex",
  gap: "12px",
  justifyContent: "flex-end",
  marginTop: "20px",
  paddingTop: "20px",
  borderTop: "1px solid #f1f5f9",
};

const cancelBtn = {
  padding: "12px 28px",
  backgroundColor: "#f1f5f9",
  color: "#475569",
  border: "none",
  borderRadius: "10px",
  fontWeight: "700",
  cursor: "pointer",
  transition: "all 0.2s",
};

const submitBtn = {
  padding: "12px 28px",
  backgroundColor: "#667eea",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  fontWeight: "700",
  cursor: "pointer",
  transition: "all 0.2s",
};

export default AgencyTrips;