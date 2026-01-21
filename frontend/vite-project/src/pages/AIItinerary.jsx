import React, { useState } from "react";

// Mock API for demo - replace with your actual API import
const API = {
  post: async (url, data) => {
    // This is a mock - use your actual API call
    return { data: { itinerary: "Sample response..." } };
  }
};

const AIItinerary = () => {
  const [formData, setFormData] = useState({
    destination: "",
    days: "",
    budget: "Medium",
  });
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateAI = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setItinerary(null);

    // Demo itinerary for preview
    setTimeout(() => {
      setItinerary(`## 4-Day Sri Lanka Cultural Immersion Itinerary

**Budget Level:** Medium (approx. USD 100-200 per person per day)

---

### Day 1: Arrival, Dambulla Caves & Sigiriya Area

**Morning/Afternoon:** Arrive at Bandaranaike International Airport (BIA), Colombo. Your pre-booked private driver will meet you.
**Travel:** Begin your scenic drive towards the Dambulla/Sigiriya area (approx. 3-4 hours).
**Afternoon:** Check into your hotel. After a brief rest, head to the Dambulla Cave Temple (Golden Temple).
**Evening:** Enjoy a traditional Sri Lankan dinner at a local restaurant.
**Accommodation:** Comfortable guesthouse or boutique hotel in Sigiriya or Dambulla.
**Meals:** Dinner

---

### Day 2: Sigiriya Rock Fortress & Polonnaruwa Ancient City

**Morning (Early!):** Head to Sigiriya Rock Fortress, another UNESCO World Heritage site.
**Lunch:** Have lunch at a local restaurant near Sigiriya.
**Afternoon:** Drive to Polonnaruwa (approx. 1-1.5 hours), Sri Lanka's second ancient capital.
**Evening:** Return to your hotel in the Sigiriya/Dambulla area.
**Accommodation:** Same hotel in Sigiriya or Dambulla.
**Meals:** Breakfast, Dinner

---

### Day 3: Kandy & Tea Plantations

**Morning:** After breakfast, check out and begin your scenic drive to Kandy.
**En Route:** Visit a Spice Garden to learn about various spices grown in Sri Lanka.
**Afternoon (Kandy):** Visit the Temple of the Sacred Tooth Relic.
**Evening:** Attend a Kandyan Cultural Show, featuring traditional dance performances.
**Accommodation:** Comfortable hotel in Kandy.
**Meals:** Breakfast, Dinner`);
      setLoading(false);
    }, 1500);
  };

  // Function to parse and format the AI response
  const formatItinerary = (text) => {
    if (!text) return null;

    const lines = text.split('\n');
    const formattedContent = [];
    let currentSection = null;

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) return;

      if (trimmedLine.startsWith('## ')) {
        if (currentSection) formattedContent.push(currentSection);
        currentSection = {
          type: 'main-heading',
          content: trimmedLine.replace('## ', ''),
          items: []
        };
      }
      else if (trimmedLine.startsWith('### ')) {
        if (currentSection) formattedContent.push(currentSection);
        currentSection = {
          type: 'day-heading',
          content: trimmedLine.replace('### ', ''),
          items: []
        };
      }
      else if (trimmedLine.startsWith('**') && trimmedLine.includes(':**')) {
        const parts = trimmedLine.split(':**');
        const label = parts[0].replace(/\*\*/g, '');
        const value = parts[1]?.trim() || '';
        if (currentSection) {
          currentSection.items.push({ type: 'labeled', label, value });
        }
      }
      else if (trimmedLine.startsWith('*   ') || trimmedLine.startsWith('* ')) {
        const content = trimmedLine.replace(/^\*\s+/, '');
        if (currentSection) {
          currentSection.items.push({ type: 'bullet', content });
        }
      }
      else if (trimmedLine === '---') {
        if (currentSection) formattedContent.push(currentSection);
        currentSection = null;
        formattedContent.push({ type: 'divider' });
      }
      else {
        if (currentSection) {
          currentSection.items.push({ type: 'text', content: trimmedLine });
        } else {
          formattedContent.push({ type: 'paragraph', content: trimmedLine });
        }
      }
    });

    if (currentSection) formattedContent.push(currentSection);
    return formattedContent;
  };

  const renderItem = (item, index) => {
    if (item.type === 'labeled') {
      return (
        <div key={index} style={styles.labeledItem}>
          <span style={styles.label}>{item.label}:</span>
          <span style={styles.value}>{item.value}</span>
        </div>
      );
    }

    if (item.type === 'bullet') {
      return (
        <div key={index} style={styles.bulletItem}>
          <span style={styles.bulletPoint}>•</span>
          <span style={styles.bulletText}>{item.content.replace(/\*\*/g, '')}</span>
        </div>
      );
    }

    if (item.type === 'text') {
      return <p key={index} style={styles.textItem}>{item.content}</p>;
    }

    return null;
  };

  const renderFormattedItinerary = () => {
    const formatted = formatItinerary(itinerary);
    if (!formatted) return null;

    return formatted.map((section, idx) => {
      if (section.type === 'divider') {
        return <div key={idx} style={styles.divider}></div>;
      }

      if (section.type === 'paragraph') {
        return <p key={idx} style={styles.paragraph}>{section.content}</p>;
      }

      if (section.type === 'main-heading') {
        return (
          <div key={idx} style={styles.mainSection}>
            <h2 style={styles.mainHeading}>
              <span style={styles.headingIcon}>📋</span>
              {section.content}
            </h2>
            <div style={styles.sectionContent}>
              {section.items.map((item, i) => renderItem(item, i))}
            </div>
          </div>
        );
      }

      if (section.type === 'day-heading') {
        const dayNumber = section.content.match(/Day (\d+)/)?.[1];
        return (
          <div key={idx} style={styles.dayCard}>
            <div style={styles.dayHeader}>
              <div style={styles.dayBadge}>Day {dayNumber}</div>
              <h3 style={styles.dayTitle}>{section.content.replace(/Day \d+:\s*/, '')}</h3>
            </div>
            <div style={styles.dayContent}>
              {section.items.map((item, i) => renderItem(item, i))}
            </div>
          </div>
        );
      }

      return null;
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.glassCard}>
        <div style={styles.headerSection}>
          <div style={styles.iconBadge}>🌍</div>
          <h1 style={styles.title}>AI Trip Planner</h1>
          <p style={styles.subtitle}>Input your preferences and let our AI curate your perfect escape.</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.formStyle}>
          <div style={styles.inputRow}>
            <div style={styles.inputGroup}>
              <label style={styles.labelInput}>Destination</label>
              <input
                name="destination"
                placeholder="e.g. Paris, France"
                value={formData.destination}
                onChange={handleInputChange}
                style={styles.inputField}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.labelInput}>Duration (Days)</label>
              <input
                name="days"
                type="number"
                placeholder="e.g. 5"
                value={formData.days}
                onChange={handleInputChange}
                style={styles.inputField}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.labelInput}>Budget Level</label>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              style={styles.inputField}
            >
              <option value="Economy">Economy (Budget Friendly)</option>
              <option value="Medium">Medium (Balanced)</option>
              <option value="Luxury">Luxury (Premium Experience)</option>
            </select>
          </div>

          <button 
            onClick={generateAI} 
            disabled={loading} 
            style={loading ? {...styles.button, ...styles.btnDisabled} : styles.button}
          >
            {loading ? <div style={styles.spinner}></div> : "Generate Custom Itinerary"}
          </button>
        </div>

        {itinerary && (
          <div style={styles.resultSection}>
            <div style={styles.resultHeader}>
              <h3 style={styles.resultTitle}>
                <span style={styles.resultIcon}>✨</span>
                Your Personalized Itinerary for {formData.destination || "Your Destination"}
              </h3>
              <button style={styles.downloadBtn} onClick={() => window.print()}>
                📄 Download PDF
              </button>
            </div>
            <div style={styles.itineraryBox}>
              {renderFormattedItinerary()}
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "60px 20px",
    backgroundColor: "#f8fafc",
    minHeight: "90vh",
  },
  glassCard: {
    width: "100%",
    maxWidth: "1000px",
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "32px",
    boxShadow: "0 20px 60px rgba(17, 38, 71, 0.08)",
    border: "1px solid #f1f5f9",
  },
  headerSection: { textAlign: "center", marginBottom: "40px" },
  iconBadge: { fontSize: "45px", marginBottom: "10px" },
  title: { fontSize: "34px", fontWeight: "850", color: "#1e40af", letterSpacing: "-1px", margin: 0 },
  subtitle: { color: "#64748b", fontSize: "16px", marginTop: "10px" },
  formStyle: { display: "flex", flexDirection: "column", gap: "25px" },
  inputRow: { display: "flex", gap: "20px", flexWrap: "wrap" },
  inputGroup: { display: "flex", flexDirection: "column", flex: "1 1 200px", gap: "8px" },
  labelInput: { fontSize: "13px", fontWeight: "700", textTransform: "uppercase", color: "#1e40af", letterSpacing: "0.5px" },
  inputField: { padding: "15px", borderRadius: "14px", border: "1.5px solid #e2e8f0", fontSize: "16px", outline: "none", backgroundColor: "#fcfdff", boxSizing: "border-box" },
  button: { padding: "18px", backgroundColor: "#1e40af", color: "#fff", border: "none", borderRadius: "16px", fontSize: "16px", fontWeight: "700", cursor: "pointer", marginTop: "10px", boxShadow: "0 10px 25px rgba(30, 64, 175, 0.2)", transition: "all 0.3s ease" },
  btnDisabled: { opacity: 0.6, cursor: "not-allowed" },
  spinner: { width: "20px", height: "20px", border: "3px solid rgba(255,255,255,0.3)", borderTop: "3px solid #fff", borderRadius: "50%", margin: "0 auto", animation: "spin 0.8s linear infinite" },
  errorBox: { backgroundColor: "#fff5f5", color: "#c53030", padding: "16px", borderRadius: "12px", marginBottom: "20px", border: "1px solid #feb2b2", fontSize: "14px" },
  resultSection: { marginTop: "50px", borderTop: "2px solid #f1f5f9", paddingTop: "30px" },
  resultHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "15px" },
  resultTitle: { fontSize: "26px", fontWeight: "800", color: "#1e40af", margin: 0, display: "flex", alignItems: "center", gap: "10px" },
  resultIcon: { fontSize: "28px" },
  downloadBtn: { padding: "10px 20px", backgroundColor: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: "12px", fontSize: "14px", fontWeight: "600", color: "#475569", cursor: "pointer", transition: "all 0.3s ease" },
  itineraryBox: { backgroundColor: "#ffffff", padding: "0", borderRadius: "24px" },
  mainSection: { marginBottom: "40px" },
  mainHeading: { fontSize: "24px", fontWeight: "800", color: "#1e293b", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", paddingBottom: "15px", borderBottom: "3px solid #e0f2fe" },
  headingIcon: { fontSize: "26px" },
  sectionContent: { paddingLeft: "0" },
  dayCard: { backgroundColor: "#f8faff", border: "2px solid #e0f2fe", borderRadius: "20px", padding: "30px", marginBottom: "25px", boxShadow: "0 4px 15px rgba(59, 130, 246, 0.08)" },
  dayHeader: { marginBottom: "20px" },
  dayBadge: { display: "inline-block", backgroundColor: "#3b82f6", color: "#fff", padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "700", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" },
  dayTitle: { fontSize: "20px", fontWeight: "700", color: "#1e40af", margin: 0 },
  dayContent: { display: "flex", flexDirection: "column", gap: "12px" },
  labeledItem: { display: "flex", gap: "8px", padding: "12px 0", borderBottom: "1px solid #e0f2fe", alignItems: "flex-start" },
  label: { fontWeight: "700", color: "#1e40af", minWidth: "140px", fontSize: "14px" },
  value: { color: "#334155", fontSize: "14px", lineHeight: "1.6", flex: 1 },
  bulletItem: { display: "flex", gap: "12px", padding: "8px 0", alignItems: "flex-start" },
  bulletPoint: { color: "#3b82f6", fontSize: "20px", fontWeight: "bold", lineHeight: "1.4" },
  bulletText: { color: "#475569", fontSize: "14px", lineHeight: "1.7", flex: 1 },
  textItem: { color: "#475569", fontSize: "14px", lineHeight: "1.7", margin: "8px 0" },
  paragraph: { color: "#475569", fontSize: "15px", lineHeight: "1.8", margin: "15px 0" },
  divider: { height: "2px", backgroundColor: "#e0f2fe", margin: "30px 0", borderRadius: "2px" },
};

export default AIItinerary;