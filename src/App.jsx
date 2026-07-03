import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Home from "./components/Home";
import DonorForm from "./components/DonorForm";
import RequestForm from "./components/RequestForm";
import RequestList from "./components/RequestList";
import Login from "./components/Login";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p style={{textAlign: "center", marginTop: "40px"}}>Loading...</p>;
  return user ? children : <Navigate to="/login" />;
}

function NavBar() {
  const { user, logout } = useAuth();
  return (
    <nav className="navbar">
      <NavLink to="/" end>Home</NavLink>
      <NavLink to="/register">Register Donor</NavLink>
      <NavLink to="/request">Post Request</NavLink>
      <NavLink to="/requests">View Requests</NavLink>
      {user ? (
        <a onClick={logout} style={{cursor: "pointer"}}>Logout ({user.email})</a>
      ) : (
        <NavLink to="/login">Login</NavLink>
      )}
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<DonorForm />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/request"
            element={
              <ProtectedRoute>
                <RequestForm />
              </ProtectedRoute>
            }
          />
          <Route path="/requests" element={<RequestList />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
