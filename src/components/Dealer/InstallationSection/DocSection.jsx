import axios from 'axios';
import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify';
import { DX_URL } from '../../../config/baseUrl';
import SignatureCanvas from 'react-signature-canvas';

const DocSection = ({ installation, setInstallation, setDisable }) => {
    const [showSignaturePad, setShowSignaturePad] = useState(false);
    const sigCanvas = useRef(null); 

    const handleFileChange = async (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'application/pdf'
        ];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const isPDF = file.type === 'application/pdf' || fileExtension === 'pdf';
        if (!allowedTypes.includes(file.type) && !isPDF) {
            toast.error('Only image (JPEG, PNG) and PDF files are allowed');
            e.target.value = '';
            return;
        }
        const formData = new FormData();
        formData.append("image", file);
        try {
            setDisable(true);
            const response = await axios.post(`${DX_URL}/upload-image`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            const { data, message, success } = response.data;
            if (success) {
                const fileUrl = isPDF ? data?.pdf : data?.image
                setInstallation(prev => ({
                    ...prev,
                    [fieldName]: fileUrl
                }));
                toast.success(`${fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} uploaded successfully`);
            } else {
                toast.error(message || `Upload failed for ${fieldName}`);
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || `Error uploading ${field}`);
        } finally {
            setDisable(false);
        }
    }

    const handleSaveSignature = async () => {
        if (sigCanvas.current.isEmpty()) {
            toast.error('Please provide a signature first');
            return;
        }

        try {
            setDisable(true);

            // Create a new canvas with white background
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const signatureCanvas = sigCanvas.current.getCanvas();

            // Set canvas dimensions
            canvas.width = signatureCanvas.width;
            canvas.height = signatureCanvas.height;

            // Fill with white background
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw the signature
            ctx.drawImage(signatureCanvas, 0, 0);

            // Convert to data URL
            const signatureData = canvas.toDataURL('image/png');

            // Convert data URL to blob
            const response = await fetch(signatureData);
            const blob = await response.blob();
            const file = new File([blob], 'signature.png', { type: 'image/png' });

            const formData = new FormData();
            formData.append("image", file);

            const uploadResponse = await axios.post(`${DX_URL}/upload-image`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            const { data, success, message } = uploadResponse.data;
            if (success) {
                setInstallation(prev => ({
                    ...prev,
                    customerSignature: data.image
                }));
                toast.success('Signature saved successfully');
                setShowSignaturePad(false);
            } else {
                toast.error(message || 'Failed to save signature');
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Error saving signature');
            console.error('Signature save error:', err);
        } finally {
            setDisable(false);
        }
    };

    const handleClearSignature = () => {
        sigCanvas.current.clear();
    };

    return (
        <div className="mb-4">
            <h5 className="section-title mb-3 text-primary">Documentation</h5>
            <div className='row'>
                <div className="col-lg-4 col-md-6 col-12 mt-2 mb-3">
                    <div className="mb-3">
                        <label className="col-form-label">Product Serial No. Image </label>
                        <div className="drag-attach">
                            <input
                                type="file"
                                name="productSerialNoImage"
                                onChange={(e) => handleFileChange(e, 'productSerialNoImage')}
                                accept="image/*,.pdf"
                            />
                            {installation.productSerialNoImage ? (
                                <div className="my-2 mx-2">
                                    {installation.productSerialNoImage.endsWith('.pdf') ? (
                                        <a href={installation.productSerialNoImage} target="_blank" rel="noopener noreferrer">
                                            📄 View PDF
                                        </a>
                                    ) : (
                                        <img
                                            src={installation.productSerialNoImage}
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
                <div className="col-lg-4 col-md-6 col-12 mt-2 mb-3">
                    <div className="mb-3">
                        <label className="col-form-label">Customer Signature & Stamp </label>

                        {showSignaturePad ? (
                            <div className="signature-pad-container">
                                <div className="signature-pad-wrapper mb-2">
                                    <SignatureCanvas
                                        ref={sigCanvas}
                                        canvasProps={{
                                            width: 300,
                                            height: 150,
                                            className: 'signature-canvas',
                                            style: { background: 'white' }  // Add white background
                                        }}
                                        penColor="black"
                                    />
                                </div>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={handleSaveSignature}
                                    >
                                        Save Signature
                                    </button>
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={handleClearSignature}
                                    >
                                        Clear
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => setShowSignaturePad(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <button
                                    className="btn btn-sm btn-outline-primary mx-2 mb-2"
                                    onClick={() => setShowSignaturePad(true)}
                                >
                                    <i className="ti ti-pencil" /> Draw Signature
                                </button>
                                <div className="drag-attach">
                                    <input
                                        type="file"
                                        name="customerSignature"
                                        onChange={(e) => handleFileChange(e, 'customerSignature')}
                                        accept="image/*,.pdf"
                                    />
                                    {installation.customerSignature ? (
                                        <div className="my-2 mx-2">
                                            {installation.customerSignature.endsWith('.pdf') ? (
                                                <a href={installation.customerSignature} target="_blank" rel="noopener noreferrer">
                                                    📄 View PDF
                                                </a>
                                            ) : (
                                                <img
                                                    src={installation.customerSignature}
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
                            </>
                        )}
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 col-12 mt-2 mb-3">
                    <div className="mb-3">
                        <label className="col-form-label">Proof Of Delivery Image </label>
                        <div className="drag-attach">
                            <input
                                type="file"
                                name="proofDeliveryImage"
                                onChange={(e) => handleFileChange(e, 'proofDeliveryImage')}
                                accept="image/*,.pdf"
                            />
                            {installation.proofDeliveryImage ? (
                                <div className="my-2 mx-2">
                                    {installation.proofDeliveryImage.endsWith('.pdf') ? (
                                        <a href={installation.proofDeliveryImage} target="_blank" rel="noopener noreferrer">
                                            📄 View PDF
                                        </a>
                                    ) : (
                                        <img
                                            src={installation.proofDeliveryImage}
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
            </div>


        </div>
    )
}

export default DocSection