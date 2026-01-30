import React, { useState } from 'react';
import { register as registerUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { FaUser, FaMapMarkerAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTractor } from "react-icons/fa";
import { swalSuccess, swalError } from '../utils/swal';


function Register() {
  const [name, setName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [agree, setAgree] = useState(false);

  const [fieldError, setFieldError] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuth();
  const navigate = useNavigate();

  function validateForm() {
  if (!name.trim()) {
    swalError('Full Name Required', 'Please enter your full name.');
    return false;
  }

  if (!email.trim()) {
    swalError('Email Required', 'Please enter your email address.');
    return false;
  }

  if (!password) {
    swalError('Password Required', 'Please create a password.');
    return false;
  }

  if (password.length < 6) {
    swalError(
      'Weak Password',
      'Password must be at least 6 characters long.'
    );
    return false;
  }

  if (!confirmPassword) {
    swalError(
      'Confirm Password',
      'Please confirm your password.'
    );
    return false;
  }

  if (password !== confirmPassword) {
    swalError(
      'Password Mismatch',
      'Password and confirm password do not match.'
    );
    return false;
  }

  if (!agree) {
    swalError(
      'Agreement Required',
      'You must agree to the Terms & Privacy Policy.'
    );
    return false;
  }

  return true;
}


  async function onSubmit(e) {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    setLoading(true);

    const data = await registerUser({
      name,
      email,
      password,
      farmName,
      location,
    });

    // ✅ SUCCESS SWEETALERT (auto close, no OK)
    await swalSuccess(
      'Account Created ',
      'Welcome to FarmMate...'
    );

    setUser(data.user);
    navigate('/dashboard');

  } catch (err) {
    swalError(
      'Registration Failed',
      err?.response?.data?.message ||
        'Unable to create account. Please try again.'
    );
  } finally {
    setLoading(false);
  }
}


  return (
    <AuthLayout>
      <div className="auth-title mb-1">Create your FarmMate account</div>
      <div className="auth-sub mb-3">
        Get AI-powered crop care, weather alerts and mandi insights tailored to your farm.
      </div>

      {error && (
        <div className="alert alert-danger py-2 mb-3">{error}</div>
      )}

      <form onSubmit={onSubmit} noValidate>

        {/* FULL NAME FIELD */}
        <div className="mb-3">
          <label className="form-label small text-muted mb-1">Full Name <span className="text-danger">*</span></label>
          <div className="auth-input-wrapper">
            <span className="auth-input-icon"><FaUser /></span>
            <input
              className={`form-control auth-input ${fieldError.name ? 'is-invalid' : ''}`}
              placeholder="e.g. Souvik Singh"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {fieldError.name && <div className="invalid-feedback d-block">{fieldError.name}</div>}
        </div>


        {/* FARM NAME FIELD */}
        <div className="mb-3">
          <label className="form-label small text-muted mb-1">Farm Name <span className="text-muted" style={{ fontSize: 12 }}>(optional)</span></label>
          <div className="auth-input-wrapper">
            <span className="auth-input-icon"><FaTractor /></span>
            <input
              className="form-control auth-input"
              placeholder="e.g. Green Valley Farms"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
            />
          </div>
        </div>


        {/* LOCATION FIELD */}
        <div className="mb-3">
          <label className="form-label small text-muted mb-1">Location <span className="text-muted" style={{ fontSize: 12 }}>(optional)</span></label>

          <div className="auth-input-wrapper">
            <span className="auth-input-icon"><FaMapMarkerAlt /></span>
            <input
              className="form-control auth-input"
              placeholder="Village / District / State"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="form-text" style={{ fontSize: 11 }}>
            Used for accurate weather, rainfall and mandi price suggestions.
          </div>
        </div>


        {/* EMAIL FIELD */}
        <div className="mb-3">
          <label className="form-label small text-muted mb-1">Email <span className="text-danger">*</span></label>
          <div className="auth-input-wrapper">
            <span className="auth-input-icon"><FaEnvelope /></span>
            <input
              type="email"
              className={`form-control auth-input ${fieldError.email ? 'is-invalid' : ''}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {fieldError.email && <div className="invalid-feedback d-block">{fieldError.email}</div>}
        </div>


        {/* PASSWORD FIELD */}
        <div className="mb-3">
          <label className="form-label small text-muted mb-1">Password <span className="text-danger">*</span></label>
          <div className="auth-input-wrapper">
            <span className="auth-input-icon"><FaLock /></span>
            <input
              type={showPassword ? "text" : "password"}
              className={`form-control auth-input ${fieldError.password ? 'is-invalid' : ''}`}
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="auth-input-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {fieldError.password ? (
            <div className="invalid-feedback d-block">{fieldError.password}</div>
          ) : (
            <div className="form-text" style={{ fontSize: 11 }}>
              At least 6 characters. Use a mix of letters & numbers.
            </div>
          )}
        </div>


        {/* CONFIRM PASSWORD FIELD */}
        <div className="mb-3">
          <label className="form-label small text-muted mb-1">Confirm Password <span className="text-danger">*</span></label>
          <div className="auth-input-wrapper">
            <span className="auth-input-icon"><FaLock /></span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className={`form-control auth-input ${fieldError.confirmPassword ? 'is-invalid' : ''}`}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="auth-input-eye"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {fieldError.confirmPassword && (
            <div className="invalid-feedback d-block">{fieldError.confirmPassword}</div>
          )}
        </div>


        {/* TERMS CHECKBOX */}
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className={`form-check-input ${fieldError.agree ? 'is-invalid' : ''}`}
            id="agree"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <label className="form-check-label small" htmlFor="agree">
            I agree to the <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>. <span className="text-danger">*</span>
          </label>
          {fieldError.agree && (
            <div className="invalid-feedback d-block">{fieldError.agree}</div>
          )}
        </div>


        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="btn btn-success auth-btn w-100 d-flex align-items-center justify-content-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Creating your account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>


      {/* Divider */}
      <div className="d-flex align-items-center gap-3 my-3">
        <div className="flex-grow-1" style={{ height: 1, background: '#e5e7eb' }} />
        {/* <span className="auth-muted" style={{ fontSize: 12 }}>Or continue with</span>
        <div className="flex-grow-1" style={{ height: 1, background: '#e5e7eb' }} /> */}
      </div>

      {/* Social buttons */}
      {/* <div className="d-flex justify-content-center gap-2 auth-social mb-2">
        <button className="btn btn-light">G</button>
        <button className="btn btn-light">f</button>
        <button className="btn btn-light"></button>
      </div> */}

      {/* Switch to login */}
      <div className="text-center mt-2 auth-muted" style={{ fontSize: 13 }}>
        Already have an account?{' '}
        <Link to="/login" className="text-decoration-none">Sign in</Link>
      </div>
    </AuthLayout>
  );
}

export default Register;
