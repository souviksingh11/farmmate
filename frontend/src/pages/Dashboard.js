import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaVial, FaCloudSun, FaChartLine } from 'react-icons/fa';

import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import QuickAction from '../components/QuickAction';
import NotificationPanel from '../components/NotificationPanel';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from 'recharts';

import { listScans } from '../services/scanService';
import { listPlans } from '../services/fertilizerService';

function buildWeekly(scans) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const counts = new Array(7).fill(0);
  scans.forEach((s) => {
    if (!s?.createdAt) return;
    const d = new Date(s.createdAt);
    if (!Number.isNaN(d.getTime())) {
      counts[d.getDay()] += 1;
    }
  });
  return days.map((day, idx) => ({
    day,
    scans: counts[idx],
    target: Math.max(1, Math.round(counts[idx] * 0.8) || 1),
  }));
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [scans, setScans] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, p] = await Promise.all([listScans(), listPlans()]);
        setScans(Array.isArray(s) ? s : []);
        setPlans(Array.isArray(p) ? p : []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalScans = scans.length;
  const diseasesDetected = scans.filter((x) => x?.result?.disease).length;
  const recommendations = plans.length;
  const healthyPlants = Math.max(0, totalScans - diseasesDetected);

  const healthData = useMemo(
    () => [
      { label: 'Healthy', value: healthyPlants },
      { label: 'At Risk', value: 0 },
      { label: 'Diseased', value: diseasesDetected },
    ],
    [healthyPlants, diseasesDetected]
  );

  const weeklyData = useMemo(() => buildWeekly(scans), [scans]);

  // Activity for NotificationPanel (simple)
  const activityForPanel = useMemo(
    () => [
      ...scans.slice(0, 5).map((x) => ({
        id: x._id,
        title: `Disease Scan${
          x?.result?.disease ? ` - ${x.result.disease}` : ''
        }`,
        confidence: x?.result?.confidence,
      })),
      ...plans.slice(0, 5).map((x) => ({
        id: x._id,
        title: `Fertilizer Plan - ${x.crop}`,
        confidence: null,
      })),
    ],
    [scans, plans]
  );

  // Detailed recent activity for bottom card
  const recentActivity = useMemo(() => {
    const normalizeConfidence = (val) => {
      if (typeof val !== 'number') return null;
      // 0–1 or already 0–100
      return Math.round(val <= 1 ? val * 100 : val);
    };

    const items = [
      ...scans.map((x) => ({
        id: `scan-${x._id}`,
        type: 'Disease Scan',
        crop: x?.meta?.crop || 'Unknown crop',
        date: x?.createdAt ? new Date(x.createdAt) : null,
        confidence: normalizeConfidence(x?.result?.confidence),
      })),
      ...plans.map((x) => ({
        id: `plan-${x._id}`,
        type: 'Fertilizer Plan',
        crop: x?.crop || 'Unknown crop',
        date: x?.createdAt ? new Date(x.createdAt) : null,
        confidence: null,
      })),
    ];

    return items
      .filter((i) => i.date)
      .sort((a, b) => b.date - a.date)
      .slice(0, 6);
  }, [scans, plans]);

  const advisories = [
    'Rain likely — delay fertilizer application',
    'High humidity — reduce evening irrigation',
  ];

  const greetingName = user?.name || user?.email || 'Farmer';

  return (
    <div className="d-flex">
      <Sidebar />
      <main className="flex-grow-1" style={{ background: '#fafaf8' }}>
        <div className="container-fluid py-4">
          {/* Hero header */}
          <div className="p-3 p-md-4 mb-3 rounded-4 shadow-sm d-flex flex-wrap justify-content-between align-items-center" style={{ background: 'linear-gradient(135deg, #e0f7e9, #f5f9ff)' }}>
            <div>
              <h2 className="fw-bold mb-1">
                Welcome back, {greetingName}! 🌱
              </h2>
              <p className="text-muted mb-0">
                Your AI-powered farming assistant. Monitor your crops, get smart recommendations, and boost your harvest.
              </p>
            </div>
            <div className="mt-3 mt-md-0 text-end">
              <div className="badge bg-success-subtle text-success border border-success-subtle mb-1">
                Farm status: Active
              </div>
              <div className="text-muted" style={{ fontSize: 12 }}>
                Last updated just now
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="row g-3 mt-1">
            <div className="col-12 col-md-6 col-xl-3">
              <StatCard
                title="Total Crop Scans"
                value={loading ? '…' : totalScans}
                delta="+12%"
                icon={<FaCamera />}
              />
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <StatCard
                title="Diseases Detected"
                value={loading ? '…' : diseasesDetected}
                delta="-5%"
                icon={<FaVial />}
              />
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <StatCard
                title="Recommendations"
                value={loading ? '…' : recommendations}
                delta="+8%"
                icon={<FaVial />}
              />
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <StatCard
                title="Healthy Plants"
                value={loading ? '…' : healthyPlants}
                delta="+15%"
                icon={<FaCloudSun />}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <h4 className="mt-4 mb-2">Quick Actions</h4>
          <div className="row g-3">
            <div className="col-12 col-xl-6">
              <QuickAction
                color="#e8f0ff"
                icon={<FaCamera />}
                title="Scan Crop Disease"
                subtitle="Upload crop images for AI disease detection"
                onClick={() => navigate('/disease')}
              />
            </div>
            <div className="col-12 col-xl-6">
              <QuickAction
                color="#efe7ff"
                icon={<FaVial />}
                title="Get Fertilizer Advice"
                subtitle="Personalized fertilizer recommendations"
                onClick={() => navigate('/fertilizer')}
              />
            </div>
            <div className="col-12 col-xl-6">
              <QuickAction
                color="#e6fff2"
                icon={<FaCloudSun />}
                title="Check Weather"
                subtitle="Weather forecasts and irrigation tips"
                onClick={() => navigate('/weather')}
              />
            </div>
            <div className="col-12 col-xl-6">
              <QuickAction
                color="#ffeede"
                icon={<FaChartLine />}
                title="Market Prices"
                subtitle="Current crop prices and market trends"
                onClick={() => navigate('/market')}
              />
            </div>
          </div>

          {/* Charts + notifications */}
          <div className="row g-3 mt-2">
            {/* Weekly Activity */}
            <div className="col-12 col-xl-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0">Weekly Activity</h5>
                    <span className="text-muted" style={{ fontSize: 12 }}>
                      Crop scans this week
                    </span>
                  </div>
                  <div style={{ width: '100%', height: 280 }}>
                    {loading ? (
                      <div className="d-flex h-100 justify-content-center align-items-center text-muted">
                        <div
                          className="spinner-border me-2"
                          role="status"
                          aria-hidden="true"
                        />
                        Loading activity…
                      </div>
                    ) : (
                      <ResponsiveContainer>
                        <LineChart
                          data={weeklyData}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="scans"
                            stroke="#2e9f6b"
                            strokeWidth={3}
                            dot={{ r: 5 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="target"
                            stroke="#2e9f6b"
                            strokeDasharray="4 4"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Health distribution */}
            <div className="col-12 col-xl-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="mb-3">Crop Health Distribution</h5>
                  <div style={{ width: '100%', height: 280 }}>
                    {loading ? (
                      <div className="d-flex h-100 justify-content-center align-items-center text-muted">
                        <div
                          className="spinner-border me-2"
                          role="status"
                          aria-hidden="true"
                        />
                        Loading chart…
                      </div>
                    ) : (
                      <ResponsiveContainer>
                        <BarChart
                          data={healthData}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="label" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar
                            dataKey="value"
                            fill="#2e9f6b"
                            radius={[6, 6, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications / advisories */}
            <div className="col-12 col-xl-3">
              <NotificationPanel
                alerts={[]}
                activities={activityForPanel}
                advisories={advisories}
              />
            </div>
          </div>

          {/* Recent Activity List */}
          <div className="card border-0 shadow-sm mt-3">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h5 className="mb-0">Recent Farm Activity</h5>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => navigate('/history')}
                >
                  View All
                </button>
              </div>

              {loading ? (
                <div className="text-muted py-3">
                  Loading recent activity…
                </div>
              ) : !recentActivity.length ? (
                <div className="text-muted py-3">
                  No recent activity. Start by scanning a crop or creating a fertilizer
                  plan.
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {recentActivity.map((a) => (
                    <div
                      key={a.id}
                      className="d-flex align-items-center justify-content-between bg-light rounded-3 p-3"
                    >
                      <div>
                        <div className="fw-semibold">{a.type}</div>
                        <div
                          className="text-muted"
                          style={{ fontSize: 13 }}
                        >
                          {a.crop}{' '}
                          {a.date && (
                            <>
                              •{' '}
                              {a.date.toLocaleString(undefined, {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </>
                          )}
                        </div>
                      </div>
                      {a.confidence !== null && (
                        <span
                          className="badge rounded-pill text-dark"
                          style={{ background: '#ffeaa7' }}
                        >
                          {a.confidence}% confident
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
