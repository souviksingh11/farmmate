import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LandingRedirect() {
  const { user, loading } = useAuth();

  // Show loader while auth is being checked
  if (loading) {
    return (
      <div className="landing-loader">
        <div className="loader-ring"></div>
        <p className="text-muted mt-2">Loading...</p>
      </div>
    );
  }

  // Redirect based on login state
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}
