import React from 'react'

const CheckListSection = ({ checkList, setCheckList }) => {

    const handleCheck = (e) => {
        const { name, checked } = e.target;
        setCheckList(prev => ({ ...prev, [name]: checked }));
    };

    return (
        <>
            <div className="mb-4">
                <h5 className="section-title mb-3 text-primary">Checklist For Installation</h5>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="isInstallationDone"
                                id="isInstallationDone"
                                checked={checkList.isInstallationDone}
                                onChange={handleCheck}
                            />
                            <label className="form-check-label" htmlFor="isInstallationDone">
                                Installation Completed
                            </label>
                        </div>

                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="isArebProcessDone"
                                id="isArebProcessDone"
                                checked={checkList.isArebProcessDone || false}
                                onChange={handleCheck}
                            />
                            <label className="form-check-label" htmlFor="isArebProcessDone">
                                AREB Process Completed
                            </label>
                        </div>

                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="isManualReceived"
                                id="isManualReceived"
                                checked={checkList.isManualReceived || false}
                                onChange={handleCheck}
                            />
                            <label className="form-check-label" htmlFor="isManualReceived">
                                Manual Received
                            </label>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="isEquipmentDemo"
                                id="isEquipmentDemo"
                                checked={checkList.isEquipmentDemo || false}
                                onChange={handleCheck}
                            />
                            <label className="form-check-label" htmlFor="isEquipmentDemo">
                                Equipment Demo Completed
                            </label>
                        </div>

                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="userTraining"
                                id="userTraining"
                                checked={checkList.userTraining || false}
                                onChange={handleCheck}
                            />
                            <label className="form-check-label" htmlFor="userTraining">
                                User Training Completed
                            </label>
                        </div>

                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="serviceContact"
                                id="serviceContact"
                                checked={checkList.serviceContact || false}
                                onChange={handleCheck}
                            />
                            <label className="form-check-label" htmlFor="serviceContact">
                                Service Contact Provided
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CheckListSection