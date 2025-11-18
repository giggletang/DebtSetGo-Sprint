import { useState } from "react";
import { register } from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [username, setUsername] = useState(""); // mapped to fullName
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // password length / other errors
  const [info, setInfo] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");
    setInfo("");

    // password length check (>= 8)
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      const res = await register({
        email: emailOrPhone,
        fullName: username,
        password,
      });

      if (res.userId) {
        setInfo("✅ Registration successful. Redirecting to login...");
        setTimeout(() => {
          navigate("/");
        }, 800);
      } else if (res.message) {
        setError(res.message);
      } else {
        setError("Registration failed. Please check your input.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while registering. Please try again later.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>

        <input
          placeholder="Email / Phone Number"
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
        />
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Password (at least 8 characters)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleRegister}>Register</button>

        <p className="auth-link">
          Already have an account? <Link to="/">Login here</Link>
        </p>

        {error && <p className="error-message">{error}</p>}
        {info && <p>{info}</p>}
      </div>
    </div>
  );
}
