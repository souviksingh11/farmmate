import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import { listPlans, createPlan } from "../services/fertilizerService";
import { swalSuccess, swalError } from "../utils/swal";

export default function Fertilizer() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    crop: "",
    soil: "",
    ph: "",
    n: "N",
    p: "P",
    k: "K",
    size: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  // Load existing plans on mount
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const savedPlans = await listPlans();
        const safePlans = Array.isArray(savedPlans) ? savedPlans : [];
        setPlans(safePlans);
        if (safePlans.length) {
          setSelectedPlanId(safePlans[0]._id);
        }
      } catch (e) {
        setError("Failed to load fertilizer plans. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function onSubmit(e) {
  e.preventDefault();

  const crop = form.crop.trim();
  const soil = form.soil.trim();

  if (!crop) {
    swalError("Crop Required", "Please enter the crop type.");
    return;
  }

  if (!soil) {
    swalError("Soil Type Required", "Please enter the soil type.");
    return;
  }

  try {
    setSubmitting(true);

    // 🔥 Send RAW DATA to backend (AI will handle logic)
    const newPlan = await createPlan({
      crop,
      soil,
      ph: form.ph,
      N: Number(form.n),
      P: Number(form.p),
      K: Number(form.k),
      size: form.size,
    });

    const planWithFallback = newPlan || {
      _id: Date.now().toString(),
      crop,
      recommendation: "AI recommendation pending",
      createdAt: new Date().toISOString(),
    };

    setPlans((prev) => [planWithFallback, ...prev]);
    setSelectedPlanId(planWithFallback._id);

    // Reset only needed fields
    setForm((prev) => ({
      ...prev,
      crop: "",
      size: "",
    }));

    swalSuccess(
      "Recommendation Generated",
      "AI-powered fertilizer recommendation created successfully."
    );
  } catch (e) {
    swalError(
      "Failed",
      "Failed to generate fertilizer recommendation. Please try again."
    );
  } finally {
    setSubmitting(false);
  }
}


  const selectedPlan =
    plans.find((p) => p._id === selectedPlanId) || plans[0] || null;

  return (
    <div className="d-flex">
      <Sidebar />
      <main className="flex-grow-1" style={{ background: "#fafaf8" }}>
        <div className="container-fluid py-4">
          <PageHeader
            title="Fertilizer Recommendation"
            subtitle="Get AI-powered fertilizer recommendations based on your crop and soil conditions"
            badge="Connected"
          />

          <div className="row g-3">
            {/* Left: Form */}
            <div className="col-12 col-xl-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h4 className="mb-3">Crop & Soil Information</h4>

                  {error && (
                    <div className="alert alert-danger py-2 mb-3">{error}</div>
                  )}

                  <form onSubmit={onSubmit} className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Crop Type <span className="text-danger">*</span></label>
                      <input
                        className="form-control"
                        placeholder="e.g., Rice, Wheat, Tomato, Corn..."
                        value={form.crop}
                        onChange={(e) => handleChange("crop", e.target.value)}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Soil Type <span className="text-danger">*</span></label>
                      <input
                        className="form-control"
                        placeholder="e.g., Loamy, Clay, Sandy..."
                        value={form.soil}
                        onChange={(e) => handleChange("soil", e.target.value)}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Soil pH Level</label>
                      <input
                        className="form-control"
                        placeholder="e.g., 6.5"
                        value={form.ph}
                        onChange={(e) => handleChange("ph", e.target.value)}
                      />
                      <div className="text-muted" style={{ fontSize: 12 }}>
                        pH range: 1–14 (7 is neutral)
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label">Nitrogen Level (N)</label>
                      <input
                        className="form-control"
                        value={form.n}
                        onChange={(e) => handleChange("n", e.target.value)}
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label">Phosphorus Level (P)</label>
                      <input
                        className="form-control"
                        value={form.p}
                        onChange={(e) => handleChange("p", e.target.value)}
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label">Potassium Level (K)</label>
                      <input
                        className="form-control"
                        value={form.k}
                        onChange={(e) => handleChange("k", e.target.value)}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Farm Size (acres)</label>
                      <input
                        className="form-control"
                        value={form.size}
                        onChange={(e) => handleChange("size", e.target.value)}
                      />
                    </div>
                    <div className="col-12">
                      <button
                        className="btn btn-success w-100"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            />
                            Generating Recommendation...
                          </>
                        ) : (
                          "Get Recommendations"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Right: Recommendations & History */}
            <div className="col-12 col-xl-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h4 className="mb-3">Fertilizer Recommendations</h4>

                  {loading ? (
                    <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-muted text-center">
                      <div
                        className="spinner-border mb-2"
                        role="status"
                        aria-hidden="true"
                      />
                      <div>Loading your previous plans…</div>
                    </div>
                  ) : !plans.length ? (
                    <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-muted text-center">
                      <div className="mb-1 fw-semibold">Ready for Analysis</div>
                      <p className="mb-0" style={{ maxWidth: 360 }}>
                        Fill in your crop and soil information to get
                        personalized fertilizer recommendations. Your plans will
                        be saved here for future reference.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Selected / Latest plan detail */}
                      {selectedPlan && (
                        <div className="mb-3 border rounded-3 p-3 bg-light">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <div
                                className="text-uppercase text-muted"
                                style={{ fontSize: 11 }}
                              >
                                Active Plan
                              </div>
                              <div className="fw-semibold">
                                {selectedPlan.crop || "Unknown crop"}
                              </div>
                            </div>
                            <div
                              className="text-muted text-end"
                              style={{ fontSize: 11, minWidth: 140 }}
                            >
                              {selectedPlan.createdAt
                                ? new Date(
                                    selectedPlan.createdAt,
                                  ).toLocaleString()
                                : ""}
                            </div>
                          </div>
                          <div style={{ fontSize: 14, whiteSpace: "pre-line" }}>
  {selectedPlan.recommendation ||
    "No recommendation text available."}
</div>
                        </div>
                      )}

                      {/* Plans list */}
                      <div className="flex-grow-1" style={{ minHeight: 0 }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div className="text-muted" style={{ fontSize: 13 }}>
                            Saved Plans ({plans.length})
                          </div>
                        </div>
                        <div
                          className="d-flex flex-column gap-2"
                          style={{ maxHeight: 260, overflowY: "auto" }}
                        >
                          {plans.map((p) => (
                            <button
                              key={p._id}
                              type="button"
                              onClick={() => setSelectedPlanId(p._id)}
                              className={`text-start border rounded-3 px-3 py-2 bg-white w-100 ${
                                selectedPlanId === p._id
                                  ? "border-success"
                                  : "border-light"
                              }`}
                              style={{ fontSize: 13 }}
                            >
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="fw-semibold">
                                  {p.crop || "Unknown crop"}
                                </div>
                                <span
                                  className="text-muted"
                                  style={{ fontSize: 11 }}
                                >
                                  {p.createdAt
                                    ? new Date(p.createdAt).toLocaleDateString()
                                    : ""}
                                </span>
                              </div>
                              <div
                                className="text-muted"
                                style={{ fontSize: 12 }}
                              >
                                {(p.recommendation || "").slice(0, 80)}
                                {(p.recommendation || "").length > 80 && "…"}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
