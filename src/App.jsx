import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import DonorForm from "./components/DonorForm";
import RequestForm from "./components/RequestForm";
import RequestList from "./components/RequestList";

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <NavLink to="/" end>Register Donor</NavLink>
        <NavLink to="/request">Post Request</NavLink>
        <NavLink to="/requests">View Requests</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<DonorForm />} />
        <Route path="/request" element={<RequestForm />} />
        <Route path="/requests" element={<RequestList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
