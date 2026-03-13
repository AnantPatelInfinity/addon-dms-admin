import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { DX_URL } from '../../../config/baseUrl';
import { useApi } from '../../../context/ApiContext';

const PaymentHistory = ({ serviceId, fetchServiceData, serviceObj }) => {
    const { post } = useApi();
    const [pdfs, setPdfs] = useState([]);
    const [disable, setDisable] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        let pdfList = [];
        if (serviceObj?.paymentDocument?.pdf) {
            let pdfData = serviceObj.paymentDocument.pdf;
            // If pdfData is a string, try to parse it
            if (typeof pdfData === 'string') {
                try {
                    pdfData = JSON.parse(pdfData);
                } catch (e) {
                    pdfData = [];
                }
            }
            // Normalize to array of objects with url, time, and name
            if (Array.isArray(pdfData)) {
                pdfList = pdfData.map((item, idx) => {
                    if (typeof item === 'string') {
                        return { url: item, time: new Date().toISOString(), name: `Receipt_${idx + 1}.pdf` };
                    }
                    return {
                        url: item.url || item.pdf || '',
                        time: item.time || new Date().toISOString(),
                        name: item.name || `Receipt_${idx + 1}.pdf`,
                    };
                });
            }
        }
        setPdfs(pdfList);
    }, [serviceObj]);

    const handleImgChange = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const invalidFiles = files.filter(file => file.type !== 'application/pdf' || file.size > 10 * 1024 * 1024);
        if (invalidFiles.length > 0) {
            toast.error('Only PDF files under 10MB are allowed');
            return;
        }

        try {
            setDisable(true);
            setIsUploading(true);
            setUploadProgress(0);

            const formData = new FormData();
            files.forEach(file => {
                formData.append("images", file);
            });

            const response = await axios.post(`${DX_URL}/upload-multiple-image`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(progress);
                }
            });

            if (response.data.success) {
                const uploadTime = new Date().toISOString();
                const newPdfs = response.data.data.map((item, idx) => ({
                    url: item.pdf || item.url || '',
                    time: uploadTime,
                    name: item.name || files[idx]?.name || `Receipt_${pdfs.length + idx + 1}.pdf`,
                }));
                setPdfs(prev => [...prev, ...newPdfs]);
                toast.success("PDFs uploaded successfully!");
            }

        } catch (error) {
            console.error("Upload error", error);
            toast.error("Upload failed. Please try again.");
        } finally {
            setDisable(false);
            setIsUploading(false);
            setUploadProgress(0);
        }
    }

    const handleSubmit = async () => {
        if (pdfs.length === 0) {
            toast.error("Please upload at least one payment receipt");
            return;
        }

        try {
            setDisable(true)
            const payload = {
                paymentDocument: JSON.stringify(pdfs) // Confirm backend expects stringified array
            }
            const response = await post(`/admin/admin-payment-upload/${serviceId}`, payload);
            const { success, message } = response;
            if (success) {
                toast.success(message);
                fetchServiceData();
            } else {
                toast.error(message);
            }
        } catch (error) {
            console.log(error, "Error")
            toast.error(error?.response?.data?.message || 'An error occurred.');
        } finally {
            setDisable(false)
        }
    }

    const handleDeletePdf = (index) => {
        setPdfs(prev => prev.filter((_, i) => i !== index));
        // toast.success("PDF removed successfully");
    };

    return (
        <div className="card shadow-sm border-0 mt-4">
            <div className="card-header bg-light border-0">
                <h5 className="card-title mb-0 text-primary">
                    <i className="fas fa-file-invoice-dollar me-2"></i>
                    Payment History Details
                </h5>
            </div>

            <div className="card-body">
                <div className="row g-3">
                    <div className="col-12 col-lg-4 col-md-6">
                        <div className="mb-3">
                            <label htmlFor="pdfUpload" className="form-label">
                                Upload Payment Receipts (PDF only)
                            </label>
                            <input
                                type="file"
                                className="form-control"
                                id="pdfUpload"
                                accept=".pdf,application/pdf"
                                multiple
                                onChange={handleImgChange}
                                disabled={disable || isUploading}
                            />
                            <div className="form-text">
                                Only PDF files are accepted. Maximum size: 10MB per file.
                            </div>

                            {isUploading && (
                                <div className="mt-2">
                                    <div className="progress">
                                        <div
                                            className="progress-bar progress-bar-striped progress-bar-animated"
                                            role="progressbar"
                                            style={{ width: `${uploadProgress}%` }}
                                            aria-valuenow={uploadProgress}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                            {uploadProgress}%
                                        </div>
                                    </div>
                                    <small className="text-muted">Uploading files...</small>
                                </div>
                            )}
                        </div>

                        {pdfs.length > 0 && (
                            <div className="mt-4">
                                <h6 className="mb-3">Uploaded Receipts:</h6>
                                <div className="list-group">
                                    {pdfs.map((pdf, index) => (
                                        <div key={pdf.url + '_' + (pdf.time || index)} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div className="d-flex flex-column">
                                                <a
                                                    href={pdf.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary text-decoration-none"
                                                >
                                                    <i className="fas fa-file-pdf me-2"></i>
                                                    {pdf.name || `Receipt_${index + 1}.pdf`}
                                                </a>
                                                <small className="text-muted">
                                                    Uploaded: {pdf.time ? (new Date(pdf.time).toLocaleString() !== 'Invalid Date' ? new Date(pdf.time).toLocaleString() : 'Unknown') : 'Unknown'}
                                                </small>
                                            </div>
                                            <div>
                                                <a
                                                    href={pdf.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    title="View PDF"
                                                >
                                                    <i className="fas fa-eye"></i>
                                                </a>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDeletePdf(index)}
                                                    title="Delete PDF"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mt-3 d-flex justify-content-end">
                        <button
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={disable}
                        >
                            {isUploading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Processing...
                                </>
                            ) : (
                                'Save Payment History'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentHistory