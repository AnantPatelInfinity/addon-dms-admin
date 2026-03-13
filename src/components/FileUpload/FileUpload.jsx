export const FileUpload = ({ label, value, onChange, field }) => {
    const isPDF = value && value.toLowerCase().endsWith(".pdf");

    return (
        <div className="col-lg-6 col-md-6 col-12 mt-2 mb-3">
            <div className="mb-3">
                <label className="col-form-label">{label}</label>
                <div className="drag-attach">
                    <input
                        type="file"
                        accept="application/pdf, image/*"
                        onChange={(e) => onChange(e, field, label)}
                    />
                    {value ? (
                        <div className="my-2 mx-2">
                            {isPDF ? (
                                <a href={value} target="_blank" rel="noopener noreferrer">
                                    📄 View PDF
                                </a>
                            ) : (
                                <img
                                    src={value}
                                    alt={label}
                                    style={{
                                        width: "100%",
                                        maxHeight: "200px",
                                        objectFit: "cover",
                                        borderRadius: "10px",
                                    }}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="img-upload">
                            <i className="ti ti-file-broken" />
                            Upload File
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
