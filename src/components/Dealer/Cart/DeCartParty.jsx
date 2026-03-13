import React, { useEffect, useMemo, useState } from 'react'
import { getCompanyList } from '../../../middleware/company/company';
import { useDispatch, useSelector } from 'react-redux';
import { getDealerCustomerList } from '../../../middleware/customer/customer';
import { getDealerStorage } from '../../LocalStorage/DealerStorage';

const DeCartParty = ({
    setBillTo,
    setShipTo,
    companyId,
    billTo,
    shipTo,
    errors
}) => {
    const dispatch = useDispatch();
    const { companyList } = useSelector((state) => state.company);
    const { customerList } = useSelector((state) => state.customer);
    const dealerStorage = getDealerStorage();
    const [billData, setBillData] = useState([]);
    const [shipData, setShipData] = useState({
        companies: [],
        customers: [],
    });

    useEffect(() => {
        setBillData(companyList);
        setShipData({
            companies: companyList,
            customers: customerList,
        });
    }, [companyList, customerList])

    const [currentBillTo, setCurrentBillTo] = useState(billTo || {
        companyId: null,
        mailName: '',
        address: '',
        state: '',
        country: 'India',
        gstRegisterType: 'Registered',
        gstNo: '',
        placeOfSupply: ''
    });
    const [currentShipTo, setCurrentShipTo] = useState(shipTo || {
        shipId: null,
        shipType: '',
        mailName: '',
        address: '',
        state: '',
        country: 'India',
        gstRegisterType: 'Registered',
        gstNo: ''
    });

    useEffect(() => {
        dispatch(getCompanyList());
        dispatch(getDealerCustomerList(dealerStorage.DL_ID));
    }, [companyId]);

    useEffect(() => {
        // OLD CONDITION
        // if (billData.length > 0 && !currentBillTo.companyId) {
        if (billData.length > 0) {
            const defaultCompany = companyId
                ? billData.find(company => company._id === companyId)
                : billData[0];

            if (defaultCompany) {
                updateBillToFields(defaultCompany);
                updateShipToFields(defaultCompany, 'Company');
            }
        }
    }, [billData, companyId]);

    useEffect(() => {
        if (billTo) {
            setCurrentBillTo(billTo);
        }
    }, [billTo]);

    useEffect(() => {
        if (shipTo) {
            setCurrentShipTo(shipTo);
        }
    }, [shipTo]);

    const isIGST = useMemo(() => {
        return (
            currentBillTo.state &&
            currentShipTo.state &&
            currentBillTo.state.trim().toLowerCase() !== currentShipTo.state.trim().toLowerCase()
        );
    }, [currentBillTo.state, currentShipTo.state]);

    const getGstRegisterType = (entity) => {
        if (entity.isRegistrationType !== undefined) {
            return entity.isRegistrationType === 1 ? 'Registered' : 'Unregistered';
        }
        return entity.gstNo ? 'Registered' : 'Unregistered';
    };

    const updateBillToFields = (selectedCompany) => {
        console.log(selectedCompany, 'SEELCT COM')
        const newBillTo = {
            companyId: selectedCompany._id,
            mailName: selectedCompany.name,
            address: `${selectedCompany.address || ''} ${selectedCompany.addressTwo || ''} ${selectedCompany.addressThree || ''}`.trim(),
            state: selectedCompany.state || "",
            country: "India",
            gstRegisterType: selectedCompany.gstNo ? "Registered" : "Unregistered",
            gstNo: selectedCompany.gstNo || '',
            placeOfSupply: selectedCompany.state || ""
        };
        setCurrentBillTo(newBillTo);
        setBillTo(newBillTo);
    };

    const updateShipToFields = (selectedEntity, type) => {
        const newShipTo = {
            shipId: selectedEntity._id,
            shipType: type,
            mailName: selectedEntity.name,
            address: `${selectedEntity.address || ''} ${selectedEntity.addressTwo || ''} ${selectedEntity.addressThree || ''}`.trim(),
            state: selectedEntity.state || "",
            country: "India",
            gstRegisterType: getGstRegisterType(selectedEntity),
            gstNo: selectedEntity.gstNo || ''
        };
        setCurrentShipTo(newShipTo);
        setShipTo(newShipTo);
    };

    const handleBillToFieldChange = (e) => {
        const { name, value } = e.target;
        const updated = { ...currentBillTo, [name]: value };

        // Clear GST No if changing to Unregistered
        if (name === 'gstRegisterType' && value === 'Unregistered') {
            updated.gstNo = '';
        }

        setCurrentBillTo(updated);
        setBillTo(updated);
    };

    const handleShipToFieldChange = (e) => {
        const { name, value } = e.target;
        const updated = { ...currentShipTo, [name]: value };

        // Clear GST No if changing to Unregistered
        if (name === 'gstRegisterType' && value === 'Unregistered') {
            updated.gstNo = '';
        }

        setCurrentShipTo(updated);
        setShipTo(updated);
    };

    return (
        <div className="card">
            <div className="card-header">
                <h4 className="page-title">Party Details</h4>
            </div>
            <div className="card-body">
                <div className="row">
                    {/* Bill To Section */}
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>Bill To Company</label>
                            <select
                                // className="form-control form-select"
                                className={`form-control form-select ${errors?.billToCompanyId ? 'is-invalid' : ''}`}
                                value={currentBillTo.companyId || ''}
                                onChange={(e) => {
                                    const selected = billData.find(company => company._id === e.target.value);
                                    if (selected) updateBillToFields(selected);
                                }}
                            >
                                <option value="">Select Company</option>
                                {billData?.map(company => (
                                    <option key={company._id} value={company._id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                            {errors?.billToCompanyId && <small className="text-danger">{errors.billToCompanyId}</small>}
                        </div>

                        <div className="form-group">
                            <label>Mail Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="mailName"
                                value={currentBillTo?.mailName}
                                onChange={handleBillToFieldChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Address</label>
                            <textarea
                                className={`form-control ${errors?.billToAdd ? 'is-invalid' : ''}`}
                                name="address"
                                value={currentBillTo?.address}
                                onChange={handleBillToFieldChange}
                                rows="3"
                            />
                            {errors?.billToAdd && <small className="text-danger">{errors.billToAdd}</small>}
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label>State</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors?.billToState ? 'is-invalid' : ''}`}
                                        name="state"
                                        value={currentBillTo?.state}
                                        onChange={handleBillToFieldChange}
                                    />
                                    {errors?.billToState && <small className="text-danger">{errors.billToState}</small>}
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>GST Registration Type</label>
                                    <select
                                        className="form-control form-select"
                                        name="gstRegisterType"
                                        value={currentBillTo?.gstRegisterType}
                                        onChange={handleBillToFieldChange}
                                    >
                                        <option value="Registered">Registered</option>
                                        <option value="Unregistered">Unregistered</option>
                                    </select>
                                </div>
                            </div>
                            {currentBillTo.gstRegisterType === "Registered" && (
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>GST No</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="gstNo"
                                            value={currentBillTo?.gstNo}
                                            onChange={handleBillToFieldChange}
                                            disabled={currentBillTo?.gstRegisterType === 'Unregistered'}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Place of Supply</label>
                            <input
                                type="text"
                                className="form-control"
                                name="placeOfSupply"
                                value={currentBillTo.placeOfSupply}
                                onChange={handleBillToFieldChange}
                            />
                        </div>
                    </div>

                    {/* Ship To Section */}
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>Ship To</label>
                            <select
                                className="form-control form-select"
                                value={`${currentShipTo?.shipType}|${currentShipTo?.shipId}`}
                                onChange={(e) => {
                                    const [type, id] = e.target.value.split('|');
                                    let selected;

                                    if (type === 'Company') {
                                        selected = billData.find(item => item._id === id);
                                    } else if (type === 'Customer') {
                                        selected = shipData?.customers?.find(item => item._id === id);
                                    }
                                    if (selected) updateShipToFields(selected, type);
                                }}
                            >
                                <option value="">Select Destination</option>
                                <optgroup label="Companies">
                                    {billData?.map(company => (
                                        <option key={`Company|${company._id}`} value={`Company|${company._id}`}>
                                            {company.name}
                                        </option>
                                    ))}
                                </optgroup>
                                <optgroup label="Customers">
                                    {shipData.customers?.map(customer => (
                                        <option key={`Customer|${customer._id}`} value={`Customer|${customer._id}`}>
                                            {customer.name}
                                        </option>
                                    ))}
                                </optgroup>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Mail Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="mailName"
                                value={currentShipTo?.mailName}
                                onChange={handleShipToFieldChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Address</label>
                            <textarea
                                className={`form-control ${errors?.shipToAdd ? 'is-invalid' : ''}`}
                                name="address"
                                value={currentShipTo?.address}
                                onChange={handleShipToFieldChange}
                                rows="3"
                            />
                            {errors?.shipToAdd && <small className="text-danger">{errors.shipToAdd}</small>}
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label>State</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors?.shipToState ? 'is-invalid' : ''}`}
                                        name="state"
                                        value={currentShipTo?.state}
                                        onChange={handleShipToFieldChange}
                                    />
                                    {errors?.shipToState && <small className="text-danger">{errors.shipToState}</small>}
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>GST Registration Type</label>
                                    <select
                                        className="form-control form-select"
                                        name="gstRegisterType"
                                        value={currentShipTo?.gstRegisterType}
                                        onChange={handleShipToFieldChange}
                                    >
                                        <option value="Registered">Registered</option>
                                        <option value="Unregistered">Unregistered</option>
                                    </select>
                                </div>
                            </div>
                            {currentShipTo.gstRegisterType === "Registered" && (
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>GST No</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="gstNo"
                                            value={currentShipTo?.gstNo}
                                            onChange={handleShipToFieldChange}
                                            disabled={currentShipTo?.gstRegisterType === 'Unregistered'}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="row mt-3">
                            <div className="col-12 text-center">
                                <h5>
                                    <span className={`igst-label ${isIGST ? 'igst-true' : 'igst-false'}`}>
                                        {isIGST ? 'IGST Applicable' : 'CGST + SGST Applicable'}
                                    </span>
                                </h5>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeCartParty