import { useEffect, useState, useMemo } from 'react';
import { FaUsers, FaVirus, FaFlask, FaUserShield } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';
import {
  getAdminOverview,
  listAdminUsers,
  getAdminActivity,
} from '../services/adminService';

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const [ov, us, act] = await Promise.all([
          getAdminOverview(),
          listAdminUsers(),
          getAdminActivity(),
        ]);

        setOverview(ov);
        setUsers(us || []);

        const merged = [
          ...(act?.scans || []).map((s) => ({
            type: 'Disease Scan',
            title: s?.result?.disease
              ? `Detected: ${s.result.disease}`
              : 'Crop disease scan',
            userName: s?.user?.name || s?.user?.email || 'Unknown',
            userEmail: s?.user?.email,
            createdAt: s.createdAt,
          })),
          ...(act?.plans || []).map((p) => ({
            type: 'Fertilizer Plan',
            title: `Plan for ${p.crop || 'Unknown crop'}`,
            userName: p?.user?.name || p?.user?.email || 'Unknown',
            userEmail: p?.user?.email,
            createdAt: p.createdAt,
          })),
        ].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setActivity(merged);
      } catch (err) {
        console.error(err);
        setError('Failed to load admin data.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const farmerUsers = useMemo(
    () => users.filter((u) => u.role !== 'admin'),
    [users]
  );

  const totalAdmins = useMemo(
    () => users.filter((u) => u.role === 'admin').length,
    [users]
  );

  return (
    <div className="d-flex">
      <Sidebar />
      <main className="flex-grow-1" style={{ background: '#f3f4f6' }}>
        <div className="container-fluid py-4 admin-fade-in">
          
          {/* PAGE TITLE ONLY */}
          <PageHeader title="Admin Dashboard" />

          {error && (
            <div className="alert alert-danger py-2 mb-3">{error}</div>
          )}

          {/* LOADING */}
          {loading && !overview ? (
            <div className="text-muted">Loading admin data...</div>
          ) : (
            <>
              {/* SUMMARY CARDS */}
              {overview && (
                <div className="row g-3 mb-3">
                  
                  <div className="col-12 col-md-3">
                    <div className="card border-0 shadow-sm h-100 admin-stat-card">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                          <div className="text-muted small">Total Users</div>
                          <div className="fs-3 fw-bold">
                            {overview.userCount}
                          </div>
                        </div>
                        <div className="admin-stat-icon users">
                          <FaUsers />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-3">
                    <div className="card border-0 shadow-sm h-100 admin-stat-card">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                          <div className="text-muted small">Disease Scans</div>
                          <div className="fs-3 fw-bold">
                            {overview.scanCount}
                          </div>
                        </div>
                        <div className="admin-stat-icon scans">
                          <FaVirus />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-3">
                    <div className="card border-0 shadow-sm h-100 admin-stat-card">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                          <div className="text-muted small">
                            Fertilizer Plans
                          </div>
                          <div className="fs-3 fw-bold">
                            {overview.planCount}
                          </div>
                        </div>
                        <div className="admin-stat-icon plans">
                          <FaFlask />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-3">
                    <div className="card border-0 shadow-sm h-100 admin-stat-card">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                          <div className="text-muted small">Admins</div>
                          <div className="fs-3 fw-bold">{totalAdmins}</div>
                        </div>
                        <div className="admin-stat-icon admin">
                          <FaUserShield />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* USERS + ACTIVITY */}
              <div className="row g-3">
                
                {/* USERS TABLE */}
                <div className="col-12 col-xl-7">
                  <div className="card border-0 shadow-sm h-100 admin-slide-up">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="mb-0">Users</h5>
                        <span className="badge bg-light text-dark">
                          {farmerUsers.length} farmers
                        </span>
                      </div>

                      {farmerUsers.length === 0 ? (
                        <div className="text-muted">No users found.</div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-sm align-middle mb-0">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Farm</th>
                                <th>Location</th>
                              </tr>
                            </thead>
                            <tbody>
                              {farmerUsers.map((u) => (
                                <tr key={u._id}>
                                  <td>{u.name || '-'}</td>
                                  <td>{u.email}</td>
                                  <td>{u.farmName || '-'}</td>
                                  <td>{u.location || '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ACTIVITY FEED */}
                <div className="col-12 col-xl-5">
                  <div className="card border-0 shadow-sm h-100 admin-slide-up">
                    <div className="card-body">
                      <h5 className="mb-2">Recent Activity</h5>

                      {activity.length === 0 ? (
                        <div className="text-muted">No recent activity.</div>
                      ) : (
                        <div className="d-flex flex-column gap-2">
                          {activity.slice(0, 25).map((a, idx) => (
                            <div
                              key={idx}
                              className="bg-light rounded p-2 admin-activity-item"
                              style={{ fontSize: 13 }}
                            >
                              <div className="fw-semibold">
                                {a.type} – {a.title}
                              </div>
                              <div className="text-muted">
                                {a.userName} ({a.userEmail}) •{' '}
                                {new Date(a.createdAt).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
