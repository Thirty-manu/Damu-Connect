import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const COUNTIES = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Uasin Gishu", "Kiambu", "Machakos"];

export default function DonorForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    bloodType: "",
    county: "",
    lastDonationDate: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");
    try {
      await addDoc(collection(db, "donors"), {
        ...form,
        available: true,
        consentToContact: true,
        createdAt: Timestamp.now(),
      });
      setStatus("Registered successfully! Thank you for saving lives.");
      setForm({ name: "", phone: "", bloodType: "", county: "", lastDonationDate: "" });
    } catch (err) {
      console.error(err);
      setStatus("Error saving donor. Check console.");
    }
  };

  return (
    <div className="page-container">
      <h2>🩸 Register as a Blood Donor</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
        <input name="phone" placeholder="Phone Number (07XX...)" value={form.phone} onChange={handleChange} required />
        <select name="bloodType" value={form.bloodType} onChange={handleChange} required>
          <option value="">Select Blood Type</option>
          {BLOOD_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select name="county" value={form.county} onChange={handleChange} required>
          <option value="">Select County</option>
          {COUNTIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <label style={{fontSize: "13px", color: "#94a3b8"}}>Last Donation Date (optional)</label>
        <input name="lastDonationDate" type="date" value={form.lastDonationDate} onChange={handleChange} />
        <button type="submit">Register as Donor</button>
        {status && <p className="status-msg">{status}</p>}
      </form>
    </div>
  );
}
