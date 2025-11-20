import { useState } from "react";
import { login } from "../api";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { ArrowLeft } from "lucide-react";

export default function Login({ setUserId, setUserName }) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

const handleLogin = async (e) => {
    e?.preventDefault();
    setError("");
    setLoading(true);

    if (!emailOrPhone || !password) {
      setError("Please enter both email/phone and password.");
      setLoading(false);
      return;
    }

    try {
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
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* Back to home link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Clickable Logo */}
        <Link to="/" className="flex justify-center hover:opacity-80 transition-opacity">
          <Logo size="lg" />
        </Link>

        <h1 className="text-2xl font-semibold text-slate-800 text-center">Sign in</h1>
        <form onSubmit={handleLogin} className="space-y-3">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          <div>
            <input 
              className="w-full border rounded-xl px-3 py-2" 
              placeholder="Email / Phone Number" 
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>
          <div>
            <input 
              type="password" 
              className="w-full border rounded-xl px-3 py-2" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>
          <button 
            disabled={loading} 
            className="w-full bg-blue-600 text-white rounded-xl py-2 disabled:opacity-50 hover:bg-blue-700 transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="text-center text-sm">No account? <Link to="/register" className="text-blue-600 hover:underline">Create one</Link></p>
      </div>
    </div>
  );
}
