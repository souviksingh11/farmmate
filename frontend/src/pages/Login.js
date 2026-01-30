import React, { useState } from "react";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { swalError, swalSuccess } from "../utils/swal";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldError, setFieldError] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { setUser } = useAuth();
  const navigate = useNavigate();

  function validateForm() {
    const errors = {};
    if (!email.trim()) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";

    setFieldError(errors);
    return Object.keys(errors).length === 0;
  }

  function validateForm() {
    const errors = {};

    if (!email.trim()) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";

    setFieldError(errors);

    if (Object.keys(errors).length > 0) {
      swalError("Validation Error", "Please enter both email and password.");
      return false;
    }

    return true;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setFieldError({});

    if (!validateForm()) return;

    try {
      setLoading(true);

      const data = await login({ email, password });

      await swalSuccess("Login Successful", "Welcome back to FarmMate 🌱");

      setUser(data.user);
      navigate("/dashboard");
    } catch (err) {
      swalError(
        "Login Failed",
        err?.response?.data?.message ||
          "Invalid credentials. Please check your email or password.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      {/* Title */}
      <div className="auth-title mb-1">Welcome back</div>

      {/* Subtitle */}
      <div className="auth-sub mb-3">
        Sign in to access your farm dashboard, alerts and recommendations.
      </div>

      {/* Error alert */}
      {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}

      {/* Form */}
      <form onSubmit={onSubmit} noValidate>
        {/* Email field */}
        <div className="mb-3">
          <label className="form-label small text-muted mb-1">Email <span className="text-danger">*</span></label>
          <div className="auth-input-wrapper">
            <span className="auth-input-icon">
              <FaEnvelope />
            </span>
            <input
              type="email"
              className={
                "form-control auth-input" +
                (fieldError.email ? " is-invalid" : "")
              }
              placeholder="you@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {fieldError.email && (
            <div className="invalid-feedback d-block">{fieldError.email}</div>
          )}
        </div>

        {/* Password field */}
        <div className="mb-2">
          <label className="form-label small text-muted mb-1">Password <span className="text-danger">*</span></label>
          <div className="auth-input-wrapper">
            <span className="auth-input-icon">
              <FaLock />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              className={
                "form-control auth-input" +
                (fieldError.password ? " is-invalid" : "")
              }
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="auth-input-eye"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {fieldError.password && (
            <div className="invalid-feedback d-block">
              {fieldError.password}
            </div>
          )}
        </div>

        {/* Remember + forgot */}
        <div className="d-flex justify-content-between align-items-center mb-3 auth-muted">
          <div className="d-flex align-items-center">
            <input
              type="checkbox"
              className="form-check-input me-2"
              id="rememberMe"
            />
            <label htmlFor="rememberMe" className="form-check-label small">
              Remember me
            </label>
          </div>
          <Link to="/forgot-password" className="text-decoration-none small">
            Forgot password?
          </Link>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="btn btn-success auth-btn w-100 d-flex align-items-center justify-content-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              />
              Signing you in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="d-flex align-items-center gap-3 my-3">
        <div
          className="flex-grow-1"
          style={{ height: 1, background: "#e5e7eb" }}
        />
        {/* <span className="auth-muted" style={{ fontSize: 12 }}>
          Or continue with
        </span> */}
        {/* <div
          className="flex-grow-1"
          style={{ height: 1, background: '#e5e7eb' }}
        /> */}
      </div>

      {/* Social buttons */}
      {/* <div className="d-flex justify-content-center gap-2 auth-social mb-2">
        <button className="btn btn-light" type="button">
          G
        </button>
        <button className="btn btn-light" type="button">
          f
        </button>
        <button className="btn btn-light" type="button">
          
        </button>
      </div> */}

      {/* Switch to register */}
      <div className="text-center mt-2 auth-muted" style={{ fontSize: 13 }}>
        Don&apos;t have an account?{" "}
        <Link to="/register" className="text-decoration-none">
          Sign up
        </Link>
      </div>
    </AuthLayout>
  );
}

export default Login;
