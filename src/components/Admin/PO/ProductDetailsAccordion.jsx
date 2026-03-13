import Accordion from "react-bootstrap/Accordion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ModalWrapper from "../../Modal/ModalWrapper";
import useModal from "../../Modal/useModal";

const ProductDetailsAccordion = ({ proObj, form }) => {

    if (!proObj || !form?.productId) return null;
    const modal = useModal();
    const renderInput = (label, value) => (
        <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">{label}</label>
            <input type="text" className="form-control" value={value || ""} disabled />
        </div>
    );

    const renderPartsInput = (label, parts) => (
        <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">{label}</label>
            <div
                className="form-control"
                style={{ cursor: "pointer" }}
                onClick={modal.show}
            >
                {parts?.map((e) => e?.name).join(", ") || "-"}
            </div>
        </div>
    );


    return (
        <Accordion defaultActiveKey="0" className="my-4">
            <Accordion.Item eventKey="0">
                <Accordion.Header>Basic Information</Accordion.Header>
                <Accordion.Body>
                    <div className="row">
                        {renderInput("Category", proObj.categoryName)}
                        {renderInput("Unit", proObj.unitName || "-")}
                        {renderInput("Company", proObj.companyName)}
                        {renderPartsInput("Parts", proObj.parts)}
                        {renderInput("HSN No.", proObj.hsnNo || "-")}
                        {renderInput("Supply Type", proObj.supplyTypeName || "-")}
                        {renderInput("GST Applicable", proObj.isGst ? "Yes" : "No")}
                        {renderInput("Warranty", proObj.warrantyName || "N/A")}
                    </div>
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
                <Accordion.Header>Descriptions</Accordion.Header>
                <Accordion.Body>
                    <div className="row">
                        <div className="col-12 mb-3">
                            <div className="p-3 border rounded bg-light">
                                <h6 className="mb-2">Description</h6>
                                {proObj.description ? (
                                    <div dangerouslySetInnerHTML={{ __html: proObj.description }} />
                                ) : (
                                    <p className="text-muted mb-0">No description available.</p>
                                )}
                            </div>
                        </div>
                        <div className="col-12 mb-3">
                            <div className="p-3 border rounded bg-light">
                                <h6 className="mb-2">Private Description</h6>
                                {proObj.privateDescription ? (
                                    <div dangerouslySetInnerHTML={{ __html: proObj.privateDescription }} />
                                ) : (
                                    <p className="text-muted mb-0">No private description available.</p>
                                )}
                            </div>
                        </div>
                        <div className="col-12 mb-3">
                            <div className="p-3 border rounded bg-light">
                                <h6 className="mb-2">Short Description</h6>
                                <div>{proObj?.shortDescription || "N/A"}</div>
                            </div>
                        </div>
                    </div>
                </Accordion.Body>
            </Accordion.Item>

            {/* Product Images */}
            {proObj?.images?.length > 0 && (
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Product Images</Accordion.Header>
                    <Accordion.Body>
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={20}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true }}
                        >
                            {proObj.images.map((img, idx) => (
                                <SwiperSlide key={idx}>
                                    <img
                                        src={img.url}
                                        alt={`Product ${idx + 1}`}
                                        className="img-fluid rounded border"
                                        style={{ maxHeight: 300, objectFit: "contain", width: "100%" }}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </Accordion.Body>
                </Accordion.Item>
            )}

            <ModalWrapper
                title="Parts Details"
                isShown={modal.isShown}
                hide={modal.hide}
                footer={false}
            >
                {proObj?.parts?.length > 0 ? (
                    <ul className="list-group">
                        {proObj.parts.map((part, idx) => (
                            <li key={idx} className="list-group-item">
                                <strong>{part.name}</strong>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted">No parts available.</p>
                )}
            </ModalWrapper>
        </Accordion>
    );
};

export default ProductDetailsAccordion;
