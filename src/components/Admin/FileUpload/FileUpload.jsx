// components/FileUpload.jsx
import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useApi } from "../../../context/ApiContext";

const FileUpload = ({
    label,
    name,
    value,
    onChange,
    acceptImage = true,
    acceptPdf = true,
    required = false
}) => {
    const { uploadImage } = useApi();
    const fileInputRef = useRef(null);
    const [hovered, setHovered] = useState(false);

    const allowedMimeTypes = [
        ...(acceptImage ? ["image/jpeg", "image/png"] : []),
        ...(acceptPdf ? ["application/pdf"] : []),
    ];

    const acceptAttr = [
        ...(acceptImage ? ["image/jpeg", "image/png"] : []),
        ...(acceptPdf ? [".pdf"] : []),
    ].join(",");

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!allowedMimeTypes.includes(file.type)) {
            const allowed = [
                ...(acceptImage ? ["JPEG", "PNG"] : []),
                ...(acceptPdf ? ["PDF"] : []),
            ].join(", ");
            toast.error(`Only ${allowed} files are allowed`);
            return;
        }

        try {
            const res = await uploadImage("/upload-image", file);
            const { data, message, success } = res;
            if (success) {
                const uploadedUrl = data?.image || data?.pdf || "";
                onChange(name, uploadedUrl);
                toast.success(message);
            } else {
                toast.error(message);
            }
        } catch (err) {
            console.error("File upload failed:", err);
            toast.error(err?.response?.data?.message || "Something went wrong");
        }

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDelete = () => {
        onChange(name, "");
    };

    const handleView = () => {
        window.open(value, "_blank");
    };

    const isPdf = value?.toLowerCase().endsWith(".pdf");

    return (
        <div className="col-12 mt-2">
            <div className="mb-1">
                <label className="col-form-label">{label} {required ? <><span className="text-danger">*</span></> : null} </label>

                {value ? (
                    isPdf ? (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "8px",
                                padding: "10px 14px",
                                background: "#fff3f3",
                                borderRadius: "8px",
                                border: "1px solid #f0c0c0",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
                                <i
                                    className="ti ti-file-type-pdf"
                                    style={{ fontSize: "24px", color: "#c0392b", flexShrink: 0 }}
                                />
                                <span
                                    style={{
                                        color: "#c0392b",
                                        fontWeight: 500,
                                        fontSize: "14px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    PDF Uploaded
                                </span>
                            </div>
                            <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={handleView}
                                    title="View PDF"
                                >
                                    <i className="ti ti-eye" />
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={handleDelete}
                                    title="Remove"
                                >
                                    <i className="ti ti-trash" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            style={{ position: "relative", borderRadius: "10px", overflow: "hidden", cursor: "pointer" }}
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                        >
                            <img
                                src={value}
                                alt="Uploaded"
                                style={{
                                    width: "100%",
                                    maxHeight: "200px",
                                    objectFit: "cover",
                                    display: "block",
                                    borderRadius: "10px",
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    borderRadius: "10px",
                                    background: "rgba(0,0,0,0.5)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "10px",
                                    opacity: hovered ? 1 : 0,
                                    transition: "opacity 0.2s ease",
                                    pointerEvents: hovered ? "auto" : "none",
                                }}
                            >
                                <button
                                    type="button"
                                    className="btn btn-light btn-sm"
                                    onClick={handleView}
                                    title="View image"
                                >
                                    <i className="ti ti-eye" style={{ fontSize: "16px" }} />
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={handleDelete}
                                    title="Remove"
                                >
                                    <i className="ti ti-trash" style={{ fontSize: "16px" }} />
                                </button>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="drag-attach">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={acceptAttr}
                            onChange={handleFileChange}
                        />
                        <div className="img-upload">
                            <i className="ti ti-file-upload" /> Upload File
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
