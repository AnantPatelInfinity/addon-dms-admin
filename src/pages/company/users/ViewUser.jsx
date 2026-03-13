import React, { useEffect, useState } from "react";
import BreadCrumbs from "../../../components/BreadCrumb/BreadCrumbs";
import COMPANY_URLS from "../../../config/routesFile/company.routes";
import { useLocation, useNavigate } from "react-router";
import ImageModal from "../../../components/ImageModal/ImageModal";
import { useDispatch, useSelector } from "react-redux";
import { EditComUser } from "../../../middleware/companyUser/companyUserList/comUser";
import Swal from "sweetalert2";
import { getCompanyProfile } from "../../../middleware/companyUser/comProfile/comProfile";

const ViewUser = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = state;
  const dispatch = useDispatch();

  const [modalState, setModalState] = useState({
    isOpen: false,
    imageUrl: "",
    altText: "",
    title: "",
  });

  const [currentStatus, setCurrentStatus] = useState(user?.status);
  
  const {
    comProfile,

  } = useSelector((state) => state.comProfile);

  useEffect(() => {
    dispatch(getCompanyProfile());
  }, [dispatch]);


  const getUserField = (field) => user?.[field] || "N/A";
  const getCompanyField = (field) => comProfile?.[field] || "N/A";


  const getImageUrl = (...keys) => {
    const url = getCompanyField(...keys);
    return typeof url === "string" && url.length > 0 ? url : undefined;
  };

  const openImageModal = (imageUrl, altText, title = "Image Preview") => {
    setModalState({ isOpen: true, imageUrl, altText, title });
  };
 
  const closeImageModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    if (!user) {
      navigate(COMPANY_URLS.USERS);
    }
  }, [user, navigate]);

  const handleStatusUpdate = async (status) => {
    const actionLabel =
      status === 1 ? "Pending" : status === 2 ? "Approve" : "Reject";
    const confirmButtonColor =
      status === 2 ? "#28a745" : status === 3 ? "#dc3545" : "#ffc107";

    const confirmResult = await Swal.fire({
      title: `${actionLabel} this user?`,
      text: `Are you sure you want to set ${
        user?.name
      } to ${actionLabel.toLowerCase()}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor,
      cancelButtonColor: "#6c757d",
      confirmButtonText: `Yes, ${actionLabel}`,
    });

    if (confirmResult.isConfirmed) {
      try {
        const response = await dispatch(EditComUser(user._id, status));
        if (response.success) {
          Swal.fire(
            "Updated!",
            `${user?.name} status updated to ${actionLabel}.`,
            "success"
          );
          setCurrentStatus(status);
        } else {
          Swal.fire(
            "Error!",
            response.message || "Something went wrong.",
            "error"
          );
        }
        setCurrentStatus(status);
        Swal.fire(
          "Updated!",
          `${user?.name} status updated to ${actionLabel}.`,
          "success"
        );
      } catch (error) {
        Swal.fire(
          "Error!",
          "Something went wrong while updating status.",
          "error"
        );
      }
    }
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <BreadCrumbs
          crumbs={[
            { label: "User List", to: COMPANY_URLS.USERS },
            { label: "View User Details" },
          ]}
        />

        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-12">
                <h4 className="page-title">View User Details</h4>
              </div>
              <div className="col-lg-6 col-md-6 col-12 text-end">
                {currentStatus === 1 ? (
                  <span className="badge badge-pill badge-status bg-warning">
                    Pending
                  </span>
                ) : currentStatus === 2 ? (
                  <span className="badge badge-pill badge-status bg-success">
                    Approved
                  </span>
                ) : currentStatus === 3 ? (
                  <span className="badge badge-pill badge-status bg-danger">
                    Rejected
                  </span>
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
                <div className="text-muted">{getUserField("name")}</div>
              </div>

              <div className="col-12 col-md-6">
                <div className="mb-2">
                  <strong>Email</strong>
                </div>
                <div className="text-muted">{getUserField("email")}</div>
              </div>

              <div className="col-12 col-md-6">
                <div className="mb-2">
                  <strong>Phone</strong>
                </div>
                <div className="text-muted">{getUserField("phone")}</div>
              </div>

              <div className="col-12 col-md-6">
                <div className="mb-2">
                  <strong>Role</strong>
                </div>
                <div className="text-muted">{getUserField("role")}</div>
              </div>
             
              <div className="col-12 col-md-6">
                <div className="mb-2">
                  <strong>Address</strong>
                </div>
                <div className="text-muted">{getCompanyField("address")}</div>
              </div>

              <div className="col-12 col-md-6">
                <div className="mb-2">
                  <strong>Address Two</strong>
                </div>
                <div className="text-muted">{getCompanyField("addressTwo")}</div>
              </div>

              <div className="col-12 col-md-6">
                <div className="mb-2">
                  <strong>Address Three</strong>
                </div>
                <div className="text-muted">{getCompanyField("addressThree")}</div>
              </div>

              <div className="col-12 col-md-6">
                <div className="mb-2">
                  <strong>State</strong>
                </div>
                <div className="text-muted">{getCompanyField("state")}</div>
              </div>

              <div className="col-12 col-md-6">
                <div className="mb-2">
                  <strong>City</strong>
                </div>
                <div className="text-muted">{getCompanyField("city")}</div>
              </div>

              <div className="col-12 col-md-6">
                <div className="mb-2">
                  <strong>Pincode</strong>
                </div>
                <div className="text-muted">{getCompanyField("pincode")}</div>
              </div>


              <div className="col-12 col-md-6">
                <div className="mb-2">
                  <strong>Image</strong>
                </div>
                {getImageUrl("image") ? (
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() =>
                      openImageModal(
                        getImageUrl("image"),
                        "User Image",
                        "User Image"
                      )
                    }
                  >
                    View Image
                  </button>
                ) : (
                  <span className="text-muted">N/A</span>
                )}
              </div>
            </div>
          </div>

          <div className="card-footer">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                {currentStatus === 1 && (
                  <>
                    <button
                      className="btn btn-success"
                      onClick={() => handleStatusUpdate(2)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleStatusUpdate(3)}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate(-1)}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to User List
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

export default ViewUser;
