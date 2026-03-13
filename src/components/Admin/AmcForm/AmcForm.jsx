import React, { useEffect, useState } from 'react'
import ImageUpload from '../ImageUpload/ImageUpload';
import { getAdminStorage } from '../../LocalStorage/AdminStorage';
import { useApi } from '../../../context/ApiContext';
import RenderCoverageInfo from './RenderCoverageInfo';
import AmcStartDate from './AmcStartDate';
import { Dropdown } from "primereact/dropdown";

const AmcForm = ({
    amc,
    setAmc,
    errors,
    handleChange,
    dropdowns,
    editId
}) => {
    const { post } = useApi();
    const [customerSerialNo, setCustomerSerialNo] = useState([]);
    const [installationObj, setInstallationObj] = useState(null);
    const adminStorage = getAdminStorage();
    const [lastAmc, setLastAmc] = useState(null);
    const [coverageStatus, setCoverageStatus] = useState({
        isUnderWarranty: false,
        isUnderAMC: false,
        canCreateAMC: true,
        message: ''
    });

    useEffect(() => {
        if (amc?.warrantyId && amc?.startDate) {
            const findWarranty = dropdowns?.warrantyData?.find(item => item?._id === amc?.warrantyId);
            if (findWarranty) {
                const startDate = new Date(amc.startDate);
                const endDate = new Date(startDate);
                endDate.setMonth(startDate.getMonth() + findWarranty.duration);
                const formattedEndDate = endDate.toISOString().split('T')[0];
                setAmc(prev => ({
                    ...prev,
                    endDate: formattedEndDate
                }));
            }
        }
    }, [amc?.warrantyId, amc?.startDate, editId]);

    useEffect(() => {
        if (!amc?.customerId) {
            setCustomerSerialNo([]);
            setInstallationObj({});
            setCoverageStatus({
                isUnderWarranty: false,
                isUnderAMC: false,
                canCreateAMC: true,
                message: ''
            });
            setLastAmc(null);
            setAmc(prev => ({
                ...prev,
                serialNoId: '',
                installationId: '',
                companyId: '',
                startDate: '',
                endDate: '',
            }));
            return;
        }

        const findSerialNo = dropdowns?.installationData?.filter(
            item => item?.customerId === amc?.customerId
        );
        setCustomerSerialNo(findSerialNo || []);

        const findInstallation = dropdowns?.installationData?.find(
            item => item?.serialNoId === amc?.serialNoId
        );
        if (findInstallation) {
            setAmc(prev => ({
                ...prev,
                installationId: findInstallation?._id,
                companyId: findInstallation?.companyId,
            }));
            setInstallationObj(findInstallation);
        } else {
            setInstallationObj(null);
        }
    }, [amc?.customerId, amc?.serialNoId, dropdowns.installationData]);

    console.log(amc.serialNoId)

    useEffect(() => {
        if (amc?.customerId && amc?.serialNoId) {
            getLastAmc();
        } else {
            setLastAmc(null);
            setCoverageStatus({
                isUnderWarranty: false,
                isUnderAMC: false,
                canCreateAMC: true,
                message: ''
            });
        }
    }, [amc?.customerId, amc?.serialNoId]);

    useEffect(() => {
        if (installationObj) {
            checkCoverageStatus(lastAmc);
        }
    }, [installationObj, lastAmc]);

    const getLastAmc = async () => {
        try {
            const response = await post(`/admin/get-last-amc-warranty`, {
                firmId: adminStorage.DX_AD_FIRM,
                customerId: amc?.customerId,
                serialNoId: amc?.serialNoId,
            });
            const { data: resData, message, success } = response;
            if (success) {
                setLastAmc(resData);
            }
        } catch (error) {
            console.log(error, "getLastAmc");
        }
    }

    const checkCoverageStatus = (amcData) => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        let status = {
            isUnderWarranty: false,
            isUnderAMC: false,
            canCreateAMC: true,
            message: ''
        };

        // Check warranty status based on installation warranty dates
        if (installationObj?.warrantyEndDate) {
            const warrantyEndDate = new Date(installationObj.warrantyEndDate);
            warrantyEndDate.setHours(0, 0, 0, 0);

            if (currentDate <= warrantyEndDate) {
                status.isUnderWarranty = true;
                status.canCreateAMC = false;
                status.message = `Equipment is under warranty until ${warrantyEndDate.toLocaleDateString()}. AMC cannot be created during warranty period.`;
            }
        }

        // Only check AMC status if not under warranty
        if (!status.isUnderWarranty && amcData) {
            if (amcData.isExpired === false) {
                status.isUnderAMC = true;
                status.canCreateAMC = false;
                status.message = `Equipment is under AMC coverage. New AMC cannot be created until current AMC expires.`;
            } else {
                status.canCreateAMC = true;
                status.message = `Equipment is out of warranty and AMC. New AMC can be created.`;
            }
        }

        // If under warranty, no need to check AMC
        if (status.isUnderWarranty) {
            status.canCreateAMC = false;
        }

        // If no installation object or AMC data and not under warranty
        if (!status.isUnderWarranty && !amcData) {
            status.canCreateAMC = true;
            status.message = `Equipment is out of warranty. New AMC can be created.`;
        }
        setCoverageStatus(status);
    };

    return (
        <>
            {editId && (
                <div className="alert alert-info mb-4">
                    You are editing an existing AMC contract. Some fields cannot be modified.
                </div>
            )}

            <div className="row">
                <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-floating mb-3">
                        <input
                            type="date"
                            className={`form-control ${errors.entryDate ? "is-invalid" : ""}`}
                            name="entryDate"
                            value={amc.entryDate}
                            onChange={handleChange}
                            placeholder="Entry Date"
                        />
                        <label>Entry Date <span className="text-danger">*</span></label>
                        {errors.entryDate && <div className="invalid-feedback">{errors.entryDate}</div>}
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-floating mb-3">
                        <Dropdown
                            name="customerId"
                            value={amc.customerId}
                            onChange={(e) => handleChange({
                                target: {
                                    name: 'customerId',
                                    value: e.value
                                }
                            })}
                            options={dropdowns?.customerData}
                            optionLabel={(e) => `${e?.title} ${e?.name} ${e?.lastName} ${e?.clinicName ? `(${e?.clinicName})` : ''}`}
                            optionValue="_id"
                            showClear
                            filter
                            disabled={editId}
                            placeholder="Select Customer"
                            className={`w-100 ${errors.customerId ? 'is-invalid' : ''}`}
                            pt={{
                                root: { className: 'p-dropdown p-component form-select' },
                                input: { className: 'p-dropdown-label p-inputtext' },
                                panel: { className: 'p-dropdown-panel p-component' },
                                item: { className: 'p-dropdown-item' }
                            }}
                            itemTemplate={(option) => (
                                <div>
                                    <div>{option.title} {option.name} {option.lastName}</div>
                                    {option.clinicName && <div className="small text-muted">{option.clinicName}</div>}
                                </div>
                            )}
                        />
                        <label>Customer (Clinic / Hospital Name)<span className="text-danger">*</span></label>
                        {errors.customerId && <div className="invalid-feedback">{errors.customerId}</div>}
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-floating mb-3">
                        <Dropdown
                            name="serialNoId"
                            value={amc.serialNoId}
                            onChange={(e) => handleChange({
                                target: {
                                    name: 'serialNoId',
                                    value: e.value
                                }
                            })}
                            options={customerSerialNo}
                            optionLabel="productSerialNo"
                            optionValue="serialNoId"
                            placeholder="Select Serial No"
                            filter
                            showClear
                            disabled={editId || !amc.customerId}
                            className={`w-100 ${errors.serialNoId ? 'is-invalid' : ''}`}
                            pt={{
                                root: { className: 'p-dropdown p-component form-select' },
                                input: { className: 'p-dropdown-label p-inputtext' },
                                panel: { className: 'p-dropdown-panel p-component' },
                                item: { className: 'p-dropdown-item' },
                                filterInput: { className: 'p-dropdown-filter p-inputtext p-component' }
                            }}
                        />
                        <label>Serial No <span className="text-danger">*</span></label>
                        {errors.serialNoId && <div className="invalid-feedback">{errors.serialNoId}</div>}
                    </div>
                </div>

                {amc?.customerId && amc?.serialNoId && (
                    <>
                        <RenderCoverageInfo installationObj={installationObj} lastAmc={lastAmc} coverageStatus={coverageStatus} />
                    </>
                )}

                <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-floating mb-3">
                        <select
                            className={`form-select ${errors.warrantyId ? "is-invalid" : ""}`}
                            name="warrantyId"
                            value={amc.warrantyId}
                            onChange={handleChange}>
                            <option value="">Select Warranty</option>
                            {dropdowns?.warrantyData?.map((item) => (
                                <option key={item._id} value={item._id}>{item.name}</option>
                            ))}
                        </select>
                        <label>Warranty <span className="text-danger">*</span></label>
                        {errors.warrantyId && <div className="invalid-feedback">{errors.warrantyId}</div>}
                    </div>
                </div>

                <AmcStartDate
                    amc={amc} handleChange={handleChange}
                    errors={errors} coverageStatus={coverageStatus}
                    installationObj={installationObj} lastAmc={lastAmc}
                    editId={editId}
                />

                <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-floating mb-3">
                        <input
                            type="number"
                            className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                            name="amount"
                            value={amc.amount}
                            onChange={handleChange}
                            placeholder="Amount"
                        />
                        <label>Amount <span className="text-danger">*</span></label>
                        {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                    </div>
                </div>
                <div className="col-12">
                    <div className="form-floating mb-3">
                        <textarea
                            className={`form-control ${errors.description ? "is-invalid" : ""}`}
                            name="description"
                            value={amc.description}
                            onChange={handleChange}
                            placeholder="Description"
                        />
                        <label>Description </label>
                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                    </div>
                </div>
                <div className="col-12">
                    <div className="form-floating mb-3">
                        <ImageUpload label="Document" name="document" value={amc.document} onChange={(k, v) => setAmc(p => ({ ...p, [k]: v }))} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default AmcForm