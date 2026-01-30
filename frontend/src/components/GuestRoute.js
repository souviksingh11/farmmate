import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  // Show loader while checking auth status
  if (loading) {
    return (
      <div className="guest-loader">
        <div className="loader-ring"></div>
        <p className="text-muted mt-2">Loading...</p>
      </div>
    );
  }

  // If logged in → redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise → allow guest page (login/register)
  return <div className="guest-fade">{children}</div>;
}
