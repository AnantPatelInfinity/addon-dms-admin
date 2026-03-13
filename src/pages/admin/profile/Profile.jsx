import React, { useEffect, useState } from 'react'
import { useApi } from '../../../context/ApiContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { DX_URL } from '../../../config/baseUrl';
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
  Badge
} from 'react-bootstrap';

const Profile = () => {

  const { get, post } = useApi();
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    email: "",
  });
  const [disable, setDisable] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      setDisable(true);
      const response = await get("/admin/get-profile")
      const { success, message, data } = response;
      if (success) {
        setFormData(data);
        localStorage.setItem("DX_AD_IMG", data.image);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    } finally {
      setDisable(false);
    }
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, JPEG, and PNG files are allowed.');
      return;
    }

    const uploadForm = new FormData();
    uploadForm.append('image', file);

    try {
      setUploading(true);
      const response = await axios.post(`${DX_URL}/upload-image`, uploadForm, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { data, message, success } = response.data;

      if (success) {
        setFormData((prev) => ({
          ...prev,
          image: data.image,
        }));
        toast.success('Image uploaded successfully');
      } else {
        toast.error(message || 'Upload failed');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      setDisable(true);
      const bodyFormData = new URLSearchParams();
      bodyFormData.append("name", formData.name);
      bodyFormData.append("image", formData.image);
      const response = await post("/admin/update-profile", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      })

      const { success, message } = response;
      if (success) {
        toast.success(message);
        getProfile()
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    } finally {
      setDisable(false);
    }
  }

  const getProfileImage = () => {
    if (formData.image) return formData.image;
    return null;
  };

  const getInitials = (name) => {
    if (!name) return 'AD';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white border-0 text-center pt-4">
                <div className="position-relative d-inline-block mb-3">
                  {formData.image ? (
                    <Image
                      src={formData.image}
                      alt="Profile"

                      width={120}
                      height={120}
                      className="border border-3 border-light shadow-sm"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center border border-3 border-light shadow-sm"
                      style={{ width: '120px', height: '120px', fontSize: '2rem', fontWeight: 'bold' }}
                    >
                      {getInitials(formData.name)}
                    </div>
                  )}

                  {uploading && (
                    <div
                      className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 rounded-circle d-flex align-items-center justify-content-center"
                    >
                      <Spinner animation="border" variant="light" size="sm" />
                    </div>
                  )}
                </div>

                <h4 className="mb-1 text-dark">{formData.name || 'Admin User'}</h4>
                <p className="text-muted mb-0">{formData.email}</p>
                <Badge bg="success" className="mt-2">Administrator</Badge>
              </Card.Header>

              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <div className="text-center mb-4">
                    <Form.Label htmlFor="image" className="btn btn-outline-primary btn-sm">
                      {uploading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-camera me-2"></i>
                          Change Photo
                        </>
                      )}
                      <Form.Control
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="d-none"
                        disabled={uploading}
                      />
                    </Form.Label>
                    <Form.Text className="d-block mt-2 text-muted">
                      JPG, JPEG, PNG files only
                    </Form.Text>
                  </div>

                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name || ''}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          required
                          disabled={disable}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email || ''}
                          disabled
                          className="bg-light"
                        />
                        <Form.Text className="text-muted">
                          Email cannot be changed
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={disable}
                      className="fw-semibold"
                    >
                      {disable ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Updating Profile...
                        </>
                      ) : (
                        'Update Profile'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>

              <Card.Footer className="bg-light text-center text-muted py-3">
                <small>
                  <i className="bi bi-calendar3 me-2"></i>
                  Member since: {formData.createdAt ? new Date(formData.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </small>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Profile