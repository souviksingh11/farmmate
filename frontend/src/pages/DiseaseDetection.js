import { useState } from "react";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import { createScan } from "../services/scanService";
import { swalSuccess, swalError, swalConfirm } from "../utils/swal";

export default function DiseaseDetection() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [crop, setCrop] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // helper: convert File -> base64 (data URL)
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!file) {
      swalError("Image Required", "Please capture or upload an image first.");
      return;
    }

    if (!crop.trim()) {
      swalError("Crop Name Required", "Please enter the crop name.");
      return;
    }

    // 🔔 Confirm before analysis
    const confirm = await swalConfirm({
      title: "Analyze Crop?",
      text: "AI will analyze the image and generate recommendations",
      confirmText: "Analyze",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);

      const base64 = await fileToBase64(file);

      const data = await createScan({
        imageUrl: base64,
        meta: { crop, location, notes },
      });

      setResult(data);

      // ✅ Success SweetAlert
      swalSuccess(
        "Analysis Complete",
        "Crop disease detection completed successfully",
      );
    } catch (err) {
      console.error(err);

      // ❌ Error SweetAlert
      swalError(
        "Analysis Failed",
        "Unable to analyze image. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setResult(null);
    setError("");

    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }
  // ==== Friendly recommendation view ====
  const disease = result?.result?.disease || "No clear disease detected";

  const confidence =
    typeof result?.result?.confidence === "number"
      ? Math.round(
          result.result.confidence * (result.result.confidence <= 1 ? 100 : 1),
        )
      : null;

  const severity = result?.result?.severity || null;
  const type = result?.result?.type || null;
  const fertilizer = result?.result?.fertilizer || null;
  const recommendations = result?.result?.recommendations || [];

  return (
    <div className="d-flex">
      <Sidebar />
      <main className="flex-grow-1" style={{ background: "#fafaf8" }}>
        <div className="container-fluid py-4">
          <PageHeader
            title="Crop Disease Detection"
            subtitle="Upload crop images for AI-powered disease analysis and treatment recommendations"
            badge="Connected"
          />

          <div className="row g-3">
            {/* LEFT: upload + form */}
            <div className="col-12 col-xl-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h4 className="mb-3">Upload Crop Image</h4>

                  {error && (
                    <div className="alert alert-danger py-2 mb-3">{error}</div>
                  )}

                  <form onSubmit={onSubmit}>
                    <div
                      className="border rounded-3 p-4 text-center mb-3"
                      style={{ borderStyle: "dashed" }}
                    >
                      <div className="mb-2 fw-semibold">
                        Upload Crop Image <span className="text-danger">*</span>
                      </div>
                      <div className="text-muted">
                        Take a clear photo of your crop for accurate analysis
                      </div>

                      {/* Preview */}
                      {preview && (
                        <div className="mt-3">
                          <img
                            src={preview}
                            alt="Selected crop"
                            style={{
                              maxWidth: "100%",
                              maxHeight: 220,
                              objectFit: "contain",
                              borderRadius: 8,
                            }}
                          />
                        </div>
                      )}

                      <div className="d-flex gap-2 justify-content-center mt-3">
                        {/* Camera capture */}
                        {/* <label className="btn btn-success mb-0">
                          Take Photo
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            hidden
                            onChange={handleFileChange}
                          />
                        </label> */}

                        {/* Normal file picker */}
                        <label className="btn btn-outline-secondary mb-0">
                          Upload File
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>

                      {file && (
                        <div
                          className="mt-2 text-muted"
                          style={{ fontSize: 12 }}
                        >
                          Selected: {file.name}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Crop Name <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        placeholder="e.g., Tomato, Rice, Wheat..."
                        value={crop}
                        onChange={(e) => setCrop(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Farm Location</label>
                      <input
                        className="form-control"
                        placeholder="e.g., Field A, North Section..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Additional Notes</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        placeholder="Any specific symptoms or observations..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-success w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          />
                          Analyzing...
                        </>
                      ) : (
                        "Analyze Crop Health"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* RIGHT: simple recommendation card */}
            <div className="col-12 col-xl-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body d-flex flex-column text-muted">
                  <h3 className="mb-4 text-center fw-bold">Analysis Results</h3>

                  {!result ? (
                    <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center">
                      <div>Ready for Analysis</div>
                      <p className="mt-2 mb-0">
                        Upload a crop image and provide details to get a simple,
                        clear disease diagnosis and fertilizer/treatment
                        recommendation.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Summary header */}
                      {/* ===================== RESULT SECTION ===================== */}
                      <div className="mb-4">
                        {/* -------- Detected Condition -------- */}
                        <div className="text-uppercase text-muted fw-semibold fs-5 mb-2">
                          Detected Condition
                        </div>

                        <div className="d-flex align-items-center flex-wrap gap-3">
                          {/* Disease Name */}
                          <span className="fw-bold fs-4 text-dark">
                            {disease
                              ?.replace(/___/g, " - ")
                              ?.replace(/_/g, " ")}
                          </span>

                          {/* Severity Badge */}
                          {severity && (
                            <span
                              className={`badge fs-6 px-3 py-2 rounded-pill ${
                                severity === "High"
                                  ? "bg-danger"
                                  : severity === "Medium"
                                    ? "bg-warning text-dark"
                                    : "bg-success"
                              }`}
                            >
                              Severity: {severity}
                            </span>
                          )}

                          {/* Confidence Badge */}
                          {confidence !== null && (
                            <span className="badge fs-6 px-3 py-2 rounded-pill bg-success-subtle text-success border border-success-subtle">
                              {confidence}% Confidence
                            </span>
                          )}
                        </div>

                        {/* Crop + Location */}
                        <div className="mt-3 fs-5">
                          <div className="mb-2">
                            <span className="text-muted fw-semibold me-2">
                              Crop:
                            </span>
                            <span className="fw-bold text-dark">
                              {crop || "Unknown"}
                            </span>
                          </div>

                          {location && (
                            <div>
                              <span className="text-muted fw-semibold me-2">
                                Location:
                              </span>
                              <span className="fw-semibold text-dark">
                                {location}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <hr className="my-4" />

                      {/* ===================== RECOMMENDATION SECTION ===================== */}
                      <div className="mb-4">
                        <div className="text-uppercase text-muted fw-semibold fs-5 mb-3">
                          Recommended Actions
                        </div>

                        {/* Disease Type */}
                        {type && (
                          <div className="mb-3 fs-5">
                            <span className="fw-semibold me-2">
                              Disease Type:
                            </span>
                            <span className="badge bg-info text-dark fs-6 px-3 py-2 rounded-pill">
                              {type}
                            </span>
                          </div>
                        )}

                        {/* Fertilizer */}
                        {fertilizer && (
                          <div className="mb-3 fs-5">
                            <span className="fw-semibold me-2">
                              Recommended Fertilizer:
                            </span>
                            <span className="badge bg-success fs-6 px-3 py-2 rounded-pill">
                              {fertilizer}
                            </span>
                          </div>
                        )}

                        {/* Recommendations List */}
                        {recommendations.length > 0 ? (
                          <ul className="ps-3 fs-5">
                            {recommendations.map((rec, index) => (
                              <li key={index} className="mb-2">
                                {rec}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="fs-5 text-muted">
                            Monitor crop closely and consult local expert.
                          </div>
                        )}
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
