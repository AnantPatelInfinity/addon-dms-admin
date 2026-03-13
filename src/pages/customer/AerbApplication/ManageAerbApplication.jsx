import { useEffect, useState } from 'react'
import BreadCrumbs from '../../../components/BreadCrumb/BreadCrumbs'
import CUSTOMER_URLS from '../../../config/routesFile/customer.routes'
import MediaSection from '../../../components/Admin/Service/MediaSection'
import FileUpload from '../../../components/Admin/FileUpload/FileUpload'
import { useDispatch, useSelector } from 'react-redux'
import { addAerbApplicationData, deleteAerbApplicationData, editAerbApplicationData, getOneAerbApplicationData } from '../../../middleware/customerUser/aerbApplication/aerbApplication'
import { useNavigate } from 'react-router'
import { getCustomerStorage } from '../../../components/LocalStorage/CustomerStorage'
import { Button } from 'react-bootstrap'
import Swal from 'sweetalert2'

const ManageAerbApplication = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(getOneAerbApplicationData({ customerId: getCustomerStorage().CU_ID, }))
    }, [dispatch])

    const { aerbApplication: existingApplication } = useSelector((state) => state.customerAerbApplication);
    const isEditMode = !!existingApplication?._id;

    useEffect(() => {
        if (existingApplication?._id) {
            setAerbApplication({
                remarks: existingApplication.remarks || "",
                status: existingApplication.status || "PENDING",
                aadharCards: existingApplication.documents?.aadharCards.map((item) => ({ url: item.file })) || [],
                panCard: existingApplication.documents?.panCard || "",
                clinicDeclaration: existingApplication.documents?.clinicDeclaration || "",
                undertaking: existingApplication.documents?.undertaking || "",
                selfDeclaration: existingApplication.documents?.selfDeclaration || "",
            });
        }
    }, [existingApplication]);

    const [aerbApplication, setAerbApplication] = useState({
        remarks: "",
        status: "PENDING",
        aadharCards: [],
        panCard: "",
        clinicDeclaration: "",
        undertaking: "",
        selfDeclaration: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAerbApplication((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }));
    };

    const handleImageUpload = (key, value) => {
        setAerbApplication((prev) => ({
            ...prev,
            [key]: value,
        }));
        setErrors((prev) => ({
            ...prev,
            [key]: ""
        }));
    };

    const validate = () => {
        let newErrors = {};
        if (!aerbApplication.remarks?.trim()) {
            newErrors.remarks = "Remarks is required";
        }
        if (!aerbApplication.panCard) {
            newErrors.panCard = "Pan Card is required";
        }
        if (!aerbApplication.clinicDeclaration) {
            newErrors.clinicDeclaration = "Clinic Declaration is required";
        }
        if (!aerbApplication.undertaking) {
            newErrors.undertaking = "Undertaking is required";
        }
        if (!aerbApplication.selfDeclaration) {
            newErrors.selfDeclaration = "Self Declaration is required";
        }
        if (!aerbApplication.aadharCards || aerbApplication.aadharCards.length === 0) {
            newErrors.aadharCards = "Aadhar Card is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure? AERB Registration",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteAerbApplicationData(id));
                navigate(CUSTOMER_URLS.DASHBOARD);
            }
        });
    }

    const handleSubmit = () => {
        if (!validate()) return;

        const payload = {
            customerId: getCustomerStorage().CU_ID,
            remarks: aerbApplication.remarks,
            status: existingApplication?.status === "REJECTED" ? "PENDING" : aerbApplication.status,
            documents: {
                aadharCards: aerbApplication.aadharCards.map((item) => ({ file: item.url })),
                panCard: aerbApplication.panCard,
                clinicDeclaration: aerbApplication.clinicDeclaration,
                undertaking: aerbApplication.undertaking,
                selfDeclaration: aerbApplication.selfDeclaration
            }
        }

        if (isEditMode) {
            dispatch(editAerbApplicationData(payload, existingApplication._id));
        } else {
            dispatch(addAerbApplicationData(payload));
        }
        navigate(CUSTOMER_URLS.DASHBOARD)
    }

    const handleDownlodClinicDeclaration = () => {
        window.open("/public/assets/word/clinic_declaration_sample.doc", "_blank")
    }

    const handleDownloadUndertaking = () => {
        window.open("/public/assets/word/undertaking_sample.doc", "_blank")
    }

    const handleDownloadSelfDeclaration = () => {
        window.open("/public/assets/word/self_declaration_sample.docx", "_blank")
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <BreadCrumbs
                    crumbs={[
                        { label: `AERB Registration` },
                    ]}
                />

                <div className="card">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-lg-4 col-md-6 col-12">
                                <h4 className="page-title">
                                    AERB Registration
                                </h4>
                            </div>
                        </div>
                    </div>

                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-12">
                                <div className="form-floating">
                                    <textarea
                                        style={{ height: "100px" }}
                                        className="form-control"
                                        id="remarks"
                                        name="remarks"
                                        value={aerbApplication.remarks}
                                        onChange={handleChange}
                                        placeholder="Remarks"
                                    />
                                    <label htmlFor="remarks">Remarks <span className='text-primary'>*</span></label>
                                </div>
                                {errors.remarks && (
                                    <div className="text-danger mt-1 small">
                                        {errors.remarks}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* {isEditMode && (
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <select
                                            className="form-select"
                                            id="status"
                                            name="status"
                                            value={aerbApplication.status}
                                            onChange={handleChange}
                                            disabled={!isEditMode}
                                        >
                                            <option value="">Select Status</option>
                                            {AERB_STATUS_OPTIONS.map((status) => (
                                                <option key={status.value} value={status.value}>
                                                    {status.label}
                                                </option>
                                            ))}
                                        </select>
                                        <label htmlFor="status">Status</label>
                                    </div>

                                </div>
                            </div>
                        )} */}

                        <div className="row align-items-center mb-4 mt-3">
                            <div className="col-md-4">
                                <FileUpload
                                    label="Pan Card"
                                    name="panCard"
                                    required={true}
                                    value={aerbApplication.panCard}
                                    onChange={handleImageUpload}
                                />
                                {errors.panCard && (
                                    <div className="text-danger small mt-1">
                                        {errors.panCard}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="row align-items-center gap-3 mb-4">
                            <div className="col-md-4">
                                <FileUpload
                                    label="Clinic Declaration"
                                    name="clinicDeclaration"
                                    required={true}
                                    value={aerbApplication.clinicDeclaration}
                                    onChange={handleImageUpload}
                                />
                                {errors.clinicDeclaration && (
                                    <div className="text-danger small mt-1">
                                        {errors.clinicDeclaration}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-6">
                                <div className="border mt-4 rounded-3 h-100 d-flex flex-column justify-content-center bg-light">
                                    <div>
                                        <h6 className="fw-semibold mb-2 text-primary">
                                            📄 Clinic Declaration Format
                                        </h6>
                                        <p className="small text-muted mb-2">
                                            Download the official clinic declaration sample before uploading
                                            your signed copy.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary btn-sm align-self-start"
                                        onClick={handleDownlodClinicDeclaration}
                                    >
                                        Download Sample File
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="row align-items-center gap-3 mb-4">
                            <div className="col-md-4">
                                <FileUpload
                                    label="Undertaking"
                                    name="undertaking"
                                    required={true}
                                    value={aerbApplication.undertaking}
                                    onChange={handleImageUpload}
                                />
                                {errors.undertaking && (
                                    <div className="text-danger small mt-1">
                                        {errors.undertaking}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-6">
                                <div className="border mt-4 rounded-3 h-100 d-flex flex-column justify-content-center bg-light">
                                    <div>
                                        <h6 className="fw-semibold mb-2 text-primary">
                                            📄 Undertaking Sample
                                        </h6>
                                        <p className="small text-muted mb-2">
                                            Please download and fill the undertaking format before uploading.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleDownloadUndertaking}
                                        className="btn btn-outline-primary btn-sm align-self-start"
                                    >
                                        Download Sample File
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="row align-items-center gap-3 mb-4">
                            <div className="col-md-4">
                                <FileUpload
                                    label="Self Declaration"
                                    name="selfDeclaration"
                                    required={true}
                                    value={aerbApplication.selfDeclaration}
                                    onChange={handleImageUpload}
                                />
                                {errors.selfDeclaration && (
                                    <div className="text-danger small mt-1">
                                        {errors.selfDeclaration}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-6">
                                <div className="border mt-4 rounded-3 h-100 d-flex flex-column justify-content-center bg-light">
                                    <div>
                                        <h6 className="fw-semibold mb-2 text-primary">
                                            📄 Self Declaration Sample
                                        </h6>
                                        <p className="small text-muted mb-2">
                                            Download the self-declaration template and upload the relevant copy.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleDownloadSelfDeclaration}
                                        className="btn btn-outline-primary btn-sm align-self-start"
                                    >
                                        Download Sample File
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div>
                                <MediaSection
                                    type="mixed"
                                    title="Aadhar Card"
                                    accept="image/*,.pdf"
                                    icon="fas fa-id-card"
                                    required={true}
                                    mediaFiles={aerbApplication.aadharCards}
                                    onMediaUpdate={(type, files) => handleImageUpload("aadharCards", files)}
                                />
                                {errors.aadharCards && (
                                    <div className="text-danger small">
                                        {errors.aadharCards}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                {isEditMode && (
                                    <Button
                                        variant="outline-primary"
                                        className='px-4 gap-3'
                                        style={{ borderRadius: "8px" }}
                                        onClick={() => handleDelete(existingApplication?._id)}
                                    >
                                        Delete AERB Application
                                    </Button>
                                )}
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-light me-2"
                                    onClick={() => navigate(-1)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSubmit}
                                >
                                    {isEditMode ? "Update" : "Submit"}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    )
}

export default ManageAerbApplication 