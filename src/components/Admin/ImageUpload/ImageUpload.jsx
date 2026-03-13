// components/ImageUpload.js
import React from "react";
import { toast } from "react-toastify";
import { useApi } from "../../../context/ApiContext";

const ImageUpload = ({ label, name, value, onChange, allowPdf = false }) => {
    const { uploadImage } = useApi();

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedImageTypes = [
            'image/jpeg',
            'image/png',
        ];

        if (allowPdf) {
            // Allow both images and PDF
            if (!allowedImageTypes.includes(file.type) && file.type !== 'application/pdf') {
                toast.error('Only image (JPEG, PNG) and PDF files are allowed');
                return;
            }
        } else {
            // Only allow images
            if (!allowedImageTypes.includes(file.type)) {
                toast.error('Only image files are allowed (JPEG, PNG)');
                return;
            }
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
            console.error("Image upload failed:", err);
            toast.error(err?.response?.data?.message || "Something went wrong");
        }
    };

    const isPdf = value?.toLowerCase().endsWith(".pdf");

    return (
        <div className="col-lg-4 col-md-6 col-12 mt-2 mb-3">
            <div className="mb-3">
                <label className="col-form-label">{label}</label>
                <div className="drag-attach">
                    <input type="file" onChange={handleFileChange} />
                    {value ? (
                        <div className="my-2 mx-2">
                            {/* <img
                                src={value}
                                alt="Uploaded"
                                style={{
                                    width: "100%",
                                    maxHeight: "200px",
                                    objectFit: "cover",
                                    borderRadius: "10px",
                                }}
                            /> */}
                            {isPdf ? (
                                <a href={value} target="_blank" rel="noopener noreferrer">
                                    📄 PDF
                                </a>
                            ) : (
                                <img
                                    src={value}
                                    alt="Uploaded"
                                    style={{
                                        width: "100%",
                                        maxHeight: "200px",
                                        objectFit: "cover",
                                        borderRadius: "10px",
                                    }}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="img-upload">
                            <i className="ti ti-file-broken" /> Upload File
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;
