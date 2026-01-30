import React from 'react';

export default function Terms({ lastUpdated }) {
  const updated = lastUpdated ? new Date(lastUpdated) : new Date();

  return (
    <div className="fm-legal-bg py-5">
      <div className="container" style={{ maxWidth: 1000 }}>
        <div className="fm-legal-card shadow-sm p-4 p-md-5 rounded-4">

          {/* Header */}
          <div className="d-flex align-items-start justify-content-between mb-3">
            <div>
              <h1 className="fm-legal-title mb-1">Terms &amp; Conditions</h1>
              <div className="text-muted small">
                Last updated: <strong>{updated.toLocaleDateString()}</strong>
                <span className="text-muted ms-3">Version: <strong>1.0.0</strong></span>
              </div>
            </div>

            <div className="text-end">
              <button
                className="btn btn-outline-secondary btn-sm me-2"
                onClick={() => window.print()}
                aria-label="Print or save terms as PDF"
              >
                Print / Save PDF
              </button>
              <a href="/privacy" className="btn btn-outline-primary btn-sm">Privacy Policy</a>
            </div>
          </div>

          {/* Intro summary */}
          <div className="fm-legal-intro mb-4">
            <p className="mb-0">
              These Terms &amp; Conditions (the "Terms") govern your access to and use of the FarmMate platform,
              including the website and mobile applications (collectively, the "Service"). By using the Service,
              you agree to these Terms. Please read them carefully.
            </p>
          </div>

          {/* Table of contents */}
          <nav className="fm-legal-toc mb-4">
            <strong>Contents</strong>
            <ul className="list-unstyled ms-0 mt-2">
              <li><a href="#introduction">1. Introduction</a></li>
              <li><a href="#eligibility">2. Eligibility</a></li>
              <li><a href="#user-responsibilities">3. User Responsibilities</a></li>
              <li><a href="#services">4. Services Provided</a></li>
              <li><a href="#intellectual-property">5. Intellectual Property</a></li>
              <li><a href="#liability">6. Limitations of Liability</a></li>
              <li><a href="#account-suspension">7. Account Suspension</a></li>
              <li><a href="#changes">8. Changes to Terms</a></li>
              <li><a href="#governing-law">9. Governing Law</a></li>
              <li><a href="#contact">10. Contact</a></li>
            </ul>
          </nav>

          {/* Sections */}
          <section id="introduction" className="fm-legal-section mb-3">
            <h4>1. Introduction</h4>
            <p>
              Welcome to <strong>FarmMate</strong>. These Terms set out the legal terms that apply to your use of the Service.
              By accessing or using the Service you accept and agree to be bound by these Terms.
            </p>
          </section>

          <section id="eligibility" className="fm-legal-section mb-3">
            <h4>2. Eligibility</h4>
            <p>
              The Service is intended for users who are at least 18 years old. By registering, you represent that you are
              18 years of age or older and have the legal capacity to form a binding contract.
            </p>
          </section>

          <section id="user-responsibilities" className="fm-legal-section mb-3">
            <h4>3. User Responsibilities</h4>
            <ul>
              <li>Provide accurate and complete account and farm information.</li>
              <li>Keep your login credentials secure and promptly inform us of any unauthorized access.</li>
              <li>Use the Service only for lawful purposes and in compliance with all applicable laws.</li>
              <li>Not attempt to gain unauthorized access to other accounts or systems.</li>
            </ul>
          </section>

          <section id="services" className="fm-legal-section mb-3">
            <h4>4. Services Provided</h4>
            <p>
              FarmMate offers features including AI-powered crop disease detection, fertilizer and irrigation recommendations,
              weather forecasting, and market price guidance. These features are intended to support decision-making; they are
              advisory only and do not substitute for professional agronomic or financial advice.
            </p>
          </section>

          <section id="intellectual-property" className="fm-legal-section mb-3">
            <h4>5. Intellectual Property</h4>
            <p>
              All content, graphics, and software on the Service are owned or licensed by FarmMate. You are granted a limited,
              non-exclusive, non-transferable license to use the Service for personal or farm management purposes.
            </p>
          </section>

          <section id="liability" className="fm-legal-section mb-3">
            <h4>6. Limitations of Liability</h4>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, FARMMATE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              CONSEQUENTIAL, OR PUNITIVE DAMAGES OR FOR ANY LOSS OF PROFITS OR REVENUE ARISING OUT OF YOUR USE OF THE SERVICE.
              FARMMATE'S TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY YOU FOR THE SERVICE IN THE PRIOR 12 MONTHS.
            </p>
          </section>

          <section id="account-suspension" className="fm-legal-section mb-3">
            <h4>7. Account Suspension</h4>
            <p>
              We reserve the right to suspend or terminate accounts for violations of these Terms, fraudulent activity,
              or misuse of the Service. We will notify you when feasible and provide reasons for suspension where appropriate.
            </p>
          </section>

          <section id="changes" className="fm-legal-section mb-3">
            <h4>8. Changes to Terms</h4>
            <p>
              FarmMate may modify these Terms from time to time. We will post the updated Terms on the Service and indicate
              the effective date. Continued use of the Service after such posting constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section id="governing-law" className="fm-legal-section mb-3">
            <h4>9. Governing Law</h4>
            <p>
              These Terms are governed by the laws of the Republic of India. Any disputes arising under these Terms will be
              subject to the exclusive jurisdiction of the courts in your principal place of residence, to the extent permitted by law.
            </p>
          </section>

          <section id="contact" className="fm-legal-section mb-3">
            <h4>10. Contact</h4>
            <p>
              If you have questions about these Terms, contact us at:
              <br />
              <strong>support@farmmate.app</strong>
            </p>
          </section>

          {/* Footer small print */}
          <div className="text-muted small mt-4">
            <p className="mb-0">
              <strong>Note:</strong> These Terms do not create any employment, agency, partnership or joint venture relationship
              between you and FarmMate. If any provision of these Terms is held to be invalid or unenforceable, the remaining
              provisions will continue to be valid and enforceable.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
