export default function QuickAction({ color, icon, title, subtitle, onClick }) {
  return (
    <div
      className="quick-card card border-0 shadow-sm rounded-4"
      onClick={onClick}
      role="button"
    >
      <div className="card-body d-flex align-items-center gap-3 py-3">

        {/* Icon Bubble */}
        <div
          className="quick-icon-wrapper"
          style={{
            background: color,
          }}
        >
          {icon}
        </div>

        {/* Text Content */}
        <div>
          <div className="quick-title">{title}</div>
          <div className="quick-subtitle">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}
