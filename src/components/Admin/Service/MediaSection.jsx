import React, { useState } from 'react';
import axios from 'axios';
import { DX_URL } from '../../../config/baseUrl';
import { toast } from 'react-toastify';

const MediaSection = ({
    type,
    title,
    accept,
    icon,
    mediaFiles = [],
    onMediaUpdate,
    disabled = false,
    required = false
}) => {

    const [uploadProgress, setUploadProgress] = useState({});

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDuration = (duration) => {
        if (!duration) return '';
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const maxSize = type === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // 50MB for video, 10MB for others
        const invalidFiles = files.filter(file => file.size > maxSize);

        if (invalidFiles.length > 0) {
            toast.error(`Some files are too large. Maximum size: ${formatFileSize(maxSize)}`);
            return;
        }

        setUploadProgress({ type, progress: 0 });

        try {
            const formData = new FormData();
            files.forEach(file => {
                formData.append("media", file);
            });

            const { data } = await axios.post(`${DX_URL}/upload-media`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress({ type, progress });
                }
            });

            if (data?.files && Array.isArray(data.files)) {
                const updatedFiles = [...mediaFiles, ...data.files];
                onMediaUpdate(type, updatedFiles);
            }

        } catch (err) {
            console.error("Upload error", err);
            toast.error("Upload failed. Please try again.");
        } finally {
            setUploadProgress({});
        }
    };

    const removeMediaFile = (index) => {
        const updatedFiles = mediaFiles.filter((_, i) => i !== index);
        onMediaUpdate(type, updatedFiles);
    };

    const renderImageGrid = () => (
        <div className="row g-3">
            {mediaFiles?.map((item, idx) => (
                <div key={idx} className="col-6 col-md-4 col-lg-3">
                    <div className="media-item-wrapper position-relative rounded-3 overflow-hidden shadow-sm border">
                        <img
                            src={item?.url}
                            alt={`uploaded-${idx}`}
                            className="img-fluid w-100"
                            style={{ height: '120px', objectFit: 'cover', cursor: 'pointer' }}
                            onClick={() => window.open(item?.url, '_blank')}
                        />

                        {/* Overlay */}
                        <div className="media-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                            <button
                                className="btn btn-light btn-sm me-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(item?.url, '_blank');
                                }}
                                title="View full size"
                            >
                                <i className="fas fa-eye"></i>
                            </button>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeMediaFile(idx);
                                }}
                                title="Remove"
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>

                        {/* Filename */}
                        <div className="position-absolute bottom-0 start-0 w-100 p-2 bg-dark bg-opacity-75">
                            <small className="text-white text-truncate d-block" title={item?.originalName}>
                                {item?.originalName}
                            </small>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );


    const renderAudioGrid = () => (
        <div className="row g-3">
            {mediaFiles.map((item, idx) => (
                <div key={idx} className="col-12 col-md-6">
                    <div className="media-item border rounded-3 p-3 bg-light">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <div className="d-flex align-items-center flex-grow-1 me-3">
                                <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3"
                                    style={{ width: '40px', height: '40px' }}>
                                    <i className="fas fa-music text-white"></i>
                                </div>
                                <div className="flex-grow-1">
                                    <h6 className="mb-1 text-truncate" title={item.originalName}>
                                        {item.originalName}
                                    </h6>
                                    <small className="text-muted">
                                        {item.size && formatFileSize(item.size)}
                                    </small>
                                </div>
                            </div>
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => removeMediaFile(idx)}
                                title="Remove audio"
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                        <audio
                            controls
                            src={item.url}
                            className="w-100"
                            style={{ height: '40px' }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );

    const renderVideoGrid = () => (
        <div className="row g-3">
            {mediaFiles.map((item, idx) => (
                <div key={idx} className="col-12 col-md-6 col-lg-4">
                    <div className="media-item border rounded-3 overflow-hidden shadow-sm">
                        <div className="position-relative">
                            <video
                                controls
                                src={item.url}
                                className="w-100"
                                style={{ height: '200px', objectFit: 'cover' }}
                                poster={item.thumbnail}
                            />
                            <button
                                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                                onClick={() => removeMediaFile(idx)}
                                title="Remove video"
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                        <div className="p-3 bg-light">
                            <h6 className="mb-1 text-truncate" title={item.originalName}>
                                {item.originalName}
                            </h6>
                            <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted">
                                    {item.size && formatFileSize(item.size)}
                                </small>
                                {item.duration && (
                                    <small className="text-muted">
                                        <i className="fas fa-clock me-1"></i>
                                        {formatDuration(item.duration)}
                                    </small>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderPdfGrid = () => (
        <div className="row g-3">
            {mediaFiles.map((item, idx) => (
                <div key={idx} className="col-12 col-md-6 col-lg-4">
                    <div className="media-item border rounded-3 p-3 bg-light d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <i className="fas fa-file-pdf text-danger fs-2 me-3"></i>
                            <div>
                                <h6 className="mb-0 text-truncate" title={item.originalName}>
                                    {item.originalName}
                                </h6>
                                <small className="text-muted">
                                    {item.size && formatFileSize(item.size)}
                                </small>
                            </div>
                        </div>
                        <div>
                            <button
                                className="btn btn-outline-primary btn-sm me-2"
                                onClick={() => window.open(item.url, "_blank")}
                            >
                                <i className="fas fa-eye"></i>
                            </button>
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => removeMediaFile(idx)}
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderMixedGrid = () => (
        <div className="row g-3">
            {mediaFiles.map((item, idx) => {
                const isPdf = item.url?.toLowerCase().endsWith('.pdf');
                return isPdf ? (
                    <div key={idx} className="col-12 col-md-6 col-lg-4">
                        <div className="media-item border rounded-3 p-3 bg-light d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <i className="fas fa-file-pdf text-danger fs-2 me-3"></i>
                                <div>
                                    <h6 className="mb-0 text-truncate" title={item.originalName}>
                                        {item.originalName}
                                    </h6>
                                    <small className="text-muted">
                                        {item.size && formatFileSize(item.size)}
                                    </small>
                                </div>
                            </div>
                            <div>
                                <button
                                    className="btn btn-outline-primary btn-sm me-2"
                                    onClick={() => window.open(item.url, '_blank')}
                                >
                                    <i className="fas fa-eye"></i>
                                </button>
                                <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => removeMediaFile(idx)}
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div key={idx} className="col-6 col-md-4 col-lg-3">
                        <div className="media-item-wrapper position-relative rounded-3 overflow-hidden shadow-sm border">
                            <img
                                src={item.url}
                                alt={`uploaded-${idx}`}
                                className="img-fluid w-100"
                                style={{ height: '120px', objectFit: 'cover', cursor: 'pointer' }}
                                onClick={() => window.open(item.url, '_blank')}
                            />
                            <div className="media-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                                <button
                                    className="btn btn-light btn-sm me-2"
                                    onClick={(e) => { e.stopPropagation(); window.open(item.url, '_blank'); }}
                                    title="View full size"
                                >
                                    <i className="fas fa-eye"></i>
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={(e) => { e.stopPropagation(); removeMediaFile(idx); }}
                                    title="Remove"
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                            <div className="position-absolute bottom-0 start-0 w-100 p-2 bg-dark bg-opacity-75">
                                <small className="text-white text-truncate d-block" title={item.originalName}>
                                    {item.originalName}
                                </small>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    const renderMediaGrid = () => {
        switch (type) {
            case 'image':
                return renderImageGrid();
            case 'audio':
                return renderAudioGrid();
            case 'video':
                return renderVideoGrid();
            case 'pdf':
                return renderPdfGrid();
            case 'mixed':
                return renderMixedGrid();
            default:
                return null;
        }
    };

    const getAcceptedFormats = () => {
        switch (type) {
            case 'image':
                return 'Supports: JPG, PNG, WEBP (Max: 10MB)';
            case 'audio':
                return 'Supports: MP3, WAV, MPEG (Max: 10MB)';
            case 'video':
                return 'Supports: MP4, MOV, AVI (Max: 50MB)';
            case 'pdf':
                return 'Supports: PDF (Max: 10MB)';
            case 'mixed':
                return 'Supports: JPG, PNG, PDF (Max: 10MB)';
            default:
                return '';
        }
    };

    return (
        <div className="col-12 mb-4">
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-light py-3">
                    <div className="d-flex align-items-center justify-content-between">
                        <h6 className="mb-0 fw-bold text-dark">
                            <i className={`${icon} me-2 text-primary`}></i>
                            {title} {required ? <><span className="text-danger">*</span></> : null}
                        </h6>
                        <span className="badge bg-primary">
                            {mediaFiles.length} file{mediaFiles.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                <div className="card-body">
                    {/* Upload Area */}
                    <div className="upload-area border-2 border-dashed border-primary rounded-3 p-4 text-center mb-3 position-relative"
                        style={{ backgroundColor: '#f8f9ff', cursor: 'pointer' }}
                        onClick={() => document.getElementById(`${type}-upload`).click()}>

                        {uploadProgress.type === type ? (
                            <div>
                                <div className="spinner-border spinner-border-sm text-primary mb-2" role="status"></div>
                                <p className="mb-0 text-muted">Uploading... {uploadProgress.progress}%</p>
                                <div className="progress mt-2" style={{ height: '4px' }}>
                                    <div className="progress-bar" style={{ width: `${uploadProgress.progress}%` }}></div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <i className={`${icon} fs-1 text-primary mb-2 d-block`}></i>
                                <p className="mb-0 fw-medium text-dark">Click to upload {title.toLowerCase()}</p>
                                <small className="text-muted">
                                    {getAcceptedFormats()}
                                </small>
                            </div>
                        )}

                        <input
                            id={`${type}-upload`}
                            type="file"
                            accept={accept}
                            multiple
                            onChange={handleFileChange}
                            className="d-none"
                            disabled={disabled}
                        />
                    </div>

                    {/* Media Grid */}
                    {mediaFiles.length > 0 && (
                        <div className="media-grid">
                            {renderMediaGrid()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MediaSection