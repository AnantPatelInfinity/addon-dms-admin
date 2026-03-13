import moment from 'moment';
import { useMemo } from 'react';
import { Dropdown } from 'primereact/dropdown';

const AdInstallationSection = ({ installation, errors, handleChange, data, dropdowns, }) => {

    const allSerialNumbers = dropdowns?.serialNoData || [];

    const installedSerialNumbers = dropdowns?.installSerialNo || [];

    const availableSerialNumbers = useMemo(() => {
        if (!allSerialNumbers.length) return [];

        return allSerialNumbers.filter(serial =>
            !installedSerialNumbers.some(installed => installed._id === serial._id)
        );
    }, [allSerialNumbers, installedSerialNumbers]);

    const serialNumbersForDropdown = useMemo(() => {
        if (data && installation.serialNoId) {
            const currentSerial = allSerialNumbers.find(s => s._id === installation.serialNoId);
            if (currentSerial) {
                return [currentSerial, ...availableSerialNumbers.filter(s => s._id !== installation.serialNoId)];
            }
        }
        return availableSerialNumbers;
    }, [availableSerialNumbers, allSerialNumbers, installation.serialNoId, data]);

    const selectedSerial = useMemo(() => {
        return allSerialNumbers.find(s => s._id === installation.serialNoId);
    }, [installation.serialNoId, allSerialNumbers]);

    const purchaseDays = selectedSerial
        ? moment().diff(moment(selectedSerial.companyInvoiceDate), 'days')
        : null;

    return (
        <div className="mb-4">
            <h5 className="section-title mb-3 text-primary">Installation Details</h5>
            <div className="row">
                <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-floating mb-3">
                        <input
                            type='date'
                            className={`form-control ${errors.registerDate ? "is-invalid" : ""}`}
                            name="registerDate"
                            value={installation.registerDate}
                            onChange={handleChange}
                            min={moment().format("YYYY-MM-DD")}
                            max={moment().format("YYYY-MM-DD")} 
                        />
                        <label>Register Date <span className="text-danger">*</span></label>
                        {errors.registerDate && <div className="invalid-feedback">{errors.registerDate}</div>}
                    </div>
                </div>

                <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-floating mb-3">
                        <select
                            className={`form-control form-select ${errors.installationType ? "is-invalid" : ""}`}
                            name="installationType"
                            value={installation.installationType}
                            onChange={handleChange}
                        >
                            <option value="">Select Installation Type</option>
                            <option value="sotck_from_order">Stock From Order</option>
                        </select>
                        <label>Installation Type <span className="text-danger">*</span></label>
                        {errors.installationType && <div className="invalid-feedback">{errors.installationType}</div>}
                    </div>
                </div>

                {installation.installationType && (
                    <div className="col-lg-4 col-md-6 col-12">
                        <div className="form-floating mb-3">
                            {/* <select
                                className={`form-control form-select ${errors.serialNoId ? "is-invalid" : ""}`}
                                name="serialNoId"
                                value={installation.serialNoId}
                                onChange={handleChange}
                                disabled={data}
                            >
                                <option value="">Select Machine Serial No.</option>
                                {serialNumbersForDropdown?.map((e) =>
                                    <option value={e?._id} key={e?._id}>{e?.companySerialNo} {e?.dealerId && <>(Dealer PO)</>}</option>
                                )}
                            </select>
                            <label>Machine Serial No <span className="text-danger">*</span></label>
                            {errors.serialNoId && <div className="invalid-feedback">{errors.serialNoId}</div>}
                            {selectedSerial && (
                                <div className="mt-1 text-success small">
                                    <div><strong>Company Invoice Date:</strong> {moment(selectedSerial.companyInvoiceDate).format("DD-MM-YYYY")}</div>
                                    <div><strong>Purchase Days:</strong> {purchaseDays} days ago</div>
                                </div>
                            )} */}
                            <Dropdown
                                name="serialNoId"
                                value={installation.serialNoId}
                                onChange={handleChange}
                                options={serialNumbersForDropdown}
                                optionLabel="companySerialNo"
                                optionValue="_id"
                                placeholder="Select Machine Serial No"
                                filter
                                showClear 
                                disabled={data}
                                className={`w-100 ${errors.serialNoId ? 'is-invalid' : ''}`}
                                pt={{
                                    root: { className: 'p-dropdown p-component form-select' },
                                    input: { className: 'p-dropdown-label p-inputtext' },
                                    panel: { className: 'p-dropdown-panel p-component' },
                                    item: { className: 'p-dropdown-item' },
                                    filterInput: { className: 'p-dropdown-filter p-inputtext p-component' }
                                }}
                            />
                            <label>Machine Serial No <span className="text-danger">*</span></label>
                            {errors.serialNoId && <div className="invalid-feedback d-block">{errors.serialNoId}</div>}
                            {selectedSerial && (
                                <div className="mt-1 text-success small">
                                    <div><strong>Company Invoice Date:</strong> {moment(selectedSerial.companyInvoiceDate).format("DD-MM-YYYY")}</div>
                                    <div><strong>Purchase Days:</strong> {purchaseDays} days ago</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-floating mb-3">
                        <select
                            className={`form-control form-select ${errors.installWarrantyId ? "is-invalid" : ""}`}
                            name="installWarrantyId"
                            value={installation.installWarrantyId}
                            disabled
                            onChange={handleChange}
                        >
                            <option value="">Select Warranty</option>
                            {dropdowns?.warrantyData?.map((e) =>
                                <option value={e?._id} key={e?._id}>{e?.name}</option>
                            )}
                        </select>
                        <label>Warranty <span className="text-danger">*</span></label>
                        {errors.installWarrantyId && <div className="invalid-feedback">{errors.installWarrantyId}</div>}
                    </div>
                </div>

                <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-floating mb-3">
                        <input
                            type='date'
                            className={`form-control ${errors.physicalInstallDate ? "is-invalid" : ""}`}
                            name="physicalInstallDate"
                            value={installation.physicalInstallDate}
                            onChange={handleChange}
                            max={moment().format("YYYY-MM-DD")}
                        />
                        <label>Physical Installation Date <span className="text-danger">*</span></label>
                        {errors.physicalInstallDate && <div className="invalid-feedback">{errors.physicalInstallDate}</div>}
                    </div>
                </div>

                {installation.warrantyStartDate && installation.warrantyEndDate && (
                    <div className="col-12 mb-4">
                        <div className="alert alert-primary">
                            Warranty: <strong>{moment(installation.warrantyStartDate).format('DD-MM-YYYY')}</strong> to <strong>{moment(installation.warrantyEndDate).format('DD-MM-YYYY')}</strong>
                        </div>
                    </div>
                )}

                <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-floating mb-3">
                        <input
                            type='text'
                            className={`form-control ${errors.engineerName ? "is-invalid" : ""}`}
                            name="engineerName"
                            value={installation.engineerName}
                            onChange={handleChange}
                            placeholder='Enter Engineer Name'
                        />
                        <label>Enginner Name <span className="text-danger">*</span></label>
                        {errors.engineerName && <div className="invalid-feedback">{errors.engineerName}</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdInstallationSection