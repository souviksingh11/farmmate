export default function StatCard({ title, value, delta, icon }) {
  // Auto color delta: green if positive, red if negative
  const isNegative = delta?.trim().startsWith('-');
  const deltaColor = isNegative ? 'text-danger' : 'text-success';
  const arrow = isNegative ? '↓' : '↑';

  return (
    <div className="stat-card card border-0 shadow-sm rounded-4">
      <div className="card-body d-flex align-items-center justify-content-between">
        
        {/* Left Section */}
        <div>
          <div className="stat-title">{title}</div>
          <div className="stat-value">{value}</div>

          {delta && (
            <div className={`stat-delta ${deltaColor}`}>
              {arrow} {delta} this week
            </div>
          )}
        </div>

        {/* Icon Bubble */}
        <div className="stat-icon-wrapper">
          {icon}
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="stat-accent" />
    </div>
  );
}
