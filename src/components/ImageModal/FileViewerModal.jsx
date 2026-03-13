import React, { useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';

const FileViewerModal = ({ isOpen, fileUrl, title, onClose }) => {
  const [hasError, setHasError] = useState(false);
  const googleDocsViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;

  const handleIframeError = () => {
    setHasError(true);
  };

  return (
    <Modal show={isOpen} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        {hasError ? (
          <Alert variant="warning">
            <p>Unable to display the document directly due to security restrictions.</p>
            <p>Please download the file to view it.</p>
          </Alert>
        ) : (
          <iframe
            src={googleDocsViewerUrl}
            style={{ width: '100%', height: '500px' }}
            title={title}
            frameBorder="0"
            onError={handleIframeError}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" as="a" href={fileUrl} target="_blank" download>
          Download
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FileViewerModal;