import React, { useState } from 'react'

const ProImgPreview = ({ img, onRemove }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    return (
        <div className="image-preview-container" style={{
            position: 'relative',
            width: '250px',
            height: '250px',
            margin: '10px',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            {isLoading && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5'
                }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {error ? (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5',
                    color: '#dc3545'
                }}>
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Failed to load
                </div>
            ) : (
                <img
                    src={img.url}
                    alt={img.fileName}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: isLoading ? 'none' : 'block'
                    }}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setError(true);
                        setIsLoading(false);
                    }}
                />
            )}

            <button
                onClick={(e) => {
                    e.preventDefault();
                    onRemove();
                }}
                style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    ':hover': {
                        backgroundColor: 'rgba(0,0,0,0.9)'
                    }
                }}
                title="Remove image"
            >
                <i className="fas fa-times" style={{ fontSize: '12px' }}></i>
            </button>
        </div>
    )
}

export default ProImgPreview