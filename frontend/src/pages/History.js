import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';
import { listScans } from '../services/scanService';
import { listPlans } from '../services/fertilizerService';

export default function History() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [scans, setScans] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError('');
        const [s, p] = await Promise.all([listScans(), listPlans()]);
        setScans(Array.isArray(s) ? s : []);
        setPlans(Array.isArray(p) ? p : []);
      } catch (e) {
        setError('Failed to load your farm activity history. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const items = useMemo(() => {
    const combined = [
      ...scans.map((x) => ({
        type: 'scan',
        id: x._id,
        title: `Disease Scan - ${x?.result?.disease || x?.meta?.crop || 'Unknown'}`,
        subtitle: x?.result?.disease ? 'Crop health analysis' : 'Scan uploaded',
        location: x?.meta?.location,
        confidence: x?.result?.confidence,
        createdAt: x.createdAt,
      })),
      ...plans.map((x) => ({
        type: 'plan',
        id: x._id,
        title: `Fertilizer Plan - ${x.crop || 'Unknown crop'}`,
        subtitle: x.recommendation || 'Plan created',
        location: '',
        confidence: null,
        createdAt: x.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const q = query.toLowerCase().trim();

    return combined.filter((it) => {
      const matchesFilter = filter === 'all' || it.type === filter;
      const matchesQuery =
        !q || `${it.title} ${it.subtitle}`.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [scans, plans, query, filter]);

  const totalScans = scans.length;
  const totalPlans = plans.length;

  const typeMeta = {
    scan: {
      label: 'Disease Scan',
      className: 'badge bg-success-subtle text-success border border-success-subtle',
      icon: '🩺',
    },
    plan: {
      label: 'Fertilizer Plan',
      className: 'badge bg-primary-subtle text-primary border border-primary-subtle',
      icon: '🧪',
    },
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <main className="flex-grow-1" style={{ background: '#fafaf8' }}>
        <div className="container-fluid py-4">
          <PageHeader
            title="Farm Activity History"
            subtitle="Track all your farming activities, disease scans, and fertilizer recommendations"
          />

          {/* Filters */}
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-body d-flex gap-2 align-items-end flex-wrap">
              <div className="flex-grow-1">
                <label className="form-label mb-1">Filter & Search</label>
                <input
                  className="form-control"
                  placeholder="Search by crop name, diagnosis, or recommendation..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div style={{ minWidth: 200 }}>
                <label className="form-label mb-1">Activity Type</label>
                <select
                  className="form-select"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Activities</option>
                  <option value="scan">Disease Scans</option>
                  <option value="plan">Fertilizer Plans</option>
                </select>
              </div>
            </div>
          </div>

          {/* Summary strip */}
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body py-3">
                  <div className="text-muted text-uppercase" style={{ fontSize: 12 }}>
                    Total Activities
                  </div>
                  <div className="fw-bold fs-4">{loading ? '…' : scans.length + plans.length}</div>
                  <div className="text-muted" style={{ fontSize: 12 }}>
                    Disease scans & fertilizer plans combined
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body py-3">
                  <div className="text-muted text-uppercase" style={{ fontSize: 12 }}>
                    Disease Scans
                  </div>
                  <div className="fw-bold fs-4">{loading ? '…' : totalScans}</div>
                  <div className="text-muted" style={{ fontSize: 12 }}>
                    Crop disease detection history
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body py-3">
                  <div className="text-muted text-uppercase" style={{ fontSize: 12 }}>
                    Fertilizer Plans
                  </div>
                  <div className="fw-bold fs-4">{loading ? '…' : totalPlans}</div>
                  <div className="text-muted" style={{ fontSize: 12 }}>
                    AI-recommended fertilizer schedules
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                  Activity Timeline{' '}
                  <span className="text-muted" style={{ fontSize: 14 }}>
                    ({loading ? 'loading…' : `${items.length} records`})
                  </span>
                </h5>
              </div>

              {error && (
                <div className="alert alert-danger py-2 mb-3">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="text-center text-muted py-5">
                  <div
                    className="spinner-border mb-2"
                    role="status"
                    aria-hidden="true"
                  />
                  <div>Fetching your recent farm activities…</div>
                </div>
              ) : !items.length ? (
                <div className="text-center text-muted py-5">
                  <div className="mb-1 fw-semibold">No activity yet</div>
                  <div style={{ fontSize: 13 }}>
                    Run a disease scan or generate a fertilizer plan to see it appear here.
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {items.map((a) => {
                    const meta = typeMeta[a.type];
                    return (
                      <div
                        key={`${a.type}-${a.id}`}
                        className="border rounded-3 p-3 bg-white position-relative"
                        style={{ borderLeft: '4px solid #16a34a' }}
                      >
                        <div className="d-flex justify-content-between align-items-start gap-2">
                          <div>
                            <div className="d-flex align-items-center gap-2">
                              {meta && (
                                <span className={meta.className} style={{ fontSize: 11 }}>
                                  {meta.icon} {meta.label}
                                </span>
                              )}
                              <span className="fw-semibold">{a.title}</span>
                            </div>
                            <div
                              className="text-muted mt-1"
                              style={{ fontSize: 13, maxWidth: 600 }}
                            >
                              {a.subtitle}
                            </div>
                          </div>
                          <div className="text-muted text-end" style={{ fontSize: 12 }}>
                            {new Date(a.createdAt).toLocaleString()}
                          </div>
                        </div>

                        <div className="d-flex flex-wrap gap-2 mt-2">
                          {a.location && (
                            <span className="badge bg-light text-dark">
                              📍 {a.location}
                            </span>
                          )}
                          {typeof a.confidence === 'number' && (
                            <span className="badge bg-warning text-dark">
                              {Math.round(a.confidence)}% confidence
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
