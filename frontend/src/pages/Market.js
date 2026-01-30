// frontend/src/pages/Market.js
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';
import {
  getMarketPrices,
  buildLast30DaysSeries,
  naiveForecast,
} from '../services/marketService';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts';
import { swalError, swalSuccess } from '../utils/swal';


export default function Market() {
  const [hasSearched, setHasSearched] = useState(false);

  const [commodity, setCommodity] = useState('');
  const [stateName, setStateName] = useState('');
  const [district, setDistrict] = useState('');

  const [items, setItems] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleFetch() {
  const c = commodity.trim();
  const s = stateName.trim();
  const d = district.trim();

  if (!c || !s) {
    swalError(
      'Missing Information',
      'Please enter at least commodity and state.'
    );
    return;
  }

  try {
    setLoading(true);
    setError('');

    const data = await getMarketPrices({
      commodity: c,
      state: s,
      district: d || undefined,
    });

    const safeData = Array.isArray(data) ? data : [];
    setItems(safeData);
    setHasSearched(true);

    if (safeData.length === 0) {
      swalError(
        'No Market Data Found',
        `No price data available for ${c} in ${d ? d + ', ' : ''}${s}.`
      );
      return;
    }

    swalSuccess(
      'Market Data Loaded',
      'Latest mandi prices and trends updated.'
    );

    setNews([
      'Government announces MSP review for Kharif crops',
      'Logistics costs easing in eastern markets',
      'Export demand uptick expected for maize next month',
    ]);
  } catch (e) {
    if (e?.response?.status === 401) {
      swalError('Authentication Required', 'Please login to view market data.');
    } else if (e?.response?.data?.message) {
      swalError('Market Data Error', e.response.data.message);
    } else {
      swalError('Server Error', 'Failed to load market data. Please try again.');
    }
  } finally {
    setLoading(false);
  }
}


  const series = buildLast30DaysSeries(items);
  const forecastSeries = naiveForecast(series, 30);
  const latestPoint =
    series && series.length > 0 ? series[series.length - 1] : null;

  return (
    <div className="d-flex">
      <Sidebar />
      <main className="flex-grow-1" style={{ background: '#fafaf8' }}>
        <div className="container-fluid py-4">
          <PageHeader
            title="Market Price Guidance"
            subtitle="Get real-time crop prices and market trends to optimize your selling strategy"
          />

          {/* Filters */}
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-body d-flex gap-2 align-items-end flex-wrap">
              <div className="flex-grow-1">
                <label className="form-label mb-1" htmlFor="commodityField">
                  Commodity <span className="text-danger">*</span>
                </label>
                <input
                  id="commodityField"
                  name="commodity"
                  className="form-control"
                  placeholder="e.g. Wheat, Paddy, Maize"
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value)}
                />
              </div>
              <div className="flex-grow-1">
                <label className="form-label mb-1" htmlFor="stateField">
                  State <span className="text-danger">*</span>
                </label>
                <input
                  id="stateField"
                  name="state"
                  className="form-control"
                  placeholder="e.g. Bihar, Uttar Pradesh"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                />
              </div>
              <div className="flex-grow-1">
                <label className="form-label mb-1" htmlFor="districtField">
                  District (optional)
                </label>
                <input
                  id="districtField"
                  name="district"
                  className="form-control"
                  placeholder="e.g. Patna"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-warning px-4"
                onClick={handleFetch}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    Loading...
                  </>
                ) : (
                  'Get Market Data'
                )}
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              {/* {error && (
                <div className="alert alert-danger py-2 mb-3">{error}</div>
              )} */}

              {loading ? (
                <div className="text-center text-muted py-5">
                  Fetching latest market data for{' '}
                  <strong>{commodity || 'your commodity'}</strong> in{' '}
                  <strong>
                    {district ? `${district}, ` : ''}
                    {stateName || 'your state'}
                  </strong>
                  ...
                </div>
              ) : items.length === 0 ? (
                <div className="text-center text-muted py-5">
                  Market Data Ready
                  <br />
                  <small>
                    Enter commodity, state (and optionally district) to view
                    live mandi prices and trends.
                  </small>
                </div>
              ) : (
                <>
                  {/* Summary cards */}
                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-4">
                      <div className="border rounded-3 p-3 bg-white h-100">
                        <div
                          className="text-uppercase text-muted"
                          style={{ fontSize: 12 }}
                        >
                          Latest Modal Price
                        </div>
                        <div className="fw-bold fs-4">
                          {latestPoint ? `₹${latestPoint.price}` : '—'}
                        </div>
                        <div className="text-muted" style={{ fontSize: 12 }}>
                          {latestPoint
                            ? `As on ${latestPoint.day}`
                            : 'No recent price available'}
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="border rounded-3 p-3 bg-white h-100">
                        <div
                          className="text-uppercase text-muted"
                          style={{ fontSize: 12 }}
                        >
                          Records Fetched
                        </div>
                        <div className="fw-bold fs-4">{items.length}</div>
                        <div className="text-muted" style={{ fontSize: 12 }}>
                          Latest mandi entries from AGMARKNET
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="border rounded-3 p-3 bg-white h-100">
                        <div
                          className="text-uppercase text-muted"
                          style={{ fontSize: 12 }}
                        >
                          Commodity / Region
                        </div>
                        <div className="fw-bold">
                          {commodity || '—'}{' '}
                          {(commodity && (stateName || district)) && '·'}{' '}
                          {district ? `${district}, ` : ''}
                          {stateName || ''}
                        </div>
                        <div className="text-muted" style={{ fontSize: 12 }}>
                          Based on your selected filters
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3">
                    {/* Charts */}
                    <div className="col-12 col-xl-8">
                      <h5 className="mb-2">Last 30 Days Trend</h5>
                      <div style={{ width: '100%', height: 260 }}>
                        <ResponsiveContainer>
                          <LineChart data={series}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip formatter={(v) => `₹${v}`} />
                            <Line
                              type="monotone"
                              dataKey="price"
                              stroke="#2e9f6b"
                              strokeWidth={3}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      <h6 className="mt-4">7–30 Day Forecast</h6>
                      <div style={{ width: '100%', height: 200 }}>
                        <ResponsiveContainer>
                          <AreaChart data={forecastSeries}>
                            <defs>
                              <linearGradient id="fc" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                  offset="5%"
                                  stopColor="#f59e0b"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#f59e0b"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip formatter={(v) => `₹${v}`} />
                            <Area
                              type="monotone"
                              dataKey="price"
                              stroke="#f59e0b"
                              fillOpacity={1}
                              fill="url(#fc)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Right side info */}
                    <div className="col-12 col-xl-4">
                      <div className="mb-3">
                        <h6 className="mb-2">Smart Sell Timing</h6>
                        <div className="alert alert-success py-2 mb-2">
                          Suggested:{' '}
                          <strong>Sell in 5–9 days</strong> based on current
                          trend (demo logic)
                        </div>
                        <div className="text-muted" style={{ fontSize: 13 }}>
                          Tip: Avoid selling on days with heavy rainfall or very
                          low mandi arrivals.
                        </div>
                      </div>

                      <div>
                        <h6 className="mb-2">Recent Market News</h6>
                        <ul className="mb-0" style={{ fontSize: 14 }}>
                          {news.map((n, i) => (
                            <li key={i}>{n}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


