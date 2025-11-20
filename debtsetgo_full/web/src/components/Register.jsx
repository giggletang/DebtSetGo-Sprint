import { useState } from "react";
import { register } from "../api";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { ArrowLeft } from "lucide-react";

export default function Register() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

   const handleRegister = async (e) => {
    e?.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    // Validation
    if (!emailOrPhone || !username || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
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
          navigate("/login");
        }, 800);
      } else if (res.message) {
        setError(res.message);
      } else {
        setError("Registration failed. Please check your input.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while registering. Please try again later.");
          } finally {
      setLoading(false);
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
    
            <h1 className="text-2xl font-semibold text-slate-800 text-center">Create account</h1>
            <form onSubmit={handleRegister} className="space-y-3">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}
              {info && !error && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                  {info}
                </div>
              )}
              <div>
                <input 
                  className="w-full border rounded-xl px-3 py-2" 
                  placeholder="Email / Phone Number" 
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <input 
                  className="w-full border rounded-xl px-3 py-2" 
                  placeholder="Full name" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <input 
                  type="password" 
                  className="w-full border rounded-xl px-3 py-2" 
                  placeholder="Password (at least 8 characters)" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <input 
                  type="password" 
                  className="w-full border rounded-xl px-3 py-2" 
                  placeholder="Confirm password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button 
                disabled={loading} 
                className="w-full bg-blue-600 text-white rounded-xl py-2 disabled:opacity-50 hover:bg-blue-700 transition-colors"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
            <p className="text-center text-sm">Already have an account? <Link to="/" className="text-blue-600 hover:underline">Sign in</Link></p>
          </div>
        </div>
      );
    }
