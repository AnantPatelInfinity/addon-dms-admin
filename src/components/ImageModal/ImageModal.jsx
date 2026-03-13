import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ImageModal = ({
    imageUrl,
    altText = 'Image Preview',
    isOpen,
    onClose,
    title = 'Image Preview',
    closeButtonText = 'Close',
    maxWidth = '100%',
    maxHeight = '70vh'
}) => {
    const isPdf = imageUrl?.toLowerCase().endsWith('.pdf');
    const [pdfLoadError, setPdfLoadError] = useState(false);

    // Handle PDF viewing with fallback options
    const handlePdfView = () => {
        // Open in new tab (most reliable)
        window.open(imageUrl, '_blank');
    };

    const handleIframeError = () => {
        setPdfLoadError(true);
    };

    return (
        <Modal
            show={isOpen}
            onHide={onClose}
            centered
            size="lg"
            keyboard={true}
        >
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                {isPdf ? (
                    pdfLoadError ? (
                        // Show fallback UI when PDF can't be loaded
                        <div className="alert alert-warning" style={{ margin: '20px 0' }}>
                            <h5>PDF Preview Unavailable</h5>
                            <p>This PDF cannot be displayed due to server security settings.</p>
                            <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                                <Button variant="primary" onClick={handlePdfView}>
                                    Open PDF in New Tab
                                </Button>
                                <Button variant="outline-primary" as="a" href={imageUrl} download>
                                    Download PDF
                                </Button>
                            </div>
                        </div>
                    ) : (
                        // Try multiple PDF viewing strategies
                        <div>
                            {/* Strategy 1: Try Google Docs Viewer first */}
                            <iframe
                                src={`https://docs.google.com/viewer?url=${encodeURIComponent(imageUrl)}&embedded=true`}
                                style={{ width: '100%', height: '500px', border: 'none' }}
                                title={altText}
                                onError={handleIframeError}
                                onLoad={(e) => {
                                    // Check if Google Viewer actually loaded content
                                    setTimeout(() => {
                                        try {
                                            const iframe = e.target;
                                            if (iframe.contentDocument?.body?.innerHTML?.includes('error') ||
                                                iframe.contentDocument?.body?.innerText?.includes('error')) {
                                                setPdfLoadError(true);
                                            }
                                        } catch (err) {
                                            // Cross-origin error is expected, but we can still use the iframe
                                            console.log('PDF loaded in iframe');
                                        }
                                    }, 1000);
                                }}
                            />

                            {/* Fallback message for users if Google Viewer is slow */}
                            <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
                                Having trouble viewing?
                                <Button variant="link" onClick={handlePdfView} style={{ padding: '0 5px' }}>
                                    Open in new tab
                                </Button>
                            </div>
                        </div>
                    )
                ) : (
                    <img
                        src={imageUrl}
                        alt={altText}
                        style={{
                            maxWidth,
                            maxHeight,
                            objectFit: 'contain'
                        }}
                        className="img-fluid"
                    />
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    {closeButtonText}
                </Button>
                {isPdf ? (
                    <>
                        <Button variant="primary" as="a" href={imageUrl} target="_blank" download>
                            Download
                        </Button>
                    </>
                ) : (
                    <Button variant="primary" as="a" href={imageUrl} target="_blank" download>
                        Download
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default ImageModal;