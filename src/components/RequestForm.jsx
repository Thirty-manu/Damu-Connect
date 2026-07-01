import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const COUNTIES = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Uasin Gishu", "Kiambu", "Machakos"];

export default function RequestForm() {
  const [form, setForm] = useState({
    hospitalName: "",
    bloodType: "",
    unitsNeeded: "",
    county: "",
    urgency: "moderate",
    contactPhone: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Posting request...");
    try {
      await addDoc(collection(db, "requests"), {
        ...form,
        unitsNeeded: Number(form.unitsNeeded),
        status: "open",
        createdAt: Timestamp.now(),
      });
      setStatus("Request posted! Nearby donors will be notified.");
      setForm({ hospitalName: "", bloodType: "", unitsNeeded: "", county: "", urgency: "moderate", contactPhone: "" });
    } catch (err) {
      console.error(err);
      setStatus("Error posting request. Check console.");
    }
  };

  return (
    <div className="page-container">
      <h2>🏥 Post a Blood Request</h2>
      <form onSubmit={handleSubmit}>
        <input name="hospitalName" placeholder="Hospital / Requester Name" value={form.hospitalName} onChange={handleChange} required />
        <select name="bloodType" value={form.bloodType} onChange={handleChange} required>
          <option value="">Blood Type Needed</option>
          {BLOOD_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <input name="unitsNeeded" type="number" min="1" placeholder="Units Needed" value={form.unitsNeeded} onChange={handleChange} required />
        <select name="county" value={form.county} onChange={handleChange} required>
          <option value="">Select County</option>
          {COUNTIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select name="urgency" value={form.urgency} onChange={handleChange}>
          <option value="moderate">Moderate</option>
          <option value="critical">Critical</option>
        </select>
        <input name="contactPhone" placeholder="Contact Phone" value={form.contactPhone} onChange={handleChange} required />
        <button type="submit">Post Request</button>
        {status && <p className="status-msg">{status}</p>}
      </form>
    </div>
  );
}
