import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, orderBy, onSnapshot, getDocs } from "firebase/firestore";

export default function RequestList() {
  const [requests, setRequests] = useState([]);
  const [matches, setMatches] = useState({});
  const [loadingMatch, setLoadingMatch] = useState(null);

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

  const findMatches = async (request) => {
    setLoadingMatch(request.id);
    try {
      const donorsQuery = query(
        collection(db, "donors"),
        where("bloodType", "==", request.bloodType),
        where("county", "==", request.county),
        where("available", "==", true)
      );
      const snapshot = await getDocs(donorsQuery);
      const donorList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMatches((prev) => ({ ...prev, [request.id]: donorList }));
    } catch (err) {
      console.error(err);
      setMatches((prev) => ({ ...prev, [request.id]: [] }));
    }
    setLoadingMatch(null);
  };

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
          <button onClick={() => findMatches(r)} disabled={loadingMatch === r.id}>
            {loadingMatch === r.id ? "Searching..." : "Find Matching Donors"}
          </button>
          {matches[r.id] && (
            <div style={{marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #334155"}}>
              {matches[r.id].length === 0 ? (
                <p style={{color: "#f87171"}}>No available donors found nearby.</p>
              ) : (
                <>
                  <p style={{color: "#4ade80", fontWeight: 600}}>
                    {matches[r.id].length} matching donor(s) found:
                  </p>
                  {matches[r.id].map((d) => (
                    <div key={d.id} style={{background: "#1e293b", padding: "10px", borderRadius: "6px", marginBottom: "8px"}}>
                      <strong>{d.name}</strong> — {d.bloodType} — {d.phone}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
