import React from 'react'

const DeRegiSection = ({ renderInput, firms, states, cities, formData }) => {
    return (
        <>
            <div className="form-column">
                <div className="form-section">
                    <h3 className="section-title">Basic Information</h3>
                    {renderInput('firmId', 'Firm Name', 'select', {
                        required: true,
                        options: firms.map(firm => ({
                            value: firm._id,
                            label: firm.name
                        }))
                    })}
                    {renderInput('dealerCompanyName', 'Dealer Full Name', 'text', { required: true})}
                    <div className="form-row">
                        {renderInput('name', 'Dealer Company Name', 'text', { required: true, halfWidth: true })}
                        {renderInput('email', 'Email', 'email', { required: true, halfWidth: true })}
                    </div>
                    <div className="form-row mb-0">
                        {renderInput('password', 'Password', 'password', { required: true, halfWidth: true, isPass: true })}
                        {renderInput('confirmPassword', 'Confirm Password', 'password', { required: true, halfWidth: true })}
                    </div>
                </div>

                <div className="form-section">
                    <h3 className="section-title">Address Information</h3>
                    {renderInput('address', 'Address Line 1', 'text', { required: true })}
                    {renderInput('addressTwo', 'Address Line 2')}
                    {renderInput('addressThree', 'Landmark')}
                    <div className="form-row">
                        {renderInput('state', 'State', 'select', {
                            required: true,
                            halfWidth: true,
                            options: states.map(s => ({ value: s.name, label: s.name }))
                        })}
                        {renderInput('city', 'City', 'select', {
                            required: true,
                            halfWidth: true,
                            options: cities.map((c, idx) => ({ value: c.name, label: c.name }))
                        })}
                    </div>
                    <div className="form-row">
                        {renderInput('pincode', 'Pincode', 'number', { required: true, halfWidth: true, maxLength: 6 })}
                        {renderInput('phone', 'Phone Number', 'number', { required: true, halfWidth: true, maxLength: 10 })}
                    </div>
                    <div className="row">
                    <div className="col-12">
                        <div className="form-floating mb-3">
                            <textarea
                            className="form-control"
                          style={{height: "100px"}}
                            disabled
                            value={[
                                formData.address,
                                formData.addressThree,
                                formData.addressTwo,
                                formData.city && formData.pincode
                                ? `${formData.city} - ${formData.pincode}`
                                : formData.city || formData.pincode,
                                formData.state,
                            ]
                                .filter(Boolean)
                                .join(", ")}
                            />
                            <label style={{ fontSize: "12px" }}>Address Preview</label>
                        </div>
                    </div>
              </div>
                </div>
            </div>
        </>
    )
}

export default DeRegiSection