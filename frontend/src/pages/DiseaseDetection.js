import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';
import { createScan } from '../services/scanService';
import { swalSuccess, swalError, swalConfirm } from "../utils/swal";


export default function DiseaseDetection() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [crop, setCrop] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
  setError('');
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
      "Crop disease detection completed successfully"
    );
  } catch (err) {
    console.error(err);

    // ❌ Error SweetAlert
    swalError(
      "Analysis Failed",
      "Unable to analyze image. Please try again."
    );
  } finally {
    setLoading(false);
  }
}


  function handleFileChange(e) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setResult(null);
    setError('');

    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }

  // ==== Friendly recommendation view ====
  const disease = result?.result?.disease || 'No clear disease detected';
  const confidence =
    typeof result?.result?.confidence === 'number'
      ? Math.round(result.result.confidence * (result.result.confidence <= 1 ? 100 : 1))
      : null; // handle 0.87 vs 87
  const recommendationText =
    result?.result?.recommendation ||
    result?.recommendation ||
    'No specific recommendation returned. Monitor crop closely and consult a local expert if symptoms worsen.';
  const severity = result?.result?.severity || null;

  return (
    <div className="d-flex">
      <Sidebar />
      <main className="flex-grow-1" style={{ background: '#fafaf8' }}>
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
                      style={{ borderStyle: 'dashed' }}
                    >
                      <div className="mb-2 fw-semibold">Upload Crop Image <span className="text-danger">*</span></div>
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
                              maxWidth: '100%',
                              maxHeight: 220,
                              objectFit: 'contain',
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
                        <div className="mt-2 text-muted" style={{ fontSize: 12 }}>
                          Selected: {file.name}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Crop Name <span className="text-danger">*</span></label>
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
                        'Analyze Crop Health'
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
                  <h4 className="mb-3 text-center">Analysis Results</h4>

                  {!result ? (
                    <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center">
                      <div>Ready for Analysis</div>
                      <p className="mt-2 mb-0">
                        Upload a crop image and provide details to get a simple, clear
                        disease diagnosis and fertilizer/treatment recommendation.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Summary header */}
                      <div className="mb-3">
                        <div className="text-uppercase text-muted" style={{ fontSize: 11 }}>
                          Detected Condition
                        </div>
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <span className="fw-semibold" style={{ fontSize: 18 }}>
                            {disease}
                          </span>
                          {severity && (
                            <span className="badge bg-warning text-dark">
                              Severity: {severity}
                            </span>
                          )}
                          {confidence !== null && (
                            <span className="badge bg-success-subtle text-success border border-success-subtle">
                              {confidence}% confidence
                            </span>
                          )}
                        </div>
                        <div className="text-muted mt-1" style={{ fontSize: 13 }}>
                          Crop: <span className="fw-semibold">{crop || 'Unknown'}</span>
                          {location && (
                            <>
                              {' '}
                              · Location:{' '}
                              <span className="fw-semibold">{location}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Recommendation */}
                      <div className="mb-3">
                        <div className="text-uppercase text-muted mb-1" style={{ fontSize: 11 }}>
                          Recommended Actions
                        </div>
                        <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                          {recommendationText}
                        </div>
                      </div>

                      {/* Optional: show notes & raw JSON for debugging */}
                      {notes && (
                        <div className="mb-3">
                          <div
                            className="text-uppercase text-muted mb-1"
                            style={{ fontSize: 11 }}
                          >
                            Your Notes
                          </div>
                          <div style={{ fontSize: 13 }}>{notes}</div>
                        </div>
                      )}

                      <details className="mt-auto" style={{ fontSize: 12 }}>
                        <summary className="text-secondary" style={{ cursor: 'pointer' }}>
                          View raw AI response (for debugging)
                        </summary>
                        <pre className="bg-light p-2 mt-2 text-start">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </details>
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
