import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import api from "../lib/axios";

const LoginPage = () => {
  const [adminTaz, setAdminTaz] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    setMessage("");
    setIsLoading(true);
    
    try {
      const response = await api.get("/SystemLogin", {
        params: {
          adminTaz: adminTaz,
          adminPassword: adminPassword
        }
      });
      
      if (response.data === true) {
        console.log("Login successful", response.data);
        
        login();
        
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        setMessage("Login Error");
      }

    } catch (error) {
      console.error("Login error:", error);
      setMessage("Login Error");

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Wallet </h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Admin TAZ Input */}
          <div>
            <label htmlFor="adminTaz" className="block text-sm font-medium text-gray-300 mb-2">
              Admin TAZ
            </label>
            <input
              type="text"
              id="adminTaz"
              value={adminTaz}
              onChange={(e) => setAdminTaz(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 transition-colors"
              placeholder="Enter Admin TAZ"
              required
            />
          </div>

          {/* Admin Password Input */}
          <div>
            <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Admin Password
            </label>
            <input
              type="password"
              id="adminPassword"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 transition-colors"
              placeholder="Enter Admin Password"
              required
            />
          </div>

          {/* Message Display Area */}
          {message && (
            <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-800 rounded-lg py-2 px-4">
              {message}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;