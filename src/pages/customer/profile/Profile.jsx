import CUSTOMER_URLS from "../../../config/routesFile/customer.routes";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import axios from "axios";
import { DX_URL } from "../../../config/baseUrl";
import { toast } from "react-toastify";
import { resetUpdateCuProfile } from "../../../middleware/customerUser/customerProfile/profile.js";
import {
  getCuProfile,
  updateCuProfile,
} from "../../../middleware/customerUser/customerProfile/profile.js";

import { useNavigate } from "react-router";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    customerProfileLoading,
    customerProfileError,
    customerProfile,

    customerProfileUpdateError,
    customerProfileUpdateLoading,
    customerProfileUpdateMessage,
  } = useSelector((state) => state?.customerProfile);

  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("basic");
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    dispatch(getCuProfile());
  }, []);

  useEffect(() => {
    if (customerProfileUpdateError) {
      toast.error(customerProfileUpdateError);
      dispatch(resetUpdateCuProfile());
    }

    if (customerProfileUpdateMessage) {
      toast.success(customerProfileUpdateMessage);
      dispatch(getCuProfile());
      dispatch(resetUpdateCuProfile());
    }
    if (customerProfileUpdateError || customerProfileUpdateMessage) {
      setDisable(false);
    }
  }, [customerProfileUpdateError, customerProfileUpdateMessage]);

  useEffect(() => {
    if (customerProfile) {
      setFormData({
        title: customerProfile?.title,
        name: customerProfile?.name,
        lastName: customerProfile?.lastName,
        fullName: `${customerProfile?.title || ""} 
        ${customerProfile?.name || ""} ${customerProfile?.lastName || ""}`.replace(/\s+/g, " ").trim(),
        email: customerProfile?.email || "",
        address: customerProfile?.address || "",
        addressTwo: customerProfile?.addressTwo || "",
        addressThree: customerProfile.addressThree || "",
        city: customerProfile?.city || "",
        state: customerProfile?.state || "",
        pincode: customerProfile?.pincode || "",
        phone: customerProfile?.phone || "",
        drugLicenseOne: customerProfile?.drugLicenseOne || "",
        drugLicenseTwo: customerProfile?.drugLicenseTwo || "",
        gstNo: customerProfile?.gstNo || "",
        panNo: customerProfile?.panNo || "",
        signature: customerProfile?.signature || "",
        image: customerProfile?.image || "",
        stamp: customerProfile?.stamp || "",
      });
      localStorage.setItem("DX_CU_IMG", customerProfile.image);
    }
  }, [customerProfile]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = async (e, field) => {
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
        setFormData((prev) => ({
          ...prev,
          [field]: data.image,
        }));
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
    setDisable(true);

    const { fullName, ...rest } = formData;
    const parts = fullName.trim().replace(/\s+/g, " ").split(" ");

    const updatedData = {
      ...rest,
      title: parts[0] || "",
      name: parts[1] || "",
      lastName: parts.slice(2).join(" ") || "",
    };

    dispatch(updateCuProfile(updatedData));
  };

  if (customerProfileLoading)
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );

  if (customerProfileError)
    return (
      <Container className="mt-4">
        <Alert variant="danger">Error loading profile</Alert>
      </Container>
    );

  const renderField = (icon, label, name, type = "text", disabled = false) => (
    <Form.Group controlId={`form${name}`}>
      <Form.Label className="d-flex align-items-center gap-1">
        {icon} {label}
      </Form.Label>
      <Form.Control
        type={type}
        name={name}
        value={formData[name] || ""}
        onChange={handleChange}
        disabled={disabled}
      />
    </Form.Group>
  );

  const renderFileUpload = (label, field) => (
    <Form.Group controlId={`form${field}`} className="mb-3">
      <Form.Label>{label}</Form.Label>
      <div className="d-flex align-items-center gap-3">
        {formData[field] ? (
          <Image
            src={formData[field]}
            thumbnail
            style={{ width: "100px", height: "50px", objectFit: "contain" }}
          />
        ) : (
          <div className="border p-2 text-muted">
            No {label.toLowerCase()} uploaded
          </div>
        )}
        <Button
          variant="outline-secondary"
          size="sm"
          as="label"
          className="d-flex align-items-center gap-1"
        >
          <Upload size={16} /> Upload
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, field)}
            hidden
          />
        </Button>
      </div>
    </Form.Group>
  );

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold d-flex align-items-center gap-2">
            <User size={28} /> Customer Profile
          </h2>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body>
          <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
            <Tab
              eventKey="basic"
              title={
                <>
                  <User size={16} /> Basic
                </>
              }
            >
              <Row className="g-3 mt-3">
                <Col md={4} className="text-center">
                  <Image
                    src={formData.image || "/assets/img/default.jpg"}
                    roundedCircle
                    thumbnail
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                  <Button
                    variant="outline-primary"
                    size="sm"
                    as="label"
                    className="d-flex align-items-center gap-1 mx-auto mt-4 w-50"
                  >
                    <Upload size={16} /> Upload Logo
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "image")}
                      hidden
                    />
                  </Button>
                </Col>
                <Col md={8}>
                  <Row className="g-3">
                    <Col md={6}>
                      {renderField(<User size={16} />, "Full Name", "fullName")}
                    </Col>
                    <Col md={6}>
                      {renderField(
                        <Mail size={16} />,
                        "Email",
                        "email",
                        "email",
                        true
                      )}
                    </Col>
                    <Col md={6}>
                      {renderField(
                        <Phone size={16} />,
                        "Phone",
                        "phone",
                        "tel"
                      )}
                    </Col>
                    <Col md={6}>
                      {renderField(
                        <FileText size={16} />,
                        "GST Number",
                        "gstNo"
                      )}
                    </Col>
                    <Col md={6}>
                      {renderField(
                        <FileText size={16} />,
                        "PAN Number",
                        "panNo"
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Tab>

            <Tab
              eventKey="address"
              title={
                <>
                  <MapPin size={16} /> Address
                </>
              }
            >
              <Row className="g-3 mt-3">
                <Col md={12}>
                  {renderField(<Home size={16} />, "Address Line 1", "address")}
                </Col>
                <Col md={12}>
                  {renderField(null, "Address Line 2", "addressTwo")}
                </Col>
                <Col md={12}>
                  {renderField(null, "Address Line 3", "addressThree")}
                </Col>
                <Col md={4}>{renderField(null, "City", "city")}</Col>
                <Col md={4}>{renderField(null, "State", "state")}</Col>
                <Col md={4}>{renderField(null, "Pincode", "pincode")}</Col>
              </Row>
            </Tab>

            <Tab
              eventKey="documents"
              title={
                <>
                  <FileText size={16} /> Documents
                </>
              }
            >
              <Row className="g-3 mt-3">
                <Col md={6}>
                  {renderField(null, "Drug License 1", "drugLicenseOne")}
                </Col>
                <Col md={6}>
                  {renderField(null, "Drug License 2", "drugLicenseTwo")}
                </Col>
                <Col md={6}>
                  {renderFileUpload("Signature & Stamp", "signature")}
                </Col>
                {/* <Col md={6}>{renderFileUpload('Stamp', 'stamp')}</Col> */}
              </Row>
            </Tab>
          </Tabs>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button
              variant="outline-secondary"
              onClick={() => navigate(CUSTOMER_URLS.DASHBOARD)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              className="d-flex align-items-center gap-1"
              disabled={disable || customerProfileUpdateLoading}
            >
              {customerProfileUpdateLoading ? (
                <>Updating...</>
              ) : (
                <>
                  <Edit size={16} /> Update Profile
                </>
              )}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
