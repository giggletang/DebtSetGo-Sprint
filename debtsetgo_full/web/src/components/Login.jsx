import { useState } from "react";
import { login } from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Login({ setUserId, setUserName }) 
 {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // red error text
  const [info, setInfo] = useState("");   // normal info text

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setInfo("");

    if (!emailOrPhone || !password) {
      setError("Please enter both email/phone and password.");
      return;
    }

    try {
      // Send emailOrPhone as "email" field to backend
      const res = await login({ email: emailOrPhone, password });

      if (res.userId) {
        setUserId(res.userId);
        localStorage.setItem("userId", res.userId);

        if (res.fullName) {
          setUserName(res.fullName);
          localStorage.setItem("userName", res.fullName);
        }

        navigate("/app");
      } else {
        setError("Incorrect email/phone or password. Please try again.");
      }

    } catch (err) {
      console.error(err);
      setError("An error occurred while logging in. Please try again later.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        <input
          placeholder="Email / Phone Number"
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button onClick={handleLogin}>Login</button>

        <p className="auth-link">
          New user? <Link to="/register">Register here</Link>
        </p>

        {error && <p className="error-message">{error}</p>}
        {info && !error && <p>{info}</p>}
      </div>
    </div>
  );
}
