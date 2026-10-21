import React, { useMemo, useState } from "react";
import API from "../api/api";

const BUDGET_OPTIONS = [
  { value: "Economy — USD $100 per traveler per day", name: "Economy", amount: "$100", detail: "per traveler / day" },
  { value: "Comfort — USD $250 per traveler per day", name: "Comfort", amount: "$250", detail: "per traveler / day" },
  { value: "Luxury — USD $500 per traveler per day", name: "Luxury", amount: "$500", detail: "per traveler / day" },
];

const cleanMarkdown = (value = "") => value.replace(/\*\*/g, "").replace(/`/g, "").trim();

const parseItinerary = (text) => {
  const result = { intro: [], days: [], sections: [] };
  let currentDay = null;
  let currentSection = null;

  String(text || "").split(/\r?\n/).forEach((sourceLine) => {
    const line = sourceLine.trim();
    if (!line || /^---+$/.test(line)) return;
    const plain = cleanMarkdown(line);
    const dayMatch = plain.match(/^(?:day\s*)?(\d+)\s*[:.)-]\s*(.*)$/i) || plain.match(/^day\s*(\d+)\s*(.*)$/i);
    const explicitDay = plain.match(/^day\s*(\d+)\b[\s:—-]*(.*)$/i);
    if (explicitDay || (/^#{1,4}\s*/.test(line) && /day\s*\d+/i.test(plain))) {
      const match = explicitDay || plain.match(/day\s*(\d+)\b[\s:—-]*(.*)$/i);
      currentDay = { number: match?.[1] || result.days.length + 1, title: match?.[2] || "Your plan", items: [] };
      result.days.push(currentDay); currentSection = null; return;
    }
    if (dayMatch && !currentDay) {
      currentDay = { number: dayMatch[1], title: dayMatch[2] || "Your plan", items: [] };
      result.days.push(currentDay); currentSection = null; return;
    }
    if (/^#{1,4}\s+/.test(line)) {
      currentDay = null;
      currentSection = { title: plain.replace(/^#+\s*/, ""), items: [] }; result.sections.push(currentSection); return;
    }
    const item = { text: plain, type: /^[-*•]\s+|^\d+[.)]\s+/.test(plain) ? "bullet" : "text" };
    item.text = item.text.replace(/^[-*•]\s+|^\d+[.)]\s+/, "");
    const label = item.text.match(/^([^:]{2,28}):\s+(.+)$/);
    if (label) { item.type = "label"; item.label = label[1]; item.text = label[2]; }
    if (currentDay) currentDay.items.push(item);
    else if (currentSection) currentSection.items.push(item);
    else result.intro.push(item);
  });
  return result;
};

const ItineraryItem = ({ item }) => item.type === "label" ? <div className="ai-detail"><strong>{item.label}</strong><span>{item.text}</span></div> : <li className={item.type === "bullet" ? "ai-bullet" : "ai-text"}>{item.text}</li>;

const AIItinerary = () => {
  const [formData, setFormData] = useState({ destination: "", days: "", budget: BUDGET_OPTIONS[1].value });
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const parsed = useMemo(() => parseItinerary(itinerary), [itinerary]);
  const selectedBudget = BUDGET_OPTIONS.find((item) => item.value === formData.budget) || BUDGET_OPTIONS[1];

  const generateAI = async (event) => {
    event.preventDefault(); setLoading(true); setError(""); setItinerary("");
    try {
      const response = await API.post("/ai/ai-generate", formData);
      setItinerary(response.data.itinerary || "");
    } catch (err) { setError(err.response?.data?.message || "Failed to generate an itinerary. Please try again."); }
    finally { setLoading(false); }
  };

  return <main className="ai-page"><section className="ai-hero"><p className="ai-eyebrow">TOURVISITO INTELLIGENCE</p><h1>Build a trip with a plan,<br /><em>not a blank page.</em></h1><p>Get a clear day-by-day itinerary, shaped around your destination, time, and real USD budget.</p></section>
    <section className="ai-workspace"><form className="ai-form" onSubmit={generateAI}>
      <div className="ai-form-header"><span>01</span><div><h2>Tell us the essentials</h2><p>We’ll turn them into an organized route.</p></div></div>
      {error && <div className="ai-error" role="alert">{error}</div>}
      <label>Destination<input name="destination" placeholder="Paris, France" value={formData.destination} onChange={(event) => setFormData({ ...formData, destination: event.target.value })} required /></label>
      <label>Duration (days)<input name="days" type="number" min="1" max="30" placeholder="5" value={formData.days} onChange={(event) => setFormData({ ...formData, days: event.target.value })} required /></label>
      <fieldset><legend>Daily budget, in USD</legend><div className="ai-budget-grid">{BUDGET_OPTIONS.map((option) => <label className={`ai-budget ${formData.budget === option.value ? "is-selected" : ""}`} key={option.name}><input type="radio" name="budget" value={option.value} checked={formData.budget === option.value} onChange={(event) => setFormData({ ...formData, budget: event.target.value })} /><b>{option.name}</b><strong>{option.amount}</strong><span>{option.detail}</span></label>)}</div></fieldset>
      <div className="ai-budget-summary">Estimated daily guide: <strong>{selectedBudget.amount} USD</strong> per traveler. Actual prices vary by destination and season.</div>
      <button className="ai-generate" type="submit" disabled={loading}>{loading ? "Designing your itinerary…" : "Generate itinerary ✦"}</button>
    </form>
    <section className="ai-result" aria-live="polite">{!itinerary && !loading && <div className="ai-empty"><span>✦</span><h2>Your itinerary will appear here</h2><p>Choose a destination, duration, and a daily USD budget to begin.</p></div>}{loading && <div className="ai-empty"><div className="ai-spinner" /><h2>Mapping out your days</h2><p>Finding a balanced route and budget-aware experiences.</p></div>}{itinerary && <><header className="ai-result-header"><div><p className="ai-eyebrow">YOUR CUSTOM ROUTE</p><h2>{formData.destination}</h2><span>{formData.days} days · {selectedBudget.name} · {selectedBudget.amount} USD/day</span></div><button className="ai-print" type="button" onClick={() => window.print()}>Print plan</button></header>{parsed.intro.length > 0 && <ul className="ai-intro">{parsed.intro.map((item, index) => <ItineraryItem key={index} item={item} />)}</ul>}{parsed.sections.map((section, index) => <section className="ai-section" key={`${section.title}-${index}`}><h3>{section.title}</h3><ul>{section.items.map((item, itemIndex) => <ItineraryItem key={itemIndex} item={item} />)}</ul></section>)}<div className="ai-days">{parsed.days.map((day) => <article className="ai-day" key={`${day.number}-${day.title}`}><header><span>DAY {day.number}</span><h3>{day.title}</h3></header><ul>{day.items.map((item, index) => <ItineraryItem key={index} item={item} />)}</ul></article>)}</div></>}</section></section>
    <style>{aiStyles}</style>
  </main>;
};

const aiStyles = `
.ai-page{padding:56px 0 84px;color:#112647}.ai-hero{max-width:950px;margin:0 auto 34px;padding:20px 24px}.ai-eyebrow{letter-spacing:.15em;font-size:11px;font-weight:800;color:#ee1660;margin:0 0 12px}.ai-hero h1{font-size:clamp(38px,7vw,70px);line-height:1.02;letter-spacing:-.065em;margin:0}.ai-hero em{color:#ee1660;font-style:normal}.ai-hero>p:last-child{max-width:590px;color:#66748a;line-height:1.65;font-size:17px}.ai-workspace{max-width:1120px;margin:auto;padding:0 24px;display:grid;grid-template-columns:minmax(300px,.82fr) minmax(0,1.3fr);gap:25px}.ai-form,.ai-result{border:1px solid #e6ebf2;border-radius:28px;background:white;box-shadow:0 16px 45px rgba(17,38,71,.07)}.ai-form{padding:30px;align-self:start}.ai-form-header{display:flex;gap:13px;margin-bottom:24px}.ai-form-header>span{width:34px;height:34px;display:grid;place-items:center;background:#112647;color:white;border-radius:11px;font-size:13px;font-weight:800}.ai-form h2,.ai-empty h2,.ai-result h2{margin:0;font-size:22px;letter-spacing:-.04em}.ai-form-header p,.ai-empty p{margin:5px 0 0;color:#718096;font-size:13px}.ai-form>label{display:grid;gap:7px;margin:16px 0;color:#334867;font-weight:750;font-size:13px}.ai-form input:not([type=radio]){box-sizing:border-box;width:100%;padding:13px;border:1px solid #dbe3ef;border-radius:12px;font:inherit;outline:none;background:#fbfcff}.ai-form input:focus{border-color:#ee1660;box-shadow:0 0 0 4px rgba(238,22,96,.11)}.ai-form fieldset{border:0;margin:23px 0 0;padding:0}.ai-form legend{font-size:13px;font-weight:800;color:#334867;margin-bottom:9px}.ai-budget-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.ai-budget{cursor:pointer;border:1px solid #dbe3ef;border-radius:14px;padding:12px 9px;display:grid;gap:3px;transition:.2s;background:#fbfcff}.ai-budget input{position:absolute;opacity:0}.ai-budget.is-selected{border-color:#ee1660;background:#fff5f8;box-shadow:0 5px 14px rgba(238,22,96,.1)}.ai-budget b{font-size:12px}.ai-budget strong{font-size:20px}.ai-budget span{font-size:10px;color:#718096}.ai-budget-summary{margin:16px 0;color:#68768c;font-size:12px;line-height:1.5}.ai-budget-summary strong{color:#112647}.ai-generate{width:100%;padding:15px;background:linear-gradient(115deg,#112647,#244f88 65%,#ee1660);border:0;border-radius:13px;color:white;font:inherit;font-weight:800;cursor:pointer;box-shadow:0 12px 24px rgba(17,38,71,.2);transition:.2s}.ai-generate:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 17px 30px rgba(17,38,71,.25)}.ai-generate:disabled{opacity:.7;cursor:wait}.ai-error{margin-bottom:16px;padding:11px;border-radius:12px;background:#fff3f6;color:#b1144b;font-size:13px}.ai-result{min-height:525px;padding:30px}.ai-empty{height:100%;min-height:460px;display:grid;place-content:center;text-align:center}.ai-empty>span{font-size:36px;color:#ee1660}.ai-spinner{width:30px;height:30px;border:3px solid #e7edf5;border-top-color:#ee1660;border-radius:50%;margin:0 auto 16px;animation:ai-spin .8s linear infinite}.ai-result-header{display:flex;justify-content:space-between;gap:18px;align-items:start;padding-bottom:20px;border-bottom:1px solid #edf0f5}.ai-result-header span{color:#718096;font-size:13px}.ai-print{border:1px solid #dbe3ef;background:white;color:#112647;padding:9px 12px;border-radius:10px;font:inherit;font-size:12px;font-weight:750;cursor:pointer}.ai-intro,.ai-section ul,.ai-day ul{list-style:none;margin:20px 0;padding:0}.ai-section h3{font-size:16px;margin:25px 0 4px}.ai-day{border:1px solid #e7ecf4;border-radius:18px;padding:20px;margin:14px 0;background:linear-gradient(135deg,#fff,#fbfcff)}.ai-day header{display:flex;gap:12px;align-items:center}.ai-day header span{background:#112647;color:#fff;padding:6px 8px;border-radius:8px;font-size:10px;font-weight:800;letter-spacing:.08em}.ai-day h3{margin:0;font-size:17px}.ai-day li,.ai-section li,.ai-intro li{color:#53627a;line-height:1.65;font-size:14px;margin:8px 0}.ai-bullet::before{content:"•";color:#ee1660;font-weight:900;margin-right:9px}.ai-detail{display:grid;grid-template-columns:125px 1fr;gap:9px;padding:8px 0;border-bottom:1px solid #edf0f5;font-size:13px;color:#53627a}.ai-detail strong{color:#112647}.ai-text{list-style:none}@keyframes ai-spin{to{transform:rotate(360deg)}}@media(max-width:780px){.ai-page{padding-top:30px}.ai-workspace{grid-template-columns:1fr;padding:0 14px}.ai-form,.ai-result{padding:22px}.ai-budget-grid{grid-template-columns:1fr}.ai-budget{grid-template-columns:1fr auto;align-items:center}.ai-budget span{grid-column:1/-1}.ai-detail{grid-template-columns:1fr}.ai-hero{padding:10px 20px}.ai-result-header{flex-direction:column}.ai-empty{min-height:260px}}@media print{.ai-hero,.ai-form,.ai-print,nav,footer{display:none!important}.ai-workspace{display:block;padding:0}.ai-result{box-shadow:none;border:0}}
`;

export default AIItinerary;
