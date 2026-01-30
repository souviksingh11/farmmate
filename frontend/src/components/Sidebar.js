import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUserShield } from 'react-icons/fa';
import {
  FaLeaf,
  FaTachometerAlt,
  FaVial,
  FaCloudSun,
  FaChartLine,
  FaHistory,
  FaMicroscope,
  FaBars,
  FaChevronLeft,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // 🔐 hide sidebar completely if not logged in
  if (!user) return null;

  const navItems = [
    { to: '/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { to: '/disease', icon: <FaMicroscope />, label: 'Disease Detection' },
    { to: '/fertilizer', icon: <FaVial />, label: 'Fertilizer Guide' },
    { to: '/weather', icon: <FaCloudSun />, label: 'Weather Forecast' },
    { to: '/market', icon: <FaChartLine />, label: 'Market Prices' },
    { to: '/history', icon: <FaHistory />, label: 'Farm History' },
  ];

  if (user?.role === 'admin') {
  navItems.push({
    to: '/admin',
    icon: <FaUserShield />,
    label: 'Admin',
  });
}

  const Item = ({ to, icon, label }) => {
    const isActive = pathname === to;

    return (
      <Link
        to={to}
        className={`sidebar-item d-flex align-items-center gap-2 py-2 px-3 rounded-pill text-decoration-none ${
          isActive ? 'sidebar-item-active' : ''
        }`}
        title={label}
      >
        <span className="sidebar-icon d-flex align-items-center justify-content-center">
          {icon}
        </span>
        <span className="sidebar-label">{label}</span>
      </Link>
    );
  };

  return (
    <aside
      className={`sidebar border-end d-flex flex-column ${
        collapsed ? 'sidebar-collapsed' : ''
      }`}
    >
      {/* Brand header + toggle */}
      <div className="sidebar-header d-flex align-items-center justify-content-between p-3">
        <div className="d-flex align-items-center gap-2">
          <div className="sidebar-logo d-flex align-items-center justify-content-center">
            <FaLeaf className="text-white" />
          </div>
          <div className="sidebar-brand">
            <div className="fw-bold">FarmMate</div>
            <div className="text-muted" style={{ fontSize: 12 }}>
              AI-Powered Farming
            </div>
          </div>
        </div>

        <button
          type="button"
          className="sidebar-toggle btn btn-sm btn-light"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <FaBars size={14} /> : <FaChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav px-3">
        <div className="d-flex flex-column gap-2">
          {navItems.map((item) => (
            <Item key={item.to} {...item} />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="mt-auto p-3 text-muted fm-sidebar-footer">
        <small>Signed in as</small>
        <div className="fw-semibold small text-truncate">
          {user?.name || user?.email}
        </div>
      </div>
    </aside>
  );
}
