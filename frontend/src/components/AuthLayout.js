import '../assets/auth.css';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children }) {
  return (
    <div className="auth-bg">
      <div className="auth-overlay" />

      <div className="auth-container container">
        <div className="row justify-content-center align-items-center w-100">
          {/* Left side hero (desktop only) */}
          <div className="col-md-5 text-white d-none d-md-block pe-md-5">
            <div
              className="fw-bold mb-3"
              style={{ fontSize: 34, lineHeight: 1.1 }}
            >
              Smart farming,
              <br />
              powered by AI.
            </div>

            <p className="mb-3" style={{ fontSize: 13, maxWidth: 320 }}>
              FarmMate helps you detect crop diseases from leaf images, get
              fertilizer plans, track rainfall and check nearby mandi prices –
              all in one simple dashboard.
            </p>

            <ul className="list-unstyled small mb-3" style={{ opacity: 0.9 }}>
              <li className="mb-1">✅ Leaf disease detection in seconds</li>
              <li className="mb-1">✅ Location-based weather & rain alerts</li>
              <li className="mb-1">✅ Market price & sell timing guidance</li>
            </ul>

            <div className="d-flex align-items-center gap-2">
              <Link
                to="/register"
                className="btn btn-light btn-sm fw-semibold"
              >
                Get started
              </Link>
              <span className="small" style={{ opacity: 0.85 }}>
                No credit card. Just your farm details.
              </span>
            </div>
          </div>

          {/* Right side auth card */}
          <div className="col-12 col-md-7 col-lg-5">
            <div className="auth-card">
              <div className="auth-curve">
                {/* Logo / badge on the curve */}
                <div className="auth-logo-wrap">
                  <div className="auth-logo-badge">
                    🌾
                  </div>
                  <div>
                    <div className="auth-logo-text">FarmMate</div>
                    <div
                      style={{
                        fontSize: 11,
                        color: '#DCFCE7',
                        letterSpacing: '0.02em',
                      }}
                    >
                      Smarter decisions for every field
                    </div>
                  </div>
                </div>
              </div>

              <div className="auth-body">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
