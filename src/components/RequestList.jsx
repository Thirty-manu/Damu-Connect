import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

export default function RequestList() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "requests"),
      where("status", "==", "open"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div className="page-container" style={{maxWidth: "600px"}}>
      <h2>🆘 Active Blood Requests</h2>
      {requests.length === 0 && <p style={{textAlign: "center", color: "#94a3b8"}}>No active requests right now.</p>}
      {requests.map((r) => (
        <div className="request-card" key={r.id}>
          <h3>{r.bloodType} needed — {r.unitsNeeded} unit(s)</h3>
          <p className={r.urgency === "critical" ? "urgency-critical" : ""}>
            Urgency: {r.urgency.toUpperCase()}
          </p>
          <p>{r.hospitalName} — {r.county}</p>
          <p>Contact: {r.contactPhone}</p>
        </div>
      ))}
    </div>
  );
}
