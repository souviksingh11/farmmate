import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();   // <-- loading added
  const [fadeIn, setFadeIn] = useState(false);

  // Smooth fade-in after authentication is confirmed
  useEffect(() => {
    if (!loading) {
      setTimeout(() => setFadeIn(true), 50);
    }
  }, [loading]);

  // Show loader while verifying user
  if (loading) {
    return (
      <div className="protected-loader">
        <div className="loader-ring"></div>
        <p className="text-muted mt-2">Checking authentication...</p>
      </div>
    );
  }

  // If not logged in → redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Show children with fade animation
  return <div className={`protected-content ${fadeIn ? "fade-in" : ""}`}>{children}</div>;
}
