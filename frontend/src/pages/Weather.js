import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import {
  getWeather,
  getWeatherByCoords,
  geocodeCity,
  getForecastByCoords,
} from "../services/weatherService";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import WeatherMap from "./WeatherMap";
import { swalError, swalSuccess } from "../utils/swal";

export default function Weather() {
  const [loc, setLoc] = useState("");
  const [coords, setCoords] = useState(null); // { lat, lon }
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  

  const isBusy = loading || locating;

  // 🔹 Auto-detect user location
  function autoDetect() {
    if (!navigator.geolocation) {
      swalError(
        "Location Not Supported",
        "Geolocation is not supported by your browser.",
      );
      return;
    }

    setLocating(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          setCoords({ lat: latitude, lon: longitude });
          // fetch weather + forecast for these coords
          await fetchByCoords({ lat: latitude, lon: longitude });
        } catch (e) {
          console.error(e);
          setError("Failed to load weather using your location.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setError("Unable to access your location. Please allow permission.");
      },
    );
  }

  // 🔹 Fetch by coords (for auto-detect or refresh)
  async function fetchByCoords(c) {
    if (!c) return;
    try {
      setLoading(true);
      setError("");

      const data = await getWeatherByCoords(c.lat, c.lon);
      setWeather(data);

      const fc = await getForecastByCoords({ lat: c.lat, lon: c.lon });
      setForecast(fc);

      // If weather has city name, show it in search box as hint (not permanent storage)
      if (data && data.city) {
        setLoc(data.city);
      }
    } catch (e) {
      console.error(e);
      swalError(
  'Weather Unavailable',
  'Failed to load weather for this location.'
);
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Fetch by typed location (search)
  async function fetchByLocation() {
    if (!loc.trim()) {
  swalError(
    'Location Required',
    'Please enter a location to search.'
  );
  return;
}

    try {
      setLoading(true);
      setError("");

      // 1) Get weather by name (if your API supports it)
      const data = await getWeather(loc);
      setWeather(data);

      // 2) Geocode location → coords → forecast
      const geo = await geocodeCity(loc);
      if (geo && geo.lat != null && geo.lon != null) {
        setCoords({ lat: geo.lat, lon: geo.lon });
        const fc = await getForecastByCoords({ lat: geo.lat, lon: geo.lon });
        setForecast(fc);
      } else {
        setForecast(null);
        setError("Could not find that location on map.");
      }
    } catch (e) {
      console.error(e);
      swalError(
  'Weather Unavailable',
  'Failed to load weather for this location.'
);
    } finally {
      setLoading(false);
    }
  }

  // 🔹 On first load, try auto-detect once
  useEffect(() => {
    autoDetect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔹 Auto-refresh every 5 minutes using last coords (auto or search)
  useEffect(() => {
    if (!coords) return;
    const id = setInterval(() => {
      fetchByCoords(coords);
    }, 300000); // 5 min
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords]);

  const currentHumidity = weather?.humidity ?? "--";
  const currentWind = weather?.windKph ?? "--";
  const currentRain = weather?.rainfallMm ?? 0;

  return (
    <div className="d-flex">
      <Sidebar />
      <main className="flex-grow-1" style={{ background: "#fafaf8" }}>
        <div className="container-fluid py-4">
          <PageHeader
            title="Weather & Irrigation Planner"
            subtitle="Search any location or use auto-detect to get live farm weather and planning insights."
          />

          {/* 🔎 Search + Auto-detect controls */}
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-body d-flex gap-2 align-items-end flex-wrap">
              <div className="flex-grow-1">
                <label className="form-label mb-1 fw-semibold">Location <span className="text-danger">*</span></label>
                <input
                  className="form-control"
                  placeholder="Search city, district, or farm location..."
                  value={loc}
                  onChange={(e) => setLoc(e.target.value)}
                />
                <div className="form-text" style={{ fontSize: 11 }}>
                  Example: Patna, Bihar · Indore · Nashik
                </div>
              </div>
              <button
                className="btn btn-info"
                onClick={fetchByLocation}
                disabled={isBusy}
                type="button"
              >
                {loading ? "Searching…" : "Search"}
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={autoDetect}
                disabled={isBusy}
                type="button"
              >
                {locating ? "Detecting…" : "Auto-Detect"}
              </button>
            </div>
          </div>

          {/* 🌤 Current weather */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              {/* {error && <div className="alert alert-danger mb-3">{error}</div>} */}

              {isBusy && (
                <div className="d-flex align-items-center gap-3">
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 16,
                      background: "#e5e7eb",
                    }}
                  />
                  <div className="flex-grow-1">
                    <div className="placeholder-glow mb-2">
                      <span className="placeholder col-4" />
                    </div>
                    <div className="placeholder-glow mb-2">
                      <span className="placeholder col-2" />
                    </div>
                    <div className="placeholder-glow">
                      <span className="placeholder col-6" />
                    </div>
                  </div>
                </div>
              )}

              {!isBusy && !weather && !error && (
                <div className="text-center text-muted py-5">
                  <div className="mb-2 fw-semibold">
                    Weather Dashboard Ready
                  </div>
                  <div style={{ fontSize: 13 }}>
                    Search a location or use auto-detect to view real-time
                    conditions, rainfall chances, and farm advisories.
                  </div>
                </div>
              )}

              {!isBusy && weather && (
                <>
                  <div className="d-flex flex-wrap align-items-center gap-4 mb-3">
                    {weather.icon && (
                      <img
                        alt="icon"
                        width={72}
                        height={72}
                        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                      />
                    )}
                    <div>
                      <h4 className="mb-1">
                        {weather.city}
                        {weather.country ? `, ${weather.country}` : ""}
                      </h4>
                      <div className="fs-2 fw-bold">
                        {Math.round(weather.tempC)}°C
                      </div>
                      <div className="text-muted" style={{ fontSize: 13 }}>
                        Updated:{" "}
                        {new Date(
                          weather.updatedAt || Date.now(),
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div
                        className="badge bg-light text-dark mt-2"
                        style={{ fontSize: 11 }}
                      >
                        {weather.condition}
                      </div>
                    </div>
                  </div>

                  {/* Small stat chips */}
                  <div className="row g-3">
                    <div className="col-6 col-md-3">
                      <div className="border rounded-3 px-3 py-2 bg-light">
                        <div className="text-muted small">Humidity</div>
                        <div className="fw-semibold">
                          {currentHumidity !== "--"
                            ? `${currentHumidity}%`
                            : "--"}
                        </div>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="border rounded-3 px-3 py-2 bg-light">
                        <div className="text-muted small">Wind Speed</div>
                        <div className="fw-semibold">
                          {currentWind !== "--" ? `${currentWind} km/h` : "--"}
                        </div>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="border rounded-3 px-3 py-2 bg-light">
                        <div className="text-muted small">24h Rainfall</div>
                        <div className="fw-semibold">
                          {currentRain ? `${currentRain} mm` : "0 mm"}
                        </div>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="border rounded-3 px-3 py-2 bg-light">
                        <div className="text-muted small">Feels Like</div>
                        <div className="fw-semibold">
                          {weather.feelsLikeC != null
                            ? `${Math.round(weather.feelsLikeC)}°C`
                            : "--"}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 🌧 7-day rainfall probability – based on forecast from search/auto */}
          {forecast?.daily && (
            <div className="card border-0 shadow-sm mt-3">
              <div className="card-body">
                <h5 className="mb-2">7-Day Rainfall Probability</h5>
                <div className="text-muted mb-2" style={{ fontSize: 12 }}>
                  Helps you choose ideal days for irrigation and fertilizer
                  scheduling.
                </div>
                <div style={{ width: "100%", height: 220 }}>
                  <ResponsiveContainer>
                    <AreaChart
                      data={forecast.daily.slice(0, 7).map((d) => ({
                        day: new Date(d.dt * 1000).toLocaleDateString(
                          undefined,
                          {
                            weekday: "short",
                          },
                        ),
                        pop: Math.round((d.pop || 0) * 100),
                      }))}
                    >
                      <defs>
                        <linearGradient id="rain" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="#2e9f6b"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#2e9f6b"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                      <Tooltip formatter={(v) => `${v}%`} />
                      <Area
                        type="monotone"
                        dataKey="pop"
                        stroke="#2e9f6b"
                        fillOpacity={1}
                        fill="url(#rain)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* 🌡 Next 12 hours temperature – same forecast */}
          {forecast?.hourly && (
            <div className="card border-0 shadow-sm mt-3">
              <div className="card-body">
                <h5 className="mb-2">Next 12 Hours Temperature</h5>
                <div className="text-muted mb-2" style={{ fontSize: 12 }}>
                  Use cooler hours for spraying, field work, and
                  transplantation.
                </div>
                <div style={{ width: "100%", height: 220 }}>
                  <ResponsiveContainer>
                    <LineChart
                      data={forecast.hourly.slice(0, 12).map((h) => ({
                        time: new Date(h.dt * 1000).toLocaleTimeString([], {
                          hour: "2-digit",
                        }),
                        temp: Math.round(h.temp),
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis unit="°C" />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="temp"
                        stroke="#0077b6"
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* 🗺 Map */}
          {forecast?.lat != null && forecast?.lon != null && (
            <div className="mt-3">
              <WeatherMap lat={forecast.lat} lon={forecast.lon} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
