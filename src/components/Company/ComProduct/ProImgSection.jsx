import axios from 'axios';
import React, { useState } from 'react'
import { DX_URL } from '../../../config/baseUrl';
import { toast } from 'react-toastify';
import ProImgPreview from './ProImgPreview';

const ProImgSection = ({ imgs, setImgs }) => {

    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const handleMultiImgs = async (e) => {
        const files = Array.from(e.target.files);
        if (files?.length === 0) return;

        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

        // Validate files
        for (const file of files) {
            if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                toast.error(`Invalid file type: ${file.name}. Only images are allowed.`);
                return;
            }
            if (file.size > MAX_FILE_SIZE) {
                toast.error(`File too large: ${file.name}. Max size is 5MB.`);
                return;
            }
        }
        try {
            setIsUploading(true);
            setUploadProgress(0);
            const formData = new FormData();
            files.forEach((file) => {
                formData.append(`images`, file);
            });

            const result = await axios.post(`${DX_URL}/upload-images`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                },
            });

            const { data: uploadedImages, message, success } = result.data;
            if (success) {
                setImgs((prev) => {
                    const newImages = uploadedImages.filter(
                        newImg => !prev.some(existingImg => existingImg.fileName === newImg.fileName)
                    );
                    return [...prev, ...newImages];
                });
                toast.success(message || `${files?.length} image(s) uploaded successfully`);
            } else {
                toast.error(message);
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                error.message ||
                'An error occurred while uploading images'
            );
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
            e.target.value = '';
        }
    }

    return (
        <>
            <div className='row'>
                <div className="col-lg-4 col-md-6 col-12 mt-2 mb-3">
                    <div className="mb-3">
                        <label className="col-form-label">Product Images</label>
                        <div className="drag-attach">
                            <input
                                type="file"
                                multiple
                                onChange={handleMultiImgs}
                                accept="image/jpeg, image/png, image/webp, image/gif"
                                disabled={isUploading}
                            />
                            <div className="img-upload">
                                {isUploading ? (
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="visually-hidden">Uploading...</span>
                                        </div>
                                        <span>Uploading... {uploadProgress}%</span>
                                    </div>
                                ) : (
                                    <>
                                        <i className="ti ti-file-broken" />
                                        <span>Upload File</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <small className="text-muted">Max 5MB per image (JPEG, PNG, WEBP, GIF)</small>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="d-flex flex-wrap gap-3 mb-4">
                        {imgs?.length === 0 ? (
                            <div className="text-muted d-flex align-items-center justify-content-center"
                                style={{ width: '100%', minHeight: '100px', border: '1px dashed #ddd', borderRadius: '8px' }}>
                                No images uploaded yet
                            </div>
                        ) : (
                            imgs?.map((img, i) => (
                                <ProImgPreview
                                    key={`${img.fileName}-${i}`}
                                    img={img}
                                    onRemove={() => setImgs(prev => prev.filter(p => p.fileName !== img.fileName))}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProImgSection