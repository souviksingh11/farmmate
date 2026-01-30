import { Link } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";

export default function Home() {
  return (
    <div className="fm-home-hero d-flex align-items-center">
      <div className="container py-5">
        <div className="row align-items-center g-4">
          
          {/* Left Content */}
          <div className="col-12 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-2">
              <div className="fm-home-logo">
                <FaLeaf className="text-white" />
              </div>
              <h1 className="fw-bold mb-0">FarmMate</h1>
            </div>

            <h2 className="fw-bold mt-3 mb-3" style={{ lineHeight: "1.3" }}>
              Your AI-Powered  
              <br />
              Smart Farming Assistant
            </h2>

            <p className="text-secondary fs-5 mb-4">
              Detect crop diseases, get fertilizer recommendations, monitor weather, and track farm activity — 
              all in one intelligent platform.
            </p>

            <div className="d-flex flex-wrap gap-3">
              <Link to="/register" className="btn fm-btn-primary fm-hover-lift px-4 py-2">
                Get Started
              </Link>

              <Link to="/login" className="btn fm-btn-outline fm-hover-lift px-4 py-2">
                Login
              </Link>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="col-12 col-md-6 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2906/2906923.png"
              alt="Farming illustration"
              className="img-fluid fm-home-illustration"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
