import React from "react";
import DateTime from "../../../helpers/DateFormat/DateTime";
import moment from "moment";

const InstallSection = ({ companyInstallationOneList, openImageModal, isDealer = false }) => {
  const checkList = companyInstallationOneList?.checkList;

  return (
    <>
      {/* Installation Details Section */}
      <div className="mb-5">
        <h5 className="mb-3 border-bottom pb-2 text-primary">
          Installation Details
        </h5>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold">Installation Type</label>
            <p>
              {companyInstallationOneList?.installationType?.replace(
                /_/g,
                " "
              ) || "N/A"}
            </p>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold">Register Date</label>
            <p>
              <DateTime
                value={companyInstallationOneList?.registerDate}
                format="date"
              />
            </p>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold">Physical Install Date</label>
            <p>
              <DateTime
                value={companyInstallationOneList?.physicalInstallDate}
                format="date"
              />
            </p>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold">Engineer Name</label>
            <p>{companyInstallationOneList?.engineerName || "N/A"}</p>
          </div>
          <div className="col-md-8 mb-3">
            <label className="form-label fw-bold">Engineer Remarks</label>
            <p>{companyInstallationOneList?.engineerRemarks || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Customer Details Section */}
      <div className="mb-5">
        <h5 className="mb-3 border-bottom pb-2 text-primary">
          Customer Details
        </h5>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold">Name</label>
            <p>
              {`${companyInstallationOneList?.customerTitle || ""} ${companyInstallationOneList?.customerFirstName || ""
                } ${companyInstallationOneList?.customerLastName || ""}`.trim() ||
                "N/A"}
            </p>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold">Clinic/Hospital Name</label>
            <p>{companyInstallationOneList?.customerClinicName || "N/A"}</p>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold">Email</label>
            <p>{companyInstallationOneList?.customerEmail || "N/A"}</p>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold">Phone</label>
            <p>{companyInstallationOneList?.customerPhone || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Dynamic Installation Data Section */}
      {Object.keys(companyInstallationOneList?.productAttributes ?? {})?.length > 0 && (
        <div className="mb-5">
          {Object.entries(
            Object.entries(companyInstallationOneList.productAttributes).reduce(
              (acc, [key, attr]) => {
                const category = attr.category || "Uncategorized";
                if (!acc[category]) acc[category] = [];
                acc[category].push(attr);
                return acc;
              },
              {}
            )
          ).map(([category, attributes], idx) => (
            <div key={idx} className="mb-4">
              <h4 className="text-primary border-bottom pb-1 mb-3">
                {category}
              </h4>
              <div className="row">
                {attributes.map((attr, i) => {
                  const { label, value, inputType, unit } = attr;

                  if (inputType === "checkbox") {
                    return (
                      <div className="col-12 col-sm-6 col-md-4 mb-3" key={i}>
                        <div className="form-check d-flex align-items-center">
                          <input
                            type="checkbox"
                            className="form-check-input me-2 mb-1"
                            checked={value === true || value === "true"}
                            readOnly
                          />
                          <label className="form-check-label">
                            {label || "Unnamed Field"}
                          </label>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="col-12 col-sm-6 col-md-4 mb-3" key={i}>
                      <label className="form-label fw-bold d-block">
                        {label || "Unnamed Field"}
                      </label>
                      {inputType === "date" ||
                        label.toLowerCase().includes("date") ? (
                        <p>
                          {value && moment(value).isValid() ? (
                            moment(value).format("DD-MM-YYYY")
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </p>
                      ) : (
                        <p>
                          {value !== null && value !== "" ? (
                            `${value}${unit ? ` ${unit}` : ""}`
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Equipment Details Section */}
      <div className="mb-5">
        <h5 className="mb-3 border-bottom pb-2 text-primary">
          Equipment Details
        </h5>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold">Equipment Name</label>
            <p>{companyInstallationOneList?.equipmentName || "N/A"}</p>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold">Product Model</label>
            <p>{companyInstallationOneList?.productModel || "N/A"}</p>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold">Product Serial No</label>
            <p>{companyInstallationOneList?.productSerialNo || "N/A"}</p>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold">Installation Warranty</label>
            <p>{companyInstallationOneList?.installWarranty || "N/A"}</p>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold">Manufacturer</label>
            <p>{companyInstallationOneList?.companyName || "N/A"}</p>
          </div>
          {companyInstallationOneList?.productSerialNoImage ? (
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">
                Product Serial No Image
              </label>
              <div>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() =>
                    openImageModal(
                      companyInstallationOneList.productSerialNoImage,
                      "Product Serial No Image",
                      "Product Serial No Image"
                    )
                  }
                >
                  View Image
                </button>
              </div>
            </div>
          ) : (
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">
                Product Serial No Image
              </label>
              <p className="text-muted">No image uploaded</p>
            </div>
          )}
        </div>
      </div>

      {/* Dealer Details Section */}
      {isDealer === true ? (
        <div className="mb-5">
          <h5 className="mb-3 border-bottom pb-2 text-primary">Dealer Details</h5>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Dealer Name</label>
              <p>{companyInstallationOneList?.dealerName || "N/A"}</p>
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Dealer Email</label>
              <p>{companyInstallationOneList?.dealerEmail || "N/A"}</p>
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Dealer Phone</label>
              <p>{companyInstallationOneList?.dealerPhone || "N/A"}</p>
            </div>
          </div>
        </div>
      ) : ""}

      {/* FOR OLD DATA SHOW */}
      {Object.keys(companyInstallationOneList?.productAttributes ?? {})?.length === 0 && (
        <div className="mb-3">
          <h5 className="mb-3 border-bottom pb-2 text-primary">
            Checklist For Installation
          </h5>
          <div className="row">
            <div className="col-md-6">
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isInstallationDone"
                  checked={checkList?.isInstallationDone || false}
                  readOnly
                />
                <label className="form-check-label" htmlFor="isInstallationDone">
                  Installation Completed
                </label>
              </div>

              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isArebProcessDone"
                  checked={checkList?.isArebProcessDone || false}
                  readOnly
                />
                <label className="form-check-label" htmlFor="isArebProcessDone">
                  AREB Process Completed
                </label>
              </div>

              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isManualReceived"
                  checked={checkList?.isManualReceived || false}
                  readOnly
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
                  id="isEquipmentDemo"
                  checked={checkList?.isEquipmentDemo || false}
                  readOnly
                />
                <label className="form-check-label" htmlFor="isEquipmentDemo">
                  Equipment Demo Completed
                </label>
              </div>

              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="userTraining"
                  checked={checkList?.userTraining || false}
                  readOnly
                />
                <label className="form-check-label" htmlFor="userTraining">
                  User Training Completed
                </label>
              </div>

              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="serviceContact"
                  checked={checkList?.serviceContact || false}
                  readOnly
                />
                <label className="form-check-label" htmlFor="serviceContact">
                  Service Contact Provided
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documentation Section */}
      <div className="mb-3">
        <h5 className="mb-3 border-bottom pb-2 text-primary">Documentation</h5>
        <div className="row">
          {companyInstallationOneList?.customerSignature ? (
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Customer Signature</label>
              <div>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() =>
                    openImageModal(
                      companyInstallationOneList.customerSignature,
                      "Customer Signature",
                      "Customer Signature"
                    )
                  }
                >
                  View Signature
                </button>
              </div>
            </div>
          ) : (
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Customer Signature</label>
              <p className="text-muted">No signature uploaded</p>
            </div>
          )}

          {companyInstallationOneList?.proofDeliveryImage ? (
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Proof of Delivery</label>
              <div>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() =>
                    openImageModal(
                      companyInstallationOneList.proofDeliveryImage,
                      "Proof of Delivery",
                      "Proof of Delivery"
                    )
                  }
                >
                  View Image
                </button>
              </div>
            </div>
          ) : (
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Proof of Delivery</label>
              <p className="text-muted">No proof of delivery uploaded</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InstallSection;
