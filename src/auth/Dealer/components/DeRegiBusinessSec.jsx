import React from 'react'

const DeRegiBusinessSec = ({ renderInput, formData, errors, handleChange }) => {
    return (
        <>
            <div className="form-section">
                <h3 className="section-title">Business Information</h3>
                <div className="form-row">
                    {renderInput('gstNo', 'GST Number', 'text', { required: true, halfWidth: true })}
                    {renderInput('panNo', 'PAN Number', 'text', { required: true, halfWidth: true })}
                </div>
                <div className="form-row">
                    {renderInput('drugLicenseOne', 'Drug License 1', 'text', { required: true, halfWidth: true })}
                    {renderInput('drugLicenseTwo', 'Drug License 2', 'text', { halfWidth: true })}
                </div>
            </div>

            <div className="form-section">
                <h3 className="section-title">Documents</h3>
                {renderInput('image', 'Upload Logo Image', 'file', {
                    required: true,
                })}
                {renderInput('signature', 'Upload Signature & Stamp', 'file', {
                    // required: true,
                    allowPdf: true
                })}
            </div>

            <div className="checkbox-group">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                    />
                    <span className="checkmark"></span>
                    I agree to the <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>
                </label>
                {errors.agreeTerms && <span className="error-message">{errors.agreeTerms}</span>}
            </div>
        </>
    )
}

export default DeRegiBusinessSec