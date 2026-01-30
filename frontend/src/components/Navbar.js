import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaLeaf, FaUserCircle, FaPowerOff } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { swalConfirm, swalSuccess } from "../utils/swal";


export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  async function onLogout() {
  const result = await swalConfirm({
    title: "Logout?",
    text: "You will be logged out of your account.",
    confirmText: "Logout",
  });

  if (!result.isConfirmed) return;

  try {
    // optional backend logout
    await (await import("../services/authService")).logout();
  } catch (_) {}

  setUser(null);
  localStorage.removeItem("token"); // if token stored

  swalSuccess("Logged Out", "You have been logged out successfully.");

  setTimeout(() => {
    navigate("/login");
  }, 700);
}


  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !e.target.closest(".fm-user-btn")
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="fm-navbar shadow-sm">
      {/* Logo & Branding */}
      <div className="d-flex align-items-center gap-2">
        <div className="fm-logo d-flex align-items-center justify-content-center">
          <FaLeaf className="text-white" />
        </div>
        <h5 className="m-0 fw-bold fm-brand">FarmMate</h5>
      </div>

      {/* Middle Nav Links */}
      <div className="d-none d-md-flex gap-3 fm-nav-links">
        {[
          { to: "/dashboard", label: "Dashboard" },
          { to: "/disease", label: "Disease" },
          { to: "/fertilizer", label: "Fertilizer" },
          { to: "/weather", label: "Weather" },
          { to: "/market", label: "Market" },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `fm-nav-link ${isActive ? "active" : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Right Side Auth */}
      <div className="d-flex align-items-center gap-3">
        {!user ? (
          <>
            <Link className="btn fm-btn-outline" to="/login">
              Login
            </Link>
            <Link className="btn fm-btn-primary" to="/register">
              Sign Up
            </Link>
          </>
        ) : (
          <div className="position-relative" ref={dropdownRef}>
            <button
              className="fm-user-btn d-flex align-items-center gap-2"
              onClick={() => setOpen(!open)}
            >
              <FaUserCircle size={22} />
              <span>{user?.name || "Profile"}</span>
            </button>

            {/* DROPDOWN */}
            {open && (
              <div className="fm-dropdown shadow-sm animate-fadeIn">
                <Link
                  to="/profile"
                  className="fm-dropdown-item"
                  onClick={() => setOpen(false)}
                >
                  <FaUserCircle className="me-2" /> Profile
                </Link>

                <button
                  className="fm-dropdown-item text-danger"
                  onClick={() => {
                    setOpen(false);
                    onLogout();
                  }}
                >
                  <FaPowerOff className="me-2" /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
