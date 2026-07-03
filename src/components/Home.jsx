import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-hero">
      <h1>🩸 Damu Connect</h1>
      <p>Connecting willing blood donors with patients and hospitals across Kenya, in real time.</p>
      <div className="home-buttons">
        <Link to="/register" className="btn-donor">Become a Donor</Link>
        <Link to="/request" className="btn-request">Post a Request</Link>
      </div>
    </div>
  );
}
