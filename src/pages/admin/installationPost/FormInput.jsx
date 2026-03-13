import React from "react";

export default function FormInput({
  formData,
  loading,
  handleChange,
  handleCompanyChange,
  handleImageUpload,
  handleDownloadImage,
  installations = [],
}) {
  return (
    <div
      className="card p-4 border-0 h-100 w-100 "
      style={{
        borderRadius: "16px",
        background: "linear-gradient(135deg, #f8f9fa, #ffffff)",
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
      }}
    >
      <h3 className="fw-bold text-primary mb-4 text-center">
        Create Your Document
      </h3>

      <div className="mb-3">
        <label className="form-label fw-semibold">Select Installation</label>
        <select
          className="form-select rounded-3"
          name="reportNo"
          value={formData.reportNo}
          onChange={handleCompanyChange} 
        >
          <option value="">Select Installation</option>
          {installations.map((inst) => (
            <option key={inst.id} value={inst.reportNo}>
              {inst.reportNo}
            </option>
          ))}
        </select>
        {loading.company && (
          <div className="mt-1 text-muted small">
            Loading company details...
          </div>
        )}
      </div>
      
      <div className="mb-3">
        <label className="form-label fw-semibold">Description</label>
        <textarea
          name="description"
          className="form-control rounded-3"
          rows="2"
          value={formData.description}
          onChange={handleChange}
          placeholder="Write something...."
        />
      </div>

      <div className="row mt-3">
        {formData.images.map((img, i) => (
          <div className="col-lg-4 col-md-6 col-sm-12 mb-2" key={i}>
            <label className="form-label fw-semibold">
              Upload Image {i + 1}
            </label>
            <div
              className="border rounded-3 d-flex align-items-center justify-content-center w-100"
              style={{
                height: "250px",
                cursor: "pointer",
                backgroundColor: "#f1f3f5",
                backgroundImage: img ? `url(${img})` : "",
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "0.3s",
              }}
              onClick={() => document.getElementById(`file-input-${i}`).click()}
            >
              {!img && <span className="text-muted">Click to upload</span>}
            </div>
            <input
              type="file"
              accept="image/*"
              id={`file-input-${i}`}
              style={{ display: "none" }}
              onChange={(e) => handleImageUpload(e, i)}
            />
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
        <button
          className="btn btn-primary px-4 rounded-3 shadow-sm d-flex align-items-center gap-2"
          onClick={handleDownloadImage}
          disabled={formData.images.every(img => !img) || loading.image}
        >
          {loading.image && (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            />
          )}
          {loading.image ? "Downloading..." : " Download Image"}
        </button>
      </div>
    </div>
  );
}