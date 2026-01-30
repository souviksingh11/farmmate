import React from "react";

export default function Privacy({ lastUpdated }) {
  const updated = lastUpdated ? new Date(lastUpdated) : new Date();

  return (
    <div className="fm-legal-bg py-5">
      <div className="container" style={{ maxWidth: 1000 }}>
        <div className="fm-legal-card shadow-sm p-4 p-md-5 rounded-4">

          {/* Header */}
          <div className="d-flex align-items-start justify-content-between mb-3">
            <div>
              <h1 className="fm-legal-title mb-1">Privacy Policy</h1>
              <div className="text-muted small">
                Last updated: <strong>{updated.toLocaleDateString()}</strong>
                <span className="ms-3">Version: <strong>1.0.0</strong></span>
              </div>
            </div>

            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => window.print()}
            >
              Print / Save PDF
            </button>
          </div>

          {/* Intro */}
          <div className="fm-legal-intro mb-4">
            <p className="mb-0">
              This Privacy Policy outlines how <strong>FarmMate</strong> collects, uses,
              protects, and manages your information. Your privacy is important to us,
              and we are committed to safeguarding your personal data.
            </p>
          </div>

          {/* Table of Contents */}
          <nav className="fm-legal-toc mb-4">
            <strong>Contents</strong>
            <ul className="list-unstyled mt-2">
              <li><a href="#intro">1. Introduction</a></li>
              <li><a href="#data-we-collect">2. Information We Collect</a></li>
              <li><a href="#data-use">3. How We Use Your Data</a></li>
              <li><a href="#security">4. Data Protection</a></li>
              <li><a href="#cookies">5. Cookies</a></li>
              <li><a href="#rights">6. Your Rights</a></li>
              <li><a href="#apis">7. External APIs</a></li>
              <li><a href="#updates">8. Policy Updates</a></li>
              <li><a href="#contact">9. Contact Us</a></li>
            </ul>
          </nav>

          {/* Sections */}
          <section id="intro" className="fm-legal-section mb-3">
            <h4>1. Introduction</h4>
            <p>
              This Privacy Policy explains how <strong>FarmMate</strong> collects, uses, stores,
              and protects your information when you use our platform, services, and mobile
              applications.
            </p>
          </section>

          <section id="data-we-collect" className="fm-legal-section mb-3">
            <h4>2. Information We Collect</h4>
            <ul>
              <li>Personal details: name, email, password.</li>
              <li>Farm details: farm name, farm location.</li>
              <li>Crop images uploaded for AI disease detection.</li>
              <li>Usage analytics such as page visits and interactions.</li>
              <li>Device and log information for improving performance.</li>
            </ul>
          </section>

          <section id="data-use" className="fm-legal-section mb-3">
            <h4>3. How We Use Your Data</h4>
            <ul>
              <li>Generate AI-based crop disease analysis.</li>
              <li>Send weather alerts and market price updates.</li>
              <li>Enhance user experience and improve platform accuracy.</li>
              <li>Maintain and improve machine-learning training models.</li>
              <li>Personalize content such as fertilizer and irrigation insights.</li>
            </ul>
          </section>

          <section id="security" className="fm-legal-section mb-3">
            <h4>4. Data Protection</h4>
            <p>
              We use industry-standard security practices to safeguard your data. Your crop
              images, farm information, and personal details are encrypted and never sold to
              third-party companies.
            </p>
          </section>

          <section id="cookies" className="fm-legal-section mb-3">
            <h4>5. Cookies</h4>
            <p>
              FarmMate uses cookies and secure session tokens to maintain login sessions,
              improve app speed, and deliver personalized insights.
            </p>
          </section>

          <section id="rights" className="fm-legal-section mb-3">
            <h4>6. Your Rights</h4>
            <ul>
              <li>Request deletion of your account and stored data.</li>
              <li>Update or modify your profile details anytime.</li>
              <li>Withdraw your consent for alerts or notifications.</li>
              <li>Access information we store about you on request.</li>
            </ul>
          </section>

          <section id="apis" className="fm-legal-section mb-3">
            <h4>7. External APIs</h4>
            <p>
              FarmMate may use government or third-party APIs for weather, soil, and market
              data. Personal information is <strong>never</strong> shared with these services.
            </p>
          </section>

          <section id="updates" className="fm-legal-section mb-3">
            <h4>8. Policy Updates</h4>
            <p>
              We may revise this Privacy Policy from time to time to reflect new features,
              legal requirements, or improvements. Major updates will be notified to you
              through email or app notifications.
            </p>
          </section>

          <section id="contact" className="fm-legal-section mb-3">
            <h4>9. Contact Us</h4>
            <p>
              For privacy-related questions or concerns, contact us at:
              <br />
              <strong>privacy@farmmate.app</strong>
            </p>
          </section>

          {/* Footer small text */}
          <div className="text-muted small mt-4">
            <p className="mb-0">
              By using FarmMate, you consent to the practices outlined in this Privacy Policy.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
