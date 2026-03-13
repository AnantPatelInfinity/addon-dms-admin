import React, { useEffect, useState } from 'react'
import useModal from '../../Modal/useModal';
import PoCustomerModal from './PoCustomerModal';
import { useApi } from '../../../context/ApiContext';
import { useDealerApi } from '../../../context/DealerApiContext';
import { getDealerStorage } from '../../LocalStorage/DealerStorage';

const PoCustomerData = ({ po, errors, handleChange, isDealer = false }) => {

    if (!isDealer) {
        var { get } = useApi();
    } else {
        var { get } = useDealerApi();
        var dealerStorage = getDealerStorage();
    }
    const modal = useModal();
    const [customerData, setCustomerData] = useState([]);
    const [custObj, setCustObj] = useState({});
    const [showCustomerDetails, setShowCustomerDetails] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const url = isDealer
                ? `/dealer/get-dealer-customer?status=true&dealerId=${dealerStorage.DL_ID}`
                : `/admin/get-customer?status=true`;

            try {
                const [customerRes] = await Promise.all([get(url)]);
                setCustomerData(customerRes.data);
            } catch (error) {
                console.error("Failed to fetch customer data:", error);
            }
        };
        fetchData();
    }, [modal.isShown, isDealer]);

    useEffect(() => {
        if (po.customerId) {
            const customer = customerData?.find(cust => cust._id === po.customerId);
            setCustObj(customer);
        }
    }, [po.customerId, customerData]);

    return (
        <div className="card">
            <div className="card-header">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="">
                        <h4 className="page-title">Customer</h4>
                    </div>
                    <div className="">
                        <button type='button' className='btn btn-outline-primary' onClick={modal.show}><i className="ti ti-square-rounded-plus me-2" /> Add Customer</button>
                    </div>
                </div>
            </div>

            <div className="card-body">
                <div className="row">
                    <div className="col-lg-4 col-md-6 col-12">
                        <div className="form-floating mb-3">
                            <select
                                className={`form-control form-select ${errors.customerId ? "is-invalid" : ""}`}
                                name="customerId"
                                value={po.customerId}
                                onChange={handleChange}
                                placeholder="customerId"
                            >
                                <option>Select Customer</option>
                                {customerData?.map((e, i) => (
                                    <option key={i} value={e?._id}>
                                        {e?.name}
                                    </option>
                                ))}
                            </select>
                            <label>
                                Customer <span className="text-danger">*</span>
                            </label>
                            {errors.customerId && (
                                <div className="invalid-feedback">
                                    {errors.customerId}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {custObj && custObj._id && (
                    <div className="mb-3">
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setShowCustomerDetails(!showCustomerDetails)}
                        >
                            {showCustomerDetails ? 'Hide' : 'Show'} Customer Details
                        </button>
                    </div>
                )}
                {custObj && custObj._id && showCustomerDetails && (
                    <div className="row">
                        <div className="col-12">
                            <h5>Customer Details</h5>
                            <ul className="list-group mt-3">
                                <li className="list-group-item"><strong>Name:</strong> {custObj.name}</li>
                                <li className="list-group-item"><strong>Email:</strong> {custObj.email}</li>
                                <li className="list-group-item"><strong>Phone:</strong> {custObj.phone}</li>
                                <li className="list-group-item"><strong>Contact Person:</strong> {custObj.conactPersonName}</li>
                                <li className="list-group-item"><strong>Contact Person Phone:</strong> {custObj.contactPersonPhone}</li>
                                <li className="list-group-item"><strong>Address:</strong> {custObj.address}, {custObj.addressTwo}, {custObj.addressThree}</li>
                                <li className="list-group-item"><strong>City:</strong> {custObj.city}</li>
                                <li className="list-group-item"><strong>State:</strong> {custObj.state}</li>
                                <li className="list-group-item"><strong>Pincode:</strong> {custObj.pincode}</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
            <PoCustomerModal modal={modal} isDealer={isDealer} dealerStorage={dealerStorage} />
        </div>
    )
}

export default PoCustomerData