import { FaBell, FaExclamationTriangle, FaLeaf, FaInfoCircle } from 'react-icons/fa';

export default function NotificationPanel({ alerts = [], activities = [], advisories = [] }) {
  const totalNotifications = alerts.length + activities.length + advisories.length;

  return (
    <div className="card border-0 shadow-sm h-100 notif-card">
      <div className="card-body d-flex flex-column">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <div className="notif-icon-wrapper d-flex align-items-center justify-content-center">
              <FaBell />
            </div>
            <h5 className="mb-0">Notifications</h5>
          </div>
          <span className="badge rounded-pill notif-count-badge">
            {totalNotifications} new
          </span>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mb-3">
            <div className="d-flex align-items-center gap-2 mb-2">
              <FaExclamationTriangle className="text-warning" />
              <div className="fw-semibold">Alerts</div>
            </div>
            <div className="notif-alert-box">
              {alerts.map((msg, i) => (
                <div key={i} className="notif-alert-line">
                  <span className="notif-dot notif-dot-alert" />
                  <span>{msg}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="mb-3">
          <div className="d-flex align-items-center gap-2 mb-2">
            <FaLeaf className="text-success" />
            <div className="fw-semibold">Recent Activity</div>
          </div>

          {activities.length ? (
            <ul className="list-unstyled mb-0 notif-timeline">
              {activities.slice(0, 5).map((a) => (
                <li key={a.id} className="notif-timeline-item">
                  <div className="notif-timeline-marker">
                    <span className="notif-dot" />
                    <span className="notif-timeline-line" />
                  </div>
                  <div className="notif-timeline-content">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="notif-activity-title">{a.title}</span>
                      {typeof a.confidence === 'number' && (
                        <span className="badge rounded-pill notif-confidence-badge">
                          {Math.round(a.confidence <= 1 ? a.confidence * 100 : a.confidence)}%
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-muted small">No recent activity</div>
          )}
        </div>

        {/* Advisories */}
        <div className="mt-auto">
          <div className="d-flex align-items-center gap-2 mb-2">
            <FaInfoCircle className="text-primary" />
            <div className="fw-semibold">Advisories</div>
          </div>
          {advisories.length ? (
            <div className="d-flex flex-column gap-2">
              {advisories.map((m, i) => (
                <div key={i} className="notif-advisory">
                  {m}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted small">No advisories</div>
          )}
        </div>
      </div>
    </div>
  );
}
