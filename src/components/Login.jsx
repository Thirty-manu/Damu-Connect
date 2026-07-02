import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../AuthContext";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-container">
      <h2>{isSignup ? "Create Account" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
        {error && <p style={{color: "#f87171", textAlign: "center"}}>{error}</p>}
      </form>
      <p style={{textAlign: "center", marginTop: "16px"}}>
        <span
          style={{color: "#f87171", cursor: "pointer"}}
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Already have an account? Login" : "No account? Sign up"}
        </span>
      </p>
    </div>
  );
}
