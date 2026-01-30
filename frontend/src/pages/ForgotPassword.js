import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/authService";
import { swalSuccess, swalError, swalLoading } from "../utils/swal";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // NEW: hold OTP returned from backend
  const [receivedOtp, setReceivedOtp] = useState("");
  // NEW: Delay state
  const [otpLoading, setOtpLoading] = useState(false);

  async function sendOtp() {
    if (!email.trim()) {
      swalError("Email Required", "Please enter your registered email.");
      return;
    }

    try {
      swalLoading("Generating OTP", "Please wait...");

      const res = await api.post("/auth/forgot-password", {
        email: email.trim(),
      });

      const otpFromBackend = res.data?.otp;

      //  OTP MUST BE VISIBLE (DEMO)
      if (otpFromBackend) {
        setReceivedOtp(String(otpFromBackend));
        setOtp(String(otpFromBackend)); // auto-fill
      }

      setOtpSent(true);

      swalSuccess(
        "OTP Generated",
        otpFromBackend
          ? `Your OTP is: ${otpFromBackend}`
          : "OTP has been sent to your email.",
      );
    } catch (err) {
      swalError(
        "Failed",
        err?.response?.data?.message || "Failed to send OTP.",
      );
    }
  }

  async function resetPassword() {
    if (!otp.trim() || !newPassword) {
      swalError("Missing Fields", "Please enter OTP and new password.");
      return;
    }

    try {
      swalLoading("Updating Password");

      await api.post("/auth/reset-password", {
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });

      swalSuccess("Password Updated", "Redirecting to login...");

      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      swalError(
        "Reset Failed",
        err?.response?.data?.message || "Something went wrong.",
      );
    }
  }

  return (
    <div className="forgot-wrapper">
      <div className="forgot-card fade-slide">
        <div className="forgot-title">Forgot Password</div>
        <div className="forgot-sub">
          Enter your registered email to receive an OTP
        </div>

        {message && (
          <div
            className={`forgot-alert ${isSuccess ? "forgot-alert-success" : "forgot-alert-error"} fade-slide`}
          >
            {message}
          </div>
        )}

        {/* Show OTP for demo */}
        {receivedOtp && !otpLoading && (
          <div
            className="forgot-alert forgot-alert-success fade-slide"
            style={{ fontWeight: 700 }}
          >
            OTP: {receivedOtp}
          </div>
        )}

        <div className="mb-3">
          <label className="stylish-label">Email address <span className="text-danger">*</span></label>
          <input
            className="stylish-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={otpSent}
          />
        </div>

        {/* Show OTP + Password fields only when OTP generated */}
        {otpSent && !otpLoading && (
          <>
            <div className="mb-3">
              <label className="stylish-label">OTP <span className="text-danger">*</span></label>
              <input
                className="stylish-input"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="stylish-label">New Password <span className="text-danger">*</span></label>
              <input
                className="stylish-input"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </>
        )}

        {/* Buttons */}
        <button
          type="button"
          className="stylish-btn"
          onClick={otpSent ? resetPassword : sendOtp}
          disabled={loading || otpLoading}
        >
          {loading
            ? "Processing..."
            : otpLoading
              ? "Generating OTP..."
              : otpSent
                ? "Chnage Password"
                : "Send OTP"}
        </button>

        <a className="small-link" href="/login">
          Back to Login
        </a>
      </div>
    </div>
  );
}
