import React, { useEffect, useState } from "react";
import BreadCrumbs from "../../../components/BreadCrumb/BreadCrumbs";
import ADMIN_URLS from "../../../config/routesFile/admin.routes";
import { useLocation, useNavigate } from "react-router";
import ImageModal from "../../../components/ImageModal/ImageModal";
import { useApi } from "../../../context/ApiContext";
import { AERB_STATUS_OPTIONS } from "../../../config/DataFile";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { ShieldCheck } from "lucide-react";
// import Swal from "sweetalert2";

const ViewCustomer = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const customer = state;
  const { post, put } = useApi();
  const [modalState, setModalState] = useState({
    isOpen: false,
    imageUrl: '',
    altText: '',
    title: ''
  });

  const [aerbData, setAerbData] = useState({});

  // const [currentStatus, setCurrentStatus] = useState(customer?.status);

  const getValue = (...keys) => {
    for (const key of keys) {
      const value = customer?.[key];
      if (value !== undefined && value !== null && value !== "") return value;
    }
    return undefined;
  };

  const getImageUrl = (...keys) => {
    const url = getValue(...keys);
    return typeof url === "string" && url.length > 0 ? url : undefined;
  };

  const openImageModal = (imageUrl, altText, title = 'Image Preview') => {
    setModalState({
      isOpen: true,
      imageUrl,
      altText,
      title
    });
  };

  const closeImageModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const getFullName = () => {
    const parts = [];
    const title = getValue("title");
    const firstName = getValue("name", "firstName");
    const lastName = getValue("lastName", "surname");
    if (title) parts.push(String(title).trim());
    if (firstName) parts.push(String(firstName).trim());
    if (lastName) parts.push(String(lastName).trim());
    return parts.join(" ").trim();
  };

  useEffect(() => {
    if (!customer) {
      navigate(ADMIN_URLS.CUSTOMER_LIST);
    }
  }, [customer, navigate]);

  useEffect(() => {
    if (customer?._id) {
      fetchAerbApplication()
    }
  }, [customer?._id])

  const fetchAerbApplication = async () => {
    if (!customer?._id) return;
    try {
      const response = await post(`/admin/get-aerb-application-details`, {
        customerId: customer._id
      });

      if (response?.success) {
        setAerbData(response?.data)
      }

    } catch (err) {
      console.log(err)
    }
  }

  const handleVerifyAerb = async () => {
    if (!aerbData?._id) return;

    if (aerbData?.status === "PENDING") {
      const { isConfirmed } = await Swal.fire({
        title: "Mark as Under Process?",
        text: "This application will be moved to Under Process.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Under Process",
        confirmButtonColor: "#10d2fc",
        cancelButtonText: "Cancel",
      });

      if (isConfirmed) {
        try {
          const response = await put(
            `/admin/update-process-aerb/${aerbData._id}`,
            {
              status: "UNDER_PROCESS",
            }
          );

          if (response?.success) {
            Swal.fire(
              "Updated!",
              "Application moved to Under Process.",
              "success"
            );
            fetchAerbApplication();
          }
        } catch (error) {
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }

      return;
    } else {
      const { value: action } = await Swal.fire({
        title: "Verify AERB Application",
        text: "Choose an action",
        icon: "question",
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: "Approve",
        denyButtonText: "Reject",
        confirmButtonColor: "#28a745",
        denyButtonColor: "#dc3545",
        cancelButtonText: "Cancel",
      });

      if (action === true) {
        const { value: approveData } = await Swal.fire({
          title: "Approve AERB Application",
          html: `
        <input type="text" id="swal-username" class="swal2-input" placeholder="Username">
        <input type="password" id="swal-password" class="swal2-input" placeholder="Password">
      `,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: "Submit",
          confirmButtonColor: "#28a745",
          preConfirm: () => {
            const username = document.getElementById("swal-username").value;
            const password = document.getElementById("swal-password").value;

            if (!username || !password) {
              Swal.showValidationMessage("Both Username and Password are required");
              return false;
            }

            return { username, password };
          },
        });

        if (approveData) {
          try {
            const response = await put(
              `/admin/approve-aerb-application/${aerbData._id}`,
              {
                username: approveData.username,
                password: approveData.password,
                status: "COMPLETED",
              }
            );

            if (response?.success) {
              Swal.fire(
                "Approved!",
                "AERB application approved successfully.",
                "success"
              );
              fetchAerbApplication();
            }
          } catch (error) {
            Swal.fire("Error!", "Something went wrong.", "error");
          }
        }
      }

      else if (action === false) {
        const { value: rejectReason } = await Swal.fire({
          title: "Reject AERB Application",
          input: "textarea",
          inputLabel: "Rejection Reason",
          inputPlaceholder: "Enter reason for rejection...",
          showCancelButton: true,
          confirmButtonText: "Reject",
          confirmButtonColor: "#dc3545",
          inputValidator: (value) => {
            if (!value) {
              return "Rejection reason is required";
            }
          },
        });

        if (rejectReason) {
          try {
            const response = await put(
              `/admin/approve-aerb-application/${aerbData._id}`,
              {
                rejectedReason: rejectReason,
                status: "REJECTED",
              }
            );

            if (response?.success) {
              Swal.fire(
                "Rejected!",
                "AERB application rejected successfully.",
                "success"
              );
              fetchAerbApplication();
            }
          } catch (error) {
            Swal.fire("Error!", "Something went wrong.", "error");
          }
        }
      }
    }


  };

  // const handleStatusUpdate = async (status) => {
  //   const actionLabel = status === 2 ? 'Approve' : status === 3 ? 'Reject' : 'Pending';
  //   const confirmButtonColor = status === 2 ? '#28a745' : status === 3 ? '#dc3545' : '#ffc107';
  //   const confirmResult = await Swal.fire({
  //     title: `${actionLabel} this customer?`,
  //     text: `Are you sure you want to set ${getFullName() || customer?.name || 'this customer'} to ${actionLabel.toLowerCase()}?`,
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: confirmButtonColor,
  //     cancelButtonColor: '#6c757d',
  //     confirmButtonText: `Yes, ${actionLabel}`,
  //   });
  //
  //   if (confirmResult.isConfirmed) {
  //     try {
  //       const response = await post(`/admin/update-customer-status/${customer?._id}?status=${status}`);
  //       if (response.success) {
  //         Swal.fire('Updated!', `${getFullName() || customer?.name || 'Customer'} status updated to ${actionLabel}.`, 'success');
  //         setCurrentStatus(status);
  //       } else {
  //         Swal.fire('Error!', response.message || 'Something went wrong.', 'error');
  //       }
  //     } catch (error) {
  //       Swal.fire('Error!', error?.response?.data?.message || 'Something went wrong while updating status.', 'error');
  //     }
  //   }
  // };

  return (
    <div className="row">
      <div className="col-md-12">
        <BreadCrumbs
          crumbs={[
            { label: "customer List", to: ADMIN_URLS.CUSTOMER_LIST },
            { label: `View customer Details` },
          ]}
        />

        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-12">
                <h4 className="page-title">View customer Details</h4>
              </div>
              <div className="col-lg-6 col-md-6 col-12 text-end">
                {customer?.status === 1 ? (
                  <span className="badge badge-pill badge-status bg-warning">Pending</span>
                ) : customer?.status === 2 ? (
                  <span className="badge badge-pill badge-status bg-success">Approved</span>
                ) : customer?.status === 3 ? (
                  <span className="badge badge-pill badge-status bg-danger">Rejected</span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="card-body py-3 px-4 mb-5">
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <div className="mb-2">
                  <strong>Name</strong>
                </div>
                <div className="text-muted">{getFullName() || "N/A"}</div>
              </div>
              <div className="col-12 col-md-6">
                <div className="mb-2">
                  <strong>Email</strong>
                </div>
                <div className="text-muted">{getValue("email") || "N/A"}</div>
              </div>
              <div className="col-12 col-md-6">
                <div className="mb-2">
                  <strong>Clinic Name</strong>
                </div>
                <div className="text-muted">
                  {getValue("clinicName") || "N/A"}
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="mb-2">
                  <strong>Mobile No.</strong>
                </div>
                <div className="text-muted">
                  {getValue("phone", "mobile") || "N/A"}
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="mb-2">
                  <strong>Pincode</strong>
                </div>
                <div className="text-muted">
                  {getValue("pincode", "pinCode") || "N/A"}
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="mb-2">
                  <strong>Address 1</strong>
                </div>
                <div className="text-muted">
                  {getValue("address", "address") || "N/A"}
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="mb-2">
                  <strong>Address 2</strong>
                </div>
                <div className="text-muted">
                  {getValue("addressTwo") || "N/A"}
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="mb-2">
                  <strong>Landmark</strong>
                </div>
                <div className="text-muted">
                  {getValue("addressThree") || "N/A"}
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="mb-2">
                  <strong>City</strong>
                </div>
                <div className="text-muted">{getValue("city") || "N/A"}</div>
              </div>
              <div className="col-12 col-md-6">
                <div className="mb-2">
                  <strong>State</strong>
                </div>
                <div className="text-muted">{getValue("state") || "N/A"}</div>
              </div>
              <div className="col-12 col-md-6">
                <div className="mb-2">
                  <strong>GST No.</strong>
                </div>
                <div className="text-muted">{getValue("gstNo") || "N/A"}</div>
              </div>
              <div className="col-12 col-md-6">
                <div className="mb-2">
                  <strong>PAN Card No.</strong>
                </div>
                <div className="text-muted">{getValue("panNo") || "N/A"}</div>
              </div>
              <div className="col-12 col-md-6">
                <div className="mb-2">
                  <strong>Drug License No. (Form 20B)</strong>
                </div>
                <div className="text-muted">
                  {getValue("drugLicenseOne") || "N/A"}
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="mb-2">
                  <strong>Drug License No. (Form 21B)</strong>
                </div>
                <div className="text-muted">
                  {getValue("drugLicenseTwo") || "N/A"}
                </div>
              </div>

              {/* Images */}
              <div className="col-12"></div>
              <div className="col-12">
                <div className="row g-4">
                  {getImageUrl("image") ? (
                    <div className="col-12 col-md-6">
                      <div className="mb-2">
                        <strong>Logo</strong>
                      </div>
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openImageModal(
                            getImageUrl("image"),
                            'Customer Logo',
                            'Customer Logo'
                          )}
                        >
                          View Logo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="col-12 col-md-6">
                      <div className="mb-2">
                        <strong>Logo</strong>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="text-muted">N/A</span>
                      </div>
                    </div>
                  )}

                  {getImageUrl("signatureStamp", "signature", "stamp") ? (
                    <div className="col-12 col-md-6">
                      <div className="mb-2">
                        <strong>Signature & Stamp</strong>
                      </div>
                      <div className="d-flex align-items-center gap-3 flex-wrap">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openImageModal(
                            getImageUrl("signatureStamp", "signature", "stamp"),
                            'Signature & Stamp',
                            'Signature & Stamp'
                          )}
                        >
                          View Signature
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="col-12 col-md-6">
                      <div className="mb-2">
                        <strong>Signature & Stamp</strong>
                      </div>
                      <div className="d-flex align-items-center gap-3 flex-wrap">
                        <span className="text-muted">N/A</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status duplicate on small screens */}
              <div className="col-12 d-md-none">
                <div className="mb-2">
                  <strong>Status</strong>
                </div>
                {customer?.status === 1 ? (
                  <span className="badge badge-pill badge-status bg-warning">Pending</span>
                ) : customer?.status === 2 ? (
                  <span className="badge badge-pill badge-status bg-success">Approved</span>
                ) : customer?.status === 3 ? (
                  <span className="badge badge-pill badge-status bg-danger">Rejected</span>
                ) : null}
              </div>

              {/* AERB Details Section */}
              {aerbData && Object.keys(aerbData).length > 0 && (
                <div className="col-12">
                  <hr className="my-4" />
                  <h4 className="mb-4">AERB Registration Details</h4>
                  <div className="row g-4">
                    <div className="col-12 ">
                      <div className="mb-2">
                        <strong>Remarks</strong>
                      </div>
                      <div className="text-muted">{aerbData.remarks || "N/A"}</div>
                    </div>
                    <div className="col-12 ">
                      <div className="mb-2 d-flex align-items-center">
                        <strong>AERB Status:</strong>
                        <span className={`ms-2 ${AERB_STATUS_OPTIONS.find((option) => option.value === aerbData.status)?.bg}`}>
                          {AERB_STATUS_OPTIONS.find((option) => option.value === aerbData.status)?.label}
                        </span>
                      </div>
                      {aerbData.aerbUserName && (
                        <div className="mt-3">
                          <strong>  Username: <span className="ms-2">{aerbData.aerbUserName || "N/A"}</span></strong>
                        </div>
                      )}
                    </div>

                    {/* Documents */}
                    <div className="col-12">
                      <div className="row g-4">
                        {aerbData.documents?.panCard && (
                          <div className="col-12 col-md-4">
                            <div className="mb-2">
                              <strong>Pan Card</strong>
                            </div>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => openImageModal(aerbData.documents.panCard, 'Pan Card', 'Pan Card')}
                            >
                              View Pan Card
                            </button>
                          </div>
                        )}
                        {aerbData.documents?.clinicDeclaration && (
                          <div className="col-12 col-md-4">
                            <div className="mb-2">
                              <strong>Clinic Declaration</strong>
                            </div>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => openImageModal(aerbData.documents.clinicDeclaration, 'Clinic Declaration', 'Clinic Declaration')}
                            >
                              View Declaration
                            </button>
                          </div>
                        )}
                        {aerbData.documents?.undertaking && (
                          <div className="col-12 col-md-4">
                            <div className="mb-2">
                              <strong>Undertaking</strong>
                            </div>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => openImageModal(aerbData.documents.undertaking, 'Undertaking', 'Undertaking')}
                            >
                              View Undertaking
                            </button>
                          </div>
                        )}
                        {aerbData.documents?.selfDeclaration && (
                          <div className="col-12 col-md-4">
                            <div className="mb-2">
                              <strong>Self Declaration</strong>
                            </div>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => openImageModal(aerbData.documents.selfDeclaration, 'Self Declaration', 'Self Declaration')}
                            >
                              View Self Declaration
                            </button>
                          </div>
                        )}

                        {aerbData.documents?.aadharCards?.length > 0 && (
                          <div className="col-12">
                            <div className="mb-2">
                              <strong>Aadhar Cards</strong>
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                              {aerbData.documents.aadharCards.map((doc, index) => (
                                <button
                                  key={index}
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => openImageModal(doc.file, `Aadhar Card ${index + 1}`, `Aadhar Card ${index + 1}`)}
                                >
                                  View Aadhar {index + 1}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>


          <div className="card-footer">
            <div className={`d-flex align-items-center ${(aerbData?.status === "COMPLETED" || !aerbData?.status) ? "justify-content-end" : "justify-content-between"}`}>
              {/* <div className="d-flex align-items-center gap-2">
                {currentStatus !== 1 && (
                  <button className="btn btn-warning" onClick={() => handleStatusUpdate(1)}>
                    <i className="ti ti-clock me-2"></i> Pending
                  </button>
                )}
                {currentStatus !== 2 && (
                  <button className="btn btn-success" onClick={() => handleStatusUpdate(2)}>
                    <i className="fe fe-check-circle me-2"></i> Approve
                  </button>
                )}
                {currentStatus !== 3 && (
                  <button className="btn btn-danger" onClick={() => handleStatusUpdate(3)}>
                    <i className="fa-solid fa-xmark me-2"></i> Reject
                  </button>
                )}
              </div> */}
              {aerbData?._id && (aerbData?.status === "PENDING" || aerbData?.status === "UNDER_PROCESS") && (
                <Button
                  variant="outline-primary"
                  className='d-flex gap-2 align-items-center'
                  onClick={() => handleVerifyAerb(aerbData?._id)}
                >
                  <ShieldCheck size={16} />
                  Verify AERB Application
                </Button>
              )}
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate(-1)}
              >
                <i className="fas fa-arrow-left me-2"></i> Back to customer List
              </button>
            </div>
          </div>

        </div>
      </div>

      <ImageModal
        isOpen={modalState.isOpen}
        imageUrl={modalState.imageUrl}
        altText={modalState.altText}
        title={modalState.title}
        onClose={closeImageModal}
      />
    </div>
  );
};

export default ViewCustomer;
