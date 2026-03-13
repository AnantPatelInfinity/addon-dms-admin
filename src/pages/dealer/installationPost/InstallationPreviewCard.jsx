import React, { forwardRef } from "react";
import { getAdminStorage } from "../../../components/LocalStorage/AdminStorage";
import { logos } from "../../../config/DataFile";

const InstallationPreviewCard = forwardRef(
  ({ formData, isPreview = true, dealer, company }, ref) => {
    const validImages = formData.images.filter(Boolean);

    return (
      <div
        ref={ref}
        className="w-100 h-100 d-flex flex-column"
        style={{
          borderRadius: "14px",
          background: "linear-gradient(145deg, #ffffff, #f8faff)",
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
        }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center px-3 pt-3 ">
          <div
            style={{
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={
                dealer.firmSn === "DMP"
                  ? dealer.image
                  : logos.X_TECH_LOGO
              }
              alt="Logo not found"
              style={{
                width: "100%",
                height: "80px",
                objectFit: "cover",
              }}
            />
          </div>
          <div
            style={{
              overflow: "hidden",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {
              company?.image &&  
                <img
                  src={company?.image} 
                  style={{ width: "100%", height: "60px", objectFit: "contain" }}
                />
            }
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: 16, flex: "1 1 auto", marginTop: "8px" }}>
          {/* Images */}
          {validImages.length > 0 ? (
            <div
              className="d-flex justify-content-center mb-4"
              style={{ gap: "10px" }}
            >
              {validImages.map((src, i, arr) => (
                <div
                  className="w-100"
                  key={i}
                  style={{
                    width:
                      arr.length === 1
                        ? "100%"
                        : arr.length === 2
                        ? "48%"
                        : "30%",
                    height: 300,
                    borderRadius: "16px",
                    backgroundImage: `url(${src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
              ))}
            </div>
          ) : (
            <div
              className="d-flex justify-content-center mb-4"
              style={{ gap: "16px" }}
            >
              {[0, 1, 2].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: "32%",
                    height: 300,
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #f1f3f5, #e9ecef)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#adb5bd",
                    fontWeight: "500",
                  }}
                >
                  No Image
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          {formData.description ? (
            <div
              className="p-4 shadow-sm"
              style={{
                background: "rgba(102, 159, 245, 0.05)",
                borderRadius: "12px",
                textAlign: "center",
                whiteSpace: "pre-wrap"
              }}
            >
              {formData.description
                .split("\n")
                .filter(line => line.trim() !== "")   
                .join("\n")}
            </div>
          ) : (
            isPreview && (
              <div
                style={{
                  background: "#f8f9fa",
                  height: 60,
                  borderRadius: "12px",
                }}
              />
            )
          )}
        </div>

        {/* Footer */}
        <div
          className="bg-primary"
          style={{
            color: "white",
            padding: "16px",
            textAlign: "center",
            fontSize: "0.95rem",
            fontWeight: "500",
            borderTopLeftRadius: "7px",
            borderTopRightRadius: "7px"
          }}
        >
          <div>
          {dealer?.phone} • {dealer?.email} 
          </div>
          <div className="mt-1">
            {dealer?.address} {dealer?.addressTwo}{dealer?.adressThree},    
            {dealer?.city}, {dealer?.state} - {dealer?.pincode}
          </div>
        </div>
      </div>
    );
  }
);

export default InstallationPreviewCard;
