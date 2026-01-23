import React, { useState } from "react";
import axios from "axios";

const BookingForm = ({ trip, onSuccess }) => {
  const [formData, setFormData] = useState({
    travelers: 1,
    startDate: "",
    endDate: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    specialRequests: "",
    paymentMethod: "mock" // Default to mock payment
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalAmount, setTotalAmount] = useState(trip.price);

  // Calculate total when travelers change
  const handleTravelersChange = (e) => {
    const travelers = parseInt(e.target.value) || 1;
    setFormData({ ...formData, travelers });
    setTotalAmount(trip.price * travelers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        "http://localhost:5000/api/bookings",
        {
          tripId: trip._id,
          ...formData
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        alert(`✅ Booking Confirmed!\n\n${response.data.mockPayment.note}\n\nBooking ID: ${response.data.booking._id}`);
        if (onSuccess) onSuccess(response.data.booking);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Book Your Trip</h2>
      <div style={styles.tripSummary}>
        <h3>{trip.title}</h3>
        <p>📍 {trip.destination}</p>
        <p>⏱️ {trip.duration} days</p>
        <p style={styles.price}>💰 ${trip.price} per person</p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Number of Travelers */}
        <div style={styles.field}>
          <label style={styles.label}>Number of Travelers *</label>
          <input
            type="number"
            min="1"
            max="20"
            value={formData.travelers}
            onChange={handleTravelersChange}
            style={styles.input}
            required
          />
        </div>

        {/* Start Date */}
        <div style={styles.field}>
          <label style={styles.label}>Start Date *</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            style={styles.input}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        {/* End Date */}
        <div style={styles.field}>
          <label style={styles.label}>End Date *</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            style={styles.input}
            min={formData.startDate || new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        {/* Contact Name */}
        <div style={styles.field}>
          <label style={styles.label}>Contact Name</label>
          <input
            type="text"
            value={formData.contactName}
            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
            style={styles.input}
            placeholder="Your full name"
          />
        </div>

        {/* Contact Email */}
        <div style={styles.field}>
          <label style={styles.label}>Contact Email</label>
          <input
            type="email"
            value={formData.contactEmail}
            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            style={styles.input}
            placeholder="your@email.com"
          />
        </div>

        {/* Contact Phone */}
        <div style={styles.field}>
          <label style={styles.label}>Phone Number</label>
          <input
            type="tel"
            value={formData.contactPhone}
            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
            style={styles.input}
            placeholder="+1234567890"
          />
        </div>

        {/* Special Requests */}
        <div style={styles.field}>
          <label style={styles.label}>Special Requests</label>
          <textarea
            value={formData.specialRequests}
            onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
            style={styles.textarea}
            placeholder="Any dietary restrictions, accessibility needs, etc."
            rows="3"
          />
        </div>

        {/* Payment Method */}
        <div style={styles.field}>
          <label style={styles.label}>Payment Method *</label>
          <select
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            style={styles.input}
            required
          >
            <option value="mock">💳 Mock Payment (Development)</option>
            <option value="cash">💵 Cash on Arrival</option>
            <option value="bank_transfer">🏦 Bank Transfer</option>
          </select>
          <p style={styles.hint}>
            {formData.paymentMethod === "mock" && "⚠️ Development mode - No real payment will be charged"}
            {formData.paymentMethod === "cash" && "💡 Pay in cash when you arrive"}
            {formData.paymentMethod === "bank_transfer" && "📧 Bank details will be sent via email"}
          </p>
        </div>

        {/* Total Amount */}
        <div style={styles.totalBox}>
          <h3>Total Amount</h3>
          <p style={styles.totalAmount}>${totalAmount.toFixed(2)}</p>
          <p style={styles.breakdown}>
            ${trip.price} × {formData.travelers} traveler{formData.travelers > 1 ? 's' : ''}
          </p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <button 
          type="submit" 
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Processing..." : `Confirm Booking - $${totalAmount.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#333"
  },
  tripSummary: {
    backgroundColor: "#f8f9fa",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "25px"
  },
  price: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#00a8ff",
    marginTop: "10px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  field: {
    display: "flex",
    flexDirection: "column"
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "5px",
    color: "#555"
  },
  input: {
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    outline: "none",
    transition: "border-color 0.3s"
  },
  textarea: {
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit"
  },
  hint: {
    fontSize: "12px",
    color: "#888",
    marginTop: "5px"
  },
  totalBox: {
    backgroundColor: "#e8f5e9",
    padding: "15px",
    borderRadius: "8px",
    textAlign: "center",
    marginTop: "10px"
  },
  totalAmount: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#2e7d32",
    margin: "10px 0"
  },
  breakdown: {
    fontSize: "14px",
    color: "#666"
  },
  button: {
    padding: "15px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "#00a8ff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    marginTop: "10px"
  },
  error: {
    padding: "10px",
    backgroundColor: "#ffebee",
    color: "#c62828",
    borderRadius: "6px",
    fontSize: "14px"
  }
};

export default BookingForm; 