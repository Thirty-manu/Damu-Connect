import { useState } from "react";
import { db } from "../firebase";
import { auth } from "../AuthContext";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import Spinner from "./Spinner";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const COUNTIES = [
  "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta",
  "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru",
  "Tharaka-Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua",
  "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot",
  "Samburu", "Trans Nzoia", "Uasin Gishu", "Elgeyo-Marakwet", "Nandi",
  "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho",
  "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya",
  "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi"
];

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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      await addDoc(collection(db, "requests"), {
        ...form,
        unitsNeeded: Number(form.unitsNeeded),
        status: "open",
        ownerId: auth.currentUser.uid,
        ownerEmail: auth.currentUser.email,
        createdAt: Timestamp.now(),
      });
      setStatus("Request posted! Nearby donors will be notified.");
      setForm({ hospitalName: "", bloodType: "", unitsNeeded: "", county: "", urgency: "moderate", contactPhone: "" });
    } catch (err) {
      console.error(err);
      setStatus("Error posting request. Check console.");
    }
    setLoading(false);
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
        <button type="submit" disabled={loading}>
          {loading && <Spinner />} {loading ? "Posting..." : "Post Request"}
        </button>
        {status && <p className="status-msg">{status}</p>}
      </form>
    </div>
  );
}
