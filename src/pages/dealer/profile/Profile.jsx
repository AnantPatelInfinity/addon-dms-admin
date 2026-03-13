import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
    Tabs
} from 'react-bootstrap';
import { Edit, Upload, Mail, User, Phone, Home, FileText, MapPin } from 'lucide-react';
import { getDeProfile, updateDeProfile } from '../../../middleware/dealerProfile/dealerProfile';
import axios from 'axios';
import { DX_URL } from '../../../config/baseUrl';
import { toast } from 'react-toastify';
import { dealerProfileUpdateReset } from '../../../slices/dealerProfile.slice';
import { useNavigate } from 'react-router';

const Profile = () => {

    const dispatch = useDispatch();
    const {
        dealerProfileLoading,
        dealerProfileError,
        dealerProfile,

        dealerProfileUpdateError,
        dealerProfileUpdateLoading,
        dealerProfileUpdateMessage,
    } = useSelector(state => state?.dealerProfile);

    const [formData, setFormData] = useState({});
    const [activeTab, setActiveTab] = useState('basic');
    const [disable, setDisable] = useState(false);

    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getDeProfile());
    }, []);

    useEffect(() => {
        if (dealerProfileUpdateError) {
            toast.error(dealerProfileUpdateError);
            dispatch(dealerProfileUpdateReset())
        }

        if (dealerProfileUpdateMessage) {
            toast.success(dealerProfileUpdateMessage);
            dispatch(getDeProfile());
            dispatch(dealerProfileUpdateReset());
        }
        if (dealerProfileUpdateError || dealerProfileUpdateMessage) {
            setDisable(false);
        }
    }, [dealerProfileUpdateError, dealerProfileUpdateMessage]);


    useEffect(() => {
        if (dealerProfile) {
            setFormData({
                name: dealerProfile.name || '',
                dealerCompanyName: dealerProfile.dealerCompanyName || '',
                email: dealerProfile.email || '',
                address: dealerProfile.address || '',
                addressTwo: dealerProfile.addressTwo || '',
                addressThree: dealerProfile.addressThree || '',
                city: dealerProfile.city || '',
                state: dealerProfile.state || '',
                pincode: dealerProfile.pincode || '',
                phone: dealerProfile.phone || '',
                drugLicenseOne: dealerProfile.drugLicenseOne || '',
                drugLicenseTwo: dealerProfile.drugLicenseTwo || '',
                gstNo: dealerProfile.gstNo || '',
                panNo: dealerProfile.panNo || '',
                image: dealerProfile.image || '',
                signature: dealerProfile.signature || '',
                stamp: dealerProfile.stamp || ''
            });
            localStorage.setItem("DX_DL_IMG", dealerProfile.image);
        }
    }, [dealerProfile]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleFileChange = async (e, field) => {
            const file = e.target.files[0];
            if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Only JPG, JPEG, and PNG files are allowed.");
            return;
        }

        const uploadForm = new FormData();
        uploadForm.append("image", file);

        try {
            setDisable(true);
            const response = await axios.post(`${DX_URL}/upload-image`, uploadForm, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            const { data, message, success } = response.data;

            if (success) {
                setFormData(prev => ({
                    ...prev,
                    [field]: data.image
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
        dispatch(updateDeProfile(formData));
    };

    if (dealerProfileLoading) return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Spinner animation="border" variant="primary" />
        </Container>
    );

    if (dealerProfileError) return (
        <Container className="mt-4">
            <Alert variant="danger">Error loading profile</Alert>
        </Container>
    );

    const renderField = (icon, label, name, type = 'text', disabled = false) => (
        <Form.Group controlId={`form${name}`}>
            <Form.Label className="d-flex align-items-center gap-1">
                {icon} {label}
            </Form.Label>
            <Form.Control
                type={type}
                name={name}
                value={formData[name] || ''}
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
                    <Image src={formData[field]} thumbnail style={{ width: '100px', height: '50px', objectFit: 'contain' }} />
                ) : (
                    <div className="border p-2 text-muted">No {label.toLowerCase()} uploaded</div>
                )}
                <Button variant="outline-secondary" size="sm" as="label" className="d-flex align-items-center gap-1">
                    <Upload size={16} /> Upload
                    <Form.Control type="file" accept="image/*" onChange={(e) => handleFileChange(e, field)} hidden />
                </Button>
            </div>
        </Form.Group>
    );

    return (
        <Container className="py-4">
            <Row className="mb-4">
                <Col>
                    <h2 className="fw-bold d-flex align-items-center gap-2">
                        <User size={28} /> Dealer Profile
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
                                        src={formData.image || '/assets/img/default.jpg'}
                                        roundedCircle
                                        thumbnail
                                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                    />
                                    <Button variant="outline-primary" size="sm" as="label" className="d-flex align-items-center gap-1 mx-auto mt-3">
                                        <Upload size={16} /> Upload Logo
                                        <Form.Control type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} hidden />
                                    </Button>
                                </Col>
                                <Col md={8}>
                                    <Row className="g-3">
                                        <Col md={6}>{renderField(<User size={16} />, 'Full Name', 'dealerCompanyName')}</Col>
                                        <Col md={6}>{renderField(<User size={16} />, 'Dealer Company Name', 'name')}</Col>
                                        <Col md={6}>{renderField(<Mail size={16} />, 'Email', 'email', 'email', true)}</Col>
                                        <Col md={6}>{renderField(<Phone size={16} />, 'Phone', 'phone', 'tel')}</Col>
                                        <Col md={6}>{renderField(<FileText size={16} />, 'GST Number', 'gstNo')}</Col>
                                        <Col md={6}>{renderField(<FileText size={16} />, 'PAN Number', 'panNo')}</Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Tab>

                        <Tab eventKey="address" title={<><MapPin size={16} /> Address</>}>
                            <Row className="g-3 mt-3">
                                <Col md={12}>{renderField(<Home size={16} />, 'Address Line 1', 'address')}</Col>
                                <Col md={12}>{renderField(null, 'Address Line 2', 'addressTwo')}</Col>
                                <Col md={12}>{renderField(null, 'Address Line 3', 'addressThree')}</Col>
                                <Col md={4}>{renderField(null, 'City', 'city')}</Col>
                                <Col md={4}>{renderField(null, 'State', 'state')}</Col>
                                <Col md={4}>{renderField(null, 'Pincode', 'pincode')}</Col>
                            </Row>
                        </Tab>

                        <Tab eventKey="documents" title={<><FileText size={16} /> Documents</>}>
                            <Row className="g-3 mt-3">
                                <Col md={6}>{renderField(null, 'Drug License 1', 'drugLicenseOne')}</Col>
                                <Col md={6}>{renderField(null, 'Drug License 2', 'drugLicenseTwo')}</Col>
                                <Col md={6}>{renderFileUpload('Signature & Stamp', 'signature')}</Col>
                                {/* <Col md={6}>{renderFileUpload('Stamp', 'stamp')}</Col> */}
                            </Row>
                        </Tab>
                    </Tabs>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <Button variant="outline-secondary"
                        onClick={() => navigate(-1)}
                        >Cancel</Button>
                        <Button variant="primary"
                            onClick={handleSubmit}
                            className="d-flex align-items-center gap-1"
                            disabled={disable || dealerProfileUpdateLoading}
                        >
                            {dealerProfileUpdateLoading ? (
                                <>
                                    Updating...
                                </>
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
    )
}

export default Profile