import React, { useEffect, useState } from 'react'
import ModalWrapper from '../../Modal/ModalWrapper'
import { useDispatch, useSelector } from 'react-redux'
import { addDispatchThrough, getDispatchThroughList, resetAddDispatchThrough } from '../../../middleware/dispatchThrough/dispatchThrough';
import { toast } from 'react-toastify';

const AddDispatchModal = ({ modal }) => {

    const dispatch = useDispatch();
    const [dispatchThrough, setDispatchThrough] = useState({ name: "" });
    const [errors, setErrors] = useState({});

    const {
        deAddDispatchThroughError,
        deAddDispatchThroughLoading,
        deAddDispatchThroughMessage,
    } = useSelector((state) => state.dispatchThrough);

    useEffect(() => {
        if (deAddDispatchThroughMessage) {
            dispatch(getDispatchThroughList());
            toast.success(deAddDispatchThroughMessage);
            dispatch(resetAddDispatchThrough());
            modal.hide();
        }
        if (deAddDispatchThroughError) {
            toast.error(deAddDispatchThroughError);
            dispatch(resetAddDispatchThrough())
        }
    }, [deAddDispatchThroughError, deAddDispatchThroughMessage]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDispatchThrough(prevState => ({
            ...prevState,
            [name]: value
        }));
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ''
        }));
    }

    const validateForm = () => {
        let tempErrors = {};
        if (!dispatchThrough.name.trim()) {
            tempErrors.name = "Name is required";
        } else if (dispatchThrough.name.length < 3) {
            tempErrors.name = "Name must be at least 3 characters";
        } else if (dispatchThrough.name.length > 50) {
            tempErrors.name = "Name cannot exceed 50 characters";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    }

    const handleSubmit = () => {
        if (validateForm()) {
            const formData = new URLSearchParams();
            formData.append("name", dispatchThrough.name);
            dispatch(addDispatchThrough(formData));
        }
    }

    return (
        <ModalWrapper
            title="Dispatch Through Details"
            isShown={modal.isShown}
            hide={modal.hide}
            size={"lg"}
            footer={false}
        >
            <div className="col-lg-4 col-md-6 col-12">
                <div className="form-floating mb-3">
                    <input
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        name="name"
                        value={dispatchThrough.name}
                        onChange={handleChange}
                        placeholder='Name'
                    />
                    <label>Name <span className="text-danger">*</span></label>
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
            </div>
            <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-light me-2" onClick={modal.hide}>
                    Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={deAddDispatchThroughLoading}>
                    {deAddDispatchThroughLoading ? "Saving..." : "Create"}
                </button>
            </div>
        </ModalWrapper>
    )
}

export default AddDispatchModal