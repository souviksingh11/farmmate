import { Link } from 'react-router-dom';
import { FaLeaf, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="fm-footer">
      <div className="container py-5">
        <div className="row g-4">

          {/* Brand */}
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="fm-footer-logo">
                <FaLeaf />
              </div>
              <h5 className="mb-0 fw-bold">FarmMate</h5>
            </div>

            <p className="fm-footer-desc">
              AI-powered disease detection, fertilizer planning, weather insights,
              and market trends — built for modern farmers.
            </p>
          </div>

          {/* Product */}
          <div className="col-6 col-md-2">
            <h6 className="fm-footer-title">Product</h6>
            <ul className="fm-footer-links">
              <li><Link to="/dashboard">Overview</Link></li>
              <li><Link to="/disease">Disease Detection</Link></li>
              <li><Link to="/fertilizer">Fertilizer Guide</Link></li>
              <li><Link to="/weather">Weather Insights</Link></li>
              <li><Link to="/market">Market Prices</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-6 col-md-3">
            <h6 className="fm-footer-title">Resources</h6>
            <ul className="fm-footer-links">
              <li><Link to="/help">Support</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Use</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-12 col-md-3">
            <h6 className="fm-footer-title">Contact</h6>

            <div className="fm-footer-contact">
              <FaEnvelope />
              <a href="mailto:supportfarmmate@gmail.com">
                supportfarmmate@gmail.com
              </a>
            </div>

            <div className="fm-footer-contact">
              <FaMapMarkerAlt />
              India • Local crop optimization
            </div>
          </div>
        </div>

        <hr className="fm-footer-divider" />

        <div className="d-flex justify-content-between flex-wrap gap-2 fm-footer-bottom">
          <span>© {year} FarmMate. All rights reserved.</span>
          <span className="text-muted">Empowering Farmers with AI 🌱</span>
        </div>
      </div>
    </footer>
  );
}
