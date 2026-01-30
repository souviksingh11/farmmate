import {
  FaEnvelope,
  FaPhoneAlt,
  FaQuestionCircle,
  FaInfoCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { swalConfirm } from "../utils/swal";

export default function Help() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleProtectedLink(path) {
    if (!user) {
      const result = await swalConfirm({
        title: "Login Required",
        text: "Please login to access this feature.",
        confirmText: "Go to Login",
      });

      if (result.isConfirmed) {
        navigate("/login");
      }
      return;
    }

    navigate(path);
  }
  return (
    <div className="fm-help-page py-5">
      <div className="container">
        {/* Hero Section */}
        <div className="text-center mb-5">
          <h1 className="fw-bold">Help & Support</h1>
          <p className="text-muted fs-5">
            We're here to assist you with anything related to FarmMate.
          </p>
        </div>

        <div className="row g-4">
          {/* Contact Card */}
          <div className="col-12 col-lg-4">
  <div className="fm-help-card card border-0 shadow-sm h-100 text-center overflow-hidden">

    {/* Header */}
    <div
      className="py-4"
      style={{
        background: 'linear-gradient(135deg, #198754, #2ecc71)',
        color: '#fff',
      }}
    >
      <div
        className="mx-auto mb-2 d-flex align-items-center justify-content-center"
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          fontSize: 28,
        }}
      >
        <FaEnvelope />
      </div>
      <h5 className="fw-semibold mb-0">Contact Us</h5>
      <small style={{ opacity: 0.9 }}>
        We’re available 24/7
      </small>
    </div>

    {/* Body */}
    <div className="p-4">

      <div className="mb-3">
        <div className="text-muted small mb-1">Email us anytime</div>
        <a
          href="mailto:suppportfarmmate@gmail.com"
          className="fw-semibold text-decoration-none"
          style={{ color: '#198754' }}
        >
          suppportfarmmate@gmail.com
        </a>
      </div>

      <hr />

      <div className="text-muted small mb-2">
        Emergency Helpline
      </div>

      {[
        '+91 95475 31762',
        '+91 75848 96393',
        '+91 62962 15372',
        '+91 62959 42970',
      ].map((phone) => (
        <a
          key={phone}
          href={`tel:${phone.replace(/\s+/g, '')}`}
          className="d-flex align-items-center justify-content-center gap-2 fw-semibold text-decoration-none mb-2"
          style={{ color: '#212529' }}
        >
          <FaPhoneAlt className="text-success" size={14} />
          {phone}
        </a>
      ))}
    </div>
  </div>
</div>


          {/* FAQ Section */}
          <div className="col-12 col-lg-8">
  <div className="card border-0 shadow-sm h-100 overflow-hidden">

    {/* Header */}
    <div
      className="px-4 py-3"
      style={{
        background: 'linear-gradient(135deg, #e9f7ef, #f8fff9)',
      }}
    >
      <h5 className="fw-bold mb-0 d-flex align-items-center">
        <FaQuestionCircle className="text-success me-2" />
        Frequently Asked Questions
      </h5>
    </div>

    {/* Body */}
    <div className="p-4">

      <div className="fm-faq-item">
        <h6 className="fw-semibold">
          🌾 How do I upload a crop image?
        </h6>
        <p className="text-muted mb-0">
          Go to the <strong>Disease Detection</strong> page and use the
          Upload Image button.
        </p>
      </div>

      <hr />

      <div className="fm-faq-item">
        <h6 className="fw-semibold">
          🤖 How does AI detect diseases?
        </h6>
        <p className="text-muted mb-0">
          FarmMate uses AI models trained on thousands of real crop disease
          images to identify symptoms accurately.
        </p>
      </div>

      <hr />

      <div className="fm-faq-item">
        <h6 className="fw-semibold">
          🧑‍🌾 Can I update my farm details?
        </h6>
        <p className="text-muted mb-0">
          Yes, open the <strong>Profile</strong> section to edit your farm
          name, location, and details.
        </p>
      </div>

      <hr />

      <div className="fm-faq-item">
        <h6 className="fw-semibold">
          🌦 Why is my weather data not showing?
        </h6>
        <p className="text-muted mb-0">
          Ensure your location is set correctly and your internet
          connection is stable.
        </p>
      </div>

    </div>
  </div>
</div>

        </div>

        {/* Quick Links */}
        <div className="row mt-5 g-3">
          <div className="col-12">
            <h4 className="fw-bold mb-3">
              <FaInfoCircle className="text-success me-2" />
              Quick Help Links
            </h4>
          </div>

          <div className="col-6 col-md-3">
            <button
              onClick={() => handleProtectedLink("/disease")}
              className="fm-help-link card shadow-sm p-3 text-center border-0 w-100"
            >
              Disease Detection Guide
            </button>
          </div>

          <div className="col-6 col-md-3">
            <button
              onClick={() => handleProtectedLink("/fertilizer")}
              className="fm-help-link card shadow-sm p-3 text-center border-0 w-100"
            >
              Fertilizer Recommendations
            </button>
          </div>

          <div className="col-6 col-md-3">
            <button
              onClick={() => handleProtectedLink("/weather")}
              className="fm-help-link card shadow-sm p-3 text-center border-0 w-100"
            >
              Weather Support
            </button>
          </div>

          <div className="col-6 col-md-3">
            <button
              onClick={() => handleProtectedLink("/market")}
              className="fm-help-link card shadow-sm p-3 text-center border-0 w-100"
            >
              Market Price Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
