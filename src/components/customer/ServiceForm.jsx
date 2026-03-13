import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import ServiceDetails from './ServiceDetails';
import { Dropdown } from "primereact/dropdown";
import moment from "moment";
import { getAllInstallation } from "../../middleware/customerUser/customerInstallation/installation";
import { getCustomerStorage } from "../LocalStorage/CustomerStorage";
import CustomerServiceDetails from "./CustomerServiceDetails";

const ServiceForm = ({
  service,
  handleChange,
  errors,
  handleComplainChange,
  complain,
}) => {
  const { poSerialNo } = useSelector((state) => state?.customerPoItems);
  const { installationList } = useSelector(
    (state) => state?.customerInstallation
  );

  const customerStorage = getCustomerStorage()

  const [filterSerialNo, setFilterSerialNo] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const formData = new URLSearchParams();
    formData.append("customerId", customerStorage?.CU_ID);
    dispatch(getAllInstallation(formData));
  }, []);

  useEffect(() => {
    if (installationList?.length > 0) {
      const installationSerialIds = installationList?.map(inst => inst.serialNoId);
      const filteredSerials = poSerialNo?.filter(serial =>
        installationSerialIds.includes(serial._id)
      );
      setFilterSerialNo(filteredSerials);
    }
  }, [installationList, poSerialNo]);


  return (
    <>
      <div className="container-fluid">
        {/* Main Form Section */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-gradient-primary text-white">
            <h5 className="mb-0 fw-bold">
              <i className="fas fa-tools me-2"></i>Service Information
            </h5>
          </div>
          <div className="card-body p-4">
            <div className="row g-3">
              <div className="col-lg-4 col-md-6">
                <div className="form-floating">
                  <input
                    type="date"
                    className={`form-control ${errors.serviceDate ? "is-invalid" : ""
                      }`}
                    name="serviceDate"
                    value={service.serviceDate}
                    onChange={handleChange}
                    max={moment().format("YYYY-MM-DD")}
                  />
                  <label>
                    Service Date <span className="text-danger">*</span>
                  </label>
                  {errors.serviceDate && (
                    <div className="invalid-feedback">{errors.serviceDate}</div>
                  )}
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="form-floating">
                  <Dropdown
                    name="serialNoId"
                    value={service.serialNoId ? service.serialNoId : null}
                    onChange={handleChange}
                    options={filterSerialNo}
                    optionLabel="companySerialNo"
                    optionValue="_id"
                    placeholder="Select Serial No"
                    filter
                    showClear
                    className={`w-100 ${errors.serialNoId ? "is-invalid" : ""}`}
                    pt={{
                      root: { className: "p-dropdown p-component form-select" },
                      input: { className: "p-dropdown-label p-inputtext" },
                      panel: { className: "p-dropdown-panel p-component" },
                      item: { className: "p-dropdown-item" },
                      filterInput: {
                        className: "p-dropdown-filter p-inputtext p-component",
                      },
                    }}
                  />
                  <label>
                    Serial Number <span className="text-danger">*</span>
                  </label>
                  {errors.serialNoId && (
                    <div className="invalid-feedback">{errors.serialNoId}</div>
                  )}
                </div>
              </div>

              <div className="col-12">
                <div className="form-floating">
                  <textarea
                    className={`form-control ${errors.description ? "is-invalid" : ""
                      }`}
                    name="description"
                    value={complain.description}
                    onChange={handleComplainChange}
                    style={{ height: "100px" }}
                    placeholder="Describe the issue..."
                  />
                  <label>
                    Nature Of Complaint <span className="text-danger">*</span>
                  </label>
                  {errors.description && (
                    <div className="invalid-feedback">{errors.description}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <CustomerServiceDetails service={service} />
      </div>
    </>
  );
};

export default ServiceForm;
