import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCompanyProfile,
  getCompanyUserProfile,
  resetUpdateProfile,
  updateCompanyProfile,
} from "../../../middleware/companyUser/comProfile/comProfile";
import axios from "axios";
import { DX_URL } from "../../../config/baseUrl";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
  Spinner,
  Alert,
  Tab,
  Tabs,
} from "react-bootstrap";
import {
  Edit,
  Upload,
  Mail,
  User,
  Phone,
  Home,
  FileText,
  MapPin,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { EditComUser, resetComEditUser } from "../../../middleware/companyUser/companyUserList/comUser";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const US_ID = localStorage.getItem("US_ID");

  const {
    comProfile,
    comProfileError,
    comProfileLoading,
    comProfileUpdateLoading,
    comProfileUpdateMessage,
    comProfileUpdateError,
  } = useSelector((state) => state.comProfile);

  const {
    comOneUser,
    comEditUserMessage,
    comEditUserError,
  } = useSelector((state) => state.comUser);

  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("basic");
  const [disable, setDisable] = useState(false);

  // Fetch profiles
  useEffect(() => {
    if (US_ID) dispatch(getCompanyUserProfile(US_ID));
    else dispatch(getCompanyProfile());
  }, [US_ID, dispatch]);

  // Handle company/user update messages
  useEffect(() => {
    if (comProfileUpdateMessage) {
      toast.success(comProfileUpdateMessage);
      dispatch(resetUpdateProfile());
      dispatch(getCompanyProfile());
    }
    if (comProfileUpdateError) {
      dispatch(resetUpdateProfile());
      toast.error(comProfileUpdateError);
    }
  }, [comProfileUpdateMessage, comProfileUpdateError, dispatch]);

  useEffect(() => {
    if (comEditUserMessage) {
      toast.success(comEditUserMessage);
      dispatch(resetComEditUser());
      dispatch(getCompanyUserProfile(US_ID));
    }
    if (comEditUserError) {
      dispatch(resetComEditUser());
      toast.error(comEditUserError);
    }
  }, [comEditUserMessage, comEditUserError, dispatch, US_ID]);

  // Initialize form data
  useEffect(() => {
    if (US_ID && comOneUser) {
      setFormData({
        name: comOneUser.name || "",
        email: comOneUser.email || "",
        phone: comOneUser.phone || "",
        role: comOneUser.role || "",
        address: comProfile?.address || "",
        addressTwo: comProfile?.addressTwo || "",
        addressThree: comProfile?.addressThree || "",
        city: comProfile?.city || "",
        state: comProfile?.state || "",
        pincode: comProfile?.pincode || "",
        image: comProfile?.image || "",
        gstNo: comProfile?.gstNo || "",
        panNo: comProfile?.panNo || "",
        drugLicenseOne: comProfile?.drugLicenseOne || "",
        drugLicenseTwo: comProfile?.drugLicenseTwo || "",
        signature: comProfile?.signature || "",
        stamp: comProfile?.stamp || "",
      });
    } else if (!US_ID && comProfile) {
      setFormData({ ...comProfile });
      localStorage.setItem("DX_CO_IMG", comProfile.image);
    }
  }, [US_ID, comProfile, comOneUser]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = async (e, field) => {
    if (US_ID) return; // disable uploads for normal user
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, and PNG files are allowed.");
      return;
    }

    const uploadForm = new FormData();
    uploadForm.append("image", file);

    try {
      setDisable(true);
      const response = await axios.post(`${DX_URL}/upload-image`, uploadForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { data, message, success } = response.data;
      if (success) {
        setFormData((prev) => ({ ...prev, [field]: data.image }));
        toast.success(`${field} uploaded successfully`);
      } else {
        toast.error(message || `Upload failed for ${field}`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || `Error uploading ${field}`);
    } finally {
      setDisable(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = US_ID
      ? {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
        }
      : formData;
    if (US_ID) dispatch(EditComUser(US_ID, payload));
    else dispatch(updateCompanyProfile(payload));
  };

  if (comProfileLoading)
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );

  if (comProfileError)
    return (
      <Container className="mt-4">
        <Alert variant="danger">Error loading profile</Alert>
      </Container>
    );

  const renderField = (icon, label, name, type = "text", forceDisable = false) => (
    <Form.Group controlId={`form${name}`} className="mb-3">
      <Form.Label className="d-flex align-items-center gap-1">{icon} {label}</Form.Label>
      <Form.Control
        type={type}
        name={name}
        value={formData[name] || ""}
        onChange={handleChange}
        disabled={US_ID ? forceDisable : false} // disable if user and forceDisable
      />
    </Form.Group>
  );

  const renderFileUpload = (label, field) => (
    <Form.Group controlId={`form${field}`} className="mb-3">
      <Form.Label>{label}</Form.Label>
      <div className="d-flex align-items-center gap-3">
        {formData[field] ? (
          <Image src={formData[field]} thumbnail style={{ width: "100px", height: "50px", objectFit: "contain" }} />
        ) : (
          <div className="border p-2 text-muted">No {label.toLowerCase()} uploaded</div>
        )}
        {!US_ID && (
          <Button variant="outline-secondary" size="sm" as="label" className="d-flex align-items-center gap-1">
            <Upload size={16} /> Upload
            <Form.Control type="file" accept="image/*" onChange={(e) => handleFileChange(e, field)} hidden />
          </Button>
        )}
      </div>
    </Form.Group>
  );

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold d-flex align-items-center gap-2">
            <User size={28} /> {US_ID ? "User" : "Company"} Profile
          </h2>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body>
          <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
            <Tab eventKey="basic" title={<><User size={16} /> Basic</>}>
              <Row className="g-3 mt-3">
                <Col md={4} className="text-center">
                  <Image
                    src={formData.image || "/assets/img/default.jpg"}
                    roundedCircle
                    thumbnail
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  />
                  {!US_ID && (
                    <Button variant="outline-primary" size="sm" as="label" className="d-flex align-items-center gap-1 mx-auto mt-3">
                      <Upload size={16} /> Upload Logo
                      <Form.Control type="file" accept="image/*" onChange={(e) => handleFileChange(e, "image")} hidden />
                    </Button>
                  )}
                </Col>
                <Col md={8}>
                  <Row className="g-3">
                    <Col md={6}>{renderField(<User size={16} />, "Full Name", "name")}</Col>
                    <Col md={6}>{renderField(<Mail size={16} />, "Email", "email", "email", true)}</Col>
                    <Col md={6}>{renderField(<Phone size={16} />, "Phone", "phone")}</Col>
                    {US_ID && <Col md={6}>{renderField(<User size={16} />, "Role", "role", "text", true)}</Col>}
                    {!US_ID && <Col md={6}>{renderField(<FileText size={16} />, "GST Number", "gstNo")}</Col>}
                    {!US_ID && <Col md={6}>{renderField(<FileText size={16} />, "PAN Number", "panNo")}</Col>}
                  </Row>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="address" title={<><MapPin size={16} /> Address</>}>
              <Row className="g-3 mt-3">
                <Col md={12}>{renderField(<Home size={16} />, "Address Line 1", "address", "text", true)}</Col>
                <Col md={12}>{renderField(null, "Address Line 2", "addressTwo", "text", true)}</Col>
                <Col md={12}>{renderField(null, "Address Line 3", "addressThree", "text", true)}</Col>
                <Col md={4}>{renderField(null, "City", "city", "text", true)}</Col>
                <Col md={4}>{renderField(null, "State", "state", "text", true)}</Col>
                <Col md={4}>{renderField(null, "Pincode", "pincode", "text", true)}</Col>
              </Row>
            </Tab>

            {!US_ID && (
              <Tab eventKey="documents" title={<><FileText size={16} /> Documents</>}>
                <Row className="g-3 mt-3">
                  <Col md={6}>{renderField(null, "Drug License 1", "drugLicenseOne")}</Col>
                  <Col md={6}>{renderField(null, "Drug License 2", "drugLicenseTwo")}</Col>
                  <Col md={6}>{renderFileUpload("Signature & Stamp", "signature")}</Col>
                  <Col md={6}>{renderFileUpload("Stamp", "stamp")}</Col>
                </Row>
              </Tab>
            )}
          </Tabs>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="outline-secondary" onClick={() => navigate(-1)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              className="d-flex align-items-center gap-1"
              disabled={disable || comProfileUpdateLoading}
            >
              {comProfileUpdateLoading ? "Updating..." : <><Edit size={16} /> Update Profile</>}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
