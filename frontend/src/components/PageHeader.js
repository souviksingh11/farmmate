export default function PageHeader({ title, subtitle, badge, icon }) {
  return (
    <div className="page-header-container mb-4 p-3 p-md-4 rounded-4">
      <div className="d-flex align-items-center gap-3">

        {/* Optional Icon */}
        {icon && (
          <div className="page-header-icon d-flex align-items-center justify-content-center">
            {icon}
          </div>
        )}

        <div>
          <h2 className="page-header-title fw-bold mb-1">{title}</h2>
          {subtitle && <p className="page-header-subtitle mb-1">{subtitle}</p>}
          {badge && (
            <span className="page-header-badge">
              <span className="status-dot-header"></span>
              {badge}
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
