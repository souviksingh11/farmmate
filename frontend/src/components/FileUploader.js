import { FaCloudUploadAlt } from "react-icons/fa";

export default function FileUploader({ onChange }) {
  return (
    <label className="fm-upload-box">
      <FaCloudUploadAlt size={32} className="text-success mb-2" />
      <span className="fw-semibold">Click to upload</span>
      <small className="text-muted">or drag and drop image</small>

      <input
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => onChange?.(e.target.files?.[0] || null)}
      />
    </label>
  );
}
