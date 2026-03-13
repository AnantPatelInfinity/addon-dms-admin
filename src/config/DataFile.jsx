export const statusList = [
  { value: 1, label: "Pending" },
  { value: 2, label: "Approved" },
  { value: 3, label: "Rejected" },
];

export const logos = {
  LOGIN_LOGO: "/assets/img/dmplogo.svg",
  X_TECH_LOGO: "/assets/img/xtech-logo.svg",
  // LOGIN_NEW: "/assets/img/login-logo.png",
  LOGIN_NEW: "/assets/img/tech-care-logo.png",
  NO_PRO_IMAGE: "/assets/img/no-image.png",
};

export const customerRegisterType = [
  { value: 1, label: "Regular" },
  { value: 2, label: "Unregister/Consumer" },
];

export const customerTitle = [
  { value: 1, label: "Mr." },
  { value: 2, label: "Mrs." },
  { value: 3, label: "Miss" },
  { value: 4, label: "Ms." },
  { value: 5, label: "Dr." },
  { value: 6, label: "Prof." },
  { value: 7, label: "M/S." },
  { value: 8, label: "Other" },
];

// export const getServiceBadge = (status) => {
//     switch (status) {
//         case 1: return <span className="badge bg-secondary">Pending Request</span>;
//         case 2: return <span className="badge bg-info">Awaiting Company Action</span>;
//         case 3: return <span className="badge bg-primary">Courier Dispatched</span>;
//         case 4: return <span className="badge bg-warning">Received by Company</span>;
//         case 5: return <span className="badge bg-dark">Estimation In Progress</span>;
//         case 6: return <span className="badge bg-light text-dark">Awaiting Customer Approval</span>;
//         case 7: return <span className="badge bg-success">Dispatched to Customer</span>;
//         case 8: return <span className="badge bg-success">Service Completed</span>;
//         default: return <span className="badge bg-danger">Unknown</span>;
//     }
// };

export const statusConfig = {
  1: {
    text: "Service Request Submitted",
    icon: "🧾",
    className: "badge-pending",
  },

  fullProduct: {
    2: {
      text: "Awaiting Admin Dispatch",
      icon: "📦",
      className: "badge-awaiting-company",
      condition: (service) => {
        if (service?.dealerId !== null) {
          return {
            text: "Awaiting Dealer Dispatch",
            icon: "📦",
            className: "badge-awaiting-company",
          };
        }
        if (service?.dealerId === null && service?.customerId !== null) {
          return {
            text: "Awaiting Customer Dispatch",
            icon: "📦",
            className: "badge-awaiting-company",
          };
        }
      },
    },
    4: {
      text: "Awaiting Company Approval",
      icon: "🧰",
      className: "badge-approval",
    },
    8: {
      text: "Awaiting Company Service Details",
      icon: "🔧",
      className: "badge-installation",
    },

    out: {
      5: {
        text: "Awaiting Admin Approval",
        icon: "🕒",
        className: "badge-awaiting-company",
        condition: (service) => {
          if (
            service?.customerApproval.paymentStatus === null &&
            service?.customerApproval?.pdf === null
          ) {
            return {
              text: "Awaiting Customer Approval",
              icon: "🕒",
              className: "badge-awaiting-company",
            };
          }
          if (service?.customerApproval.isApprove === null) {
            return {
              text: "Awaiting Admin Approval",
              icon: "🕒",
              className: "badge-awaiting-company",
            };
          }
        },
      },
      6: {
        text: "Awaiting Company Dispatch",
        icon: "🚚",
        className: "badge-dispatched",
        condition: (service) => {
          if (
            (service?.companyDispatch?.pdf !== null ||
              service?.companyDispatch?.image !== null) &&
            service?.customerReceive?.isReceive === true
          ) {
            return {
              text: "Service Completed Successfully",
              icon: "✅",
              className: "badge-completed",
            };
          }
          if (
            (service?.companyDispatch?.pdf !== null ||
              service?.companyDispatch?.image !== null) &&
            (service.customerReceive?.isReceive === false ||
              service.customerReceive?.isReceive === null)
          ) {
            return {
              text: "Product Dispatched to Customer",
              icon: "📤",
              className: "badge-awaiting-company",
            };
          }
          return null;
        },
      },
      7: {
        text: "Product Dispatched To Customer",
        icon: "📤",
        className: "badge-dispatched-customer",
      },
      10: {
        text: "Service Successfully Completed",
        icon: "✅",
        className: "badge-completed",
        condition: (service) => {
          if (service?.customerApproval.isApprove === null) {
            return {
              text: "Awaiting Admin Approval",
              icon: "🕒",
              className: "badge-awaiting-company",
            };
          }
        },
      },
    },

    under: {
      6: {
        text: "Awaiting Company Dispatch",
        icon: "🚚",
        className: "badge-dispatched",
      },
      7: {
        text: "Product Dispatched To Customer",
        icon: "📤",
        className: "badge-dispatched-customer",
      },
      10: {
        text: "Service Completed Successfully",
        icon: "✅",
        className: "badge-completed",
      },
    },
  },

  parts: {
    out: {
      2: {
        text: "Awaiting Admin Approval",
        icon: "📋",
        className: "badge-awaiting-company",
        condition: (service) => {
          if (service?.dealerId !== null) {
            return {
              text: "Awaiting Dealer Approval",
              icon: "📋",
              className: "badge-awaiting-company",
            };
          }
          if (service?.dealerId === null && service?.customerId !== null) {
            return {
              text: "Awaiting Customer Approval",
              icon: "📋",
              className: "badge-awaiting-company",
            };
          }
        },
      },
      5: {
        text: "Awaiting Company Dispatch",
        icon: "🚚",
        className: "badge-dispatched",
        condition: (service) => {
          if (
            (service?.companyDispatch?.pdf !== null ||
              service?.companyDispatch?.image !== null) &&
            service?.customerReceive?.isReceive === true
          ) {
            return {
              text: "Service Completed Successfully",
              icon: "✅",
              className: "badge-completed",
            };
          }
          return null;
        },
      },
      7: {
        text: "Product Dispatched To Customer",
        icon: "📤",
        className: "badge-dispatched-customer",
      },
      8: {
        text: "Installation Details Pending",
        icon: "🛠️",
        className: "badge-installation",
        optionalStatus: {
          1: {
            text: "Installation Details Pending",
            icon: "🛠️",
            className: "badge-installation",
          },
          2: {
            text: "Service Completed Successfully",
            icon: "✅",
            className: "badge-completed",
          },
        },
      },
      10: {
        text: "Service Completed Successfully",
        icon: "✅",
        className: "badge-completed",
        optionalStatus: {
          1: {
            text: "Installation Details Pending",
            icon: "🛠️",
            className: "badge-installation",
            condition: (service) => {
              if (
                service.customerApproval?.isApprove === null ||
                service.customerApproval?.isApprove === false
              ) {
                return {
                  text: "Awaiting Admin Approval",
                  icon: "📋",
                  className: "badge-awaiting-company",
                };
              }
            },
          },
          2: {
            text: "Service Completed Successfully",
            icon: "✅",
            className: "badge-completed",
          },
        },
      },
    },

    under: {
      2: {
        text: "Company Action Taken And Dispatched To Customer",
        icon: "🚚",
        className: "badge-dispatched",
      },
      4: {
        text: "Awaiting Company Approval",
        icon: "📋",
        className: "badge-awaiting-company",
      },
      8: {
        text: "Installation Pending",
        icon: "🛠️",
        className: "badge-installation",
        condition: (service) => {
          if (
            service?.isParts === true &&
            (service?.customerReceive?.isReceive === null ||
              service?.customerReceive?.isReceive === false)
          ) {
            return {
              text: "Awaiting Customer Approval",
              icon: "📋",
              className: "badge-awaiting-company",
            };
          }
          return null;
        },
        optionalStatus: {
          1: {
            text: "Installation Details Pending",
            icon: "🛠️",
            className: "badge-installation",
            condition: (service) => {
              if (
                service?.customerReceive?.isReceive === null ||
                service?.customerReceive?.isReceive === false
              ) {
                return {
                  text: "Awaiting Customer Approval",
                  icon: "📋",
                  className: "badge-awaiting-company",
                };
              }
              return null;
            },
          },
          2: {
            text: "Service Completed Successfully",
            icon: "✅",
            className: "badge-completed",
          },
        },
      },
      10: {
        text: "Service Completed Successfully",
        icon: "✅",
        className: "badge-completed",
        optionalStatus: {
          1: {
            text: "Installation Details Pending",
            icon: "🛠️",
            className: "badge-installation",
            condition: (service) => {
              if (
                service?.dealerId === null &&
                service?.customerId !== null &&
                service?.courierAdminDispatch.dispatchPdf === null
              ) {
                return {
                  text: "Customer Dispatch Pending",
                  icon: "🚚",
                  className: "badge-dispatched-customer",
                };
              }
              if (
                service?.dealerId !== null &&
                service?.courierAdminDispatch.dispatchPdf === null
              ) {
                return {
                  text: "Dealer Dispatch Pending",
                  icon: "🚚",
                  className: "badge-dispatched-customer",
                };
              }
              if (service?.courierAdminDispatch.dispatchPdf === null) {
                return {
                  text: "Admin Dispatch Pending",
                  icon: "🚚",
                  className: "badge-dispatched-customer",
                };
              }
            },
          },
          2: {
            text: "Service Completed Successfully",
            icon: "✅",
            className: "badge-completed",
          },
        },
      },
    },
  },
};

export const getServiceStatus = (serviceObj) => {
  if (!serviceObj)
    return { text: "N/A", icon: "❓", className: "badge-secondary" };

  const { isParts, serviceEstimate, status, optionalStatus } = serviceObj;
  const warrantyType = Number(serviceEstimate?.warrantyType);

  if (status === 1)
    return (
      statusConfig[1] || {
        text: "Submitted",
        icon: "🧾",
        className: "badge-default",
      }
    );

  let isPartsService = false;

  if (serviceObj) {
    const partsFlag =
      serviceObj.isParts === true ||
      serviceObj.isParts === "true" ||
      serviceObj.isParts === 1 ||
      serviceObj.isParts === "1";
    const fullFlag =
      serviceObj.isFullProduct === true ||
      serviceObj.isFullProduct === "true" ||
      serviceObj.isFullProduct === 1 ||
      serviceObj.isFullProduct === "1";
    isPartsService = partsFlag && !fullFlag;
  }

  const type = isPartsService ? "parts" : "fullProduct";
  const warrantyGroup = warrantyType === 3 ? "out" : "under";

  let baseConfig =
    statusConfig[type]?.[warrantyGroup]?.[status] ||
    statusConfig[type]?.[status] ||
    statusConfig[status];

  if (!baseConfig)
    return { text: "Unknown Status", icon: "❓", className: "badge-secondary" };

  if (typeof baseConfig.condition === "function") {
    const conditionResult = baseConfig.condition(serviceObj);
    if (conditionResult && typeof conditionResult === "object") {
      baseConfig = { ...baseConfig, ...conditionResult };
    }
  }

  // { check: fn, result: {} ]
  if (Array.isArray(baseConfig.conditions)) {
    for (const cond of baseConfig.conditions) {
      if (typeof cond.check === "function" && cond.check(serviceObj)) {
        baseConfig = { ...baseConfig, ...cond.result };
        break;
      }
    }
  }

  if (baseConfig.optionalStatus && optionalStatus != null) {
    const opt = baseConfig.optionalStatus[optionalStatus];

    if (opt) {
      let mergedOpt = { ...opt };

      if (typeof opt.condition === "function") {
        const optResult = opt.condition(serviceObj);
        if (optResult && typeof optResult === "object") {
          mergedOpt = { ...mergedOpt, ...optResult };
        }
      }

      if (typeof opt === "string") return { ...baseConfig, text: opt };
      baseConfig = { ...baseConfig, ...mergedOpt };
    }
  }

  return baseConfig;
};

export const getServiceStatusBadge = (status, isFullProduct) => {
  const baseConfig = {
    1: { text: "Service Request Submitted", icon: "🧾", className: "badge-pending" },
    2: { text: "Company Action Taken", icon: "📋", className: "badge-awaiting-company" },

    3: { text: "Awaiting Company Dispatch", icon: "🕒", className: "badge-received" },
    4: { text: "Product dispatched to customer", icon: "📤", className: "badge-approval" },
    5: { text: "Awaiting Customer Dispatch", icon: "🚚", className: "badge-dispatched" },
    6: { text: "Product Dispatched to Company", icon: "📦", className: "badge-awaiting-company" },
    7: { text: "Spare/Parts Installation Pending", icon: "🛠️", className: "badge-dispatched-customer" },

    8: { text: "Spare/Parts Installation Pending", icon: "🛠️", className: "badge-installation" },
    10: { text: "Service Completed Successfully", icon: "✅", className: "badge-completed" },
  };

  const fullProductOverrides = {
    3: { text: "Product Dispatched to Company", icon: "🚚", className: "service-badge badge-dispatched" },
    4: { text: "Product Received by Company", icon: "📦", className: "service-badge badge-received" },
    5: { text: "Pending Customer Approval", icon: "🕒", className: "service-badge badge-estimation" },
    6: { text: "Awaiting Company Dispatch Details", icon: "📋", className: "service-badge badge-approval" },
    7: { text: "Product Dispatched to Customer", icon: "📤", className: "service-badge badge-dispatched-customer" },
  };

  let config = { ...baseConfig[status] };

  if (isFullProduct && fullProductOverrides[status]) {
    config = { ...config, ...fullProductOverrides[status] };
  }

  return (
    <span className={`${config.className} badge text-white`} style={{ fontSize: "10px", border: "none" }}>
      <span className="me-1" style={{ fontSize: "13px", border: "none" }}>{config.icon}</span>
      {config.text}
    </span>
  );
};




export const features = [
  {
    icon: "ti ti-clock-hour-3",
    title: "Quality in Every Services",
    description:
      "Quality isn’t just what we do, it’s who we are — reflected in every solution, and every moment we serve you.",
    color: "#e5251b",
    bgPattern:
      "radial-gradient(circle at 20% 50%, rgba(220, 53, 69, 0.08) 0%, transparent 50%)",
  },
  {
    icon: "ti ti-bolt",
    title: "Prompt Response",
    description:
      "Instant support and real-time updates keeping your practice running smoothly 24/7.",
    color: "#e5251b",
    bgPattern:
      "radial-gradient(circle at 80% 50%, rgba(200, 35, 51, 0.08) 0%, transparent 50%)",
  },
  {
    icon: "ti ti-shield-check",
    title: "Reliable Services",
    description:
      "Our reliable services ensure you always have the support and solutions you need.",
    color: "#e5251b",
    bgPattern:
      "radial-gradient(circle at 50% 50%, rgba(189, 33, 48, 0.08) 0%, transparent 50%)",
  },
];

export const serviceFilter = [
  { label: "Service Request Submitted", value: 1 },
  { label: "Awaiting Company Action", value: 2 },
  { label: "Product Dispatched to Company", value: 3 },
  { label: "Product Received by Company", value: 4 },
  { label: "Pending Customer Approval", value: 5 },
  { label: "Awaiting Company Dispatch Details", value: 6 },
  { label: "Product Dispatched to Customer", value: 7 },
  { label: "Installation Pending", value: 8 },
  { label: "Service Completed Successfully", value: 10 },
];

export const ROLES = {
  ADMIN: "admin",
  DEALER: "dealer",
  COMPANY: "company",
  CUSTOMER: "customer",
};

export const COMPANY_LOGOS = {
  alerio: {
    name: "alerio",
    img: "/assets/img/alerio_logo.svg",
  },
  durDental: {
    name: "durdental",
    img: "/assets/img/durdental_logo.svg",
  },
  shining3d: {
    name: "shining3d",
    img: "/assets/img/shining3D-logo.svg",
  },
  sigerMedical: {
    name: "sigerMedical",
    img: "/assets/img/siger_medical_logo.png",
  },
};

export const DEFAULT_ROLE = "dealer";

export const getTokenForRole = (role = DEFAULT_ROLE) => {
  switch (role) {
    case "dealer":
      return localStorage.getItem("DX_DL_TOKEN");
    case "company":
      return localStorage.getItem("DX_CO_TOKEN");
    case "customer":
      return localStorage.getItem("DX_CU_TOKEN");
    case "admin":
      return localStorage.getItem("DX_AD_TOKEN");
    default:
      return localStorage.getItem("DX_US_TOKEN");
  }
};

export const getModuleKey = (customKey = "") => {
  if (customKey) return customKey;
  // Attempt to use current pathname if in browser
  if (typeof window !== "undefined") {
    const path = window.location.pathname;

    // Convert `/admin/firm-list` → `admin-firm-list`
    return path.replace(/\//g, "-").replace(/^-|-$/g, "");
  }
  return "default-module";
};


export const COMPANY_ROLES = {
  GENERAL: "GENERAL",
  ACCOUNTS: "ACCOUNTS",
  INSTALLATIONS: "INSTALLATIONS",
  SERVICES: "SERVICES",
  COMPANY: "company",
};

export const companyRoleOptions = [
  { value: COMPANY_ROLES.ACCOUNTS, label: "ACCOUNTS" },
  { value: COMPANY_ROLES.GENERAL, label: "GENERAL (Complete Access)" },
  { value: COMPANY_ROLES.INSTALLATIONS, label: "INSTALLATIONS" },
  { value: COMPANY_ROLES.SERVICES, label: "SERVICES" },
  { value: COMPANY_ROLES.COMPANY, label: "Company" },
];

export const getRoleFlags = (userRole) => {
  const flags = {};
  Object.keys(COMPANY_ROLES).forEach((key) => {
    flags[`is${key.charAt(0) + key.slice(1).toLowerCase()}`] =
      userRole === COMPANY_ROLES[key];
  });
  return flags;
};

export const TrialStatus = [
  { label: "Pending", value: "PENDING", bg: "badge bg-warning" },
  { label: "In Process", value: "INPROGRESS", bg: "badge bg-info" },
  { label: "Completed", value: "COMPLETED", bg: "badge bg-success" },
];

export const optionalInstallationFields = [
  { key: "dongle", label: "Dongle" },
  { key: "batterySNo", label: "Battery S.No", isArray: true },
  { key: "powerBox", label: "Power Box" },
  { key: "dock", label: "Dock" },
  { key: "smps", label: "SMPS" },
];

export const activeOptionalFields = (items) =>
  optionalInstallationFields.filter((field) =>
    items.some((item) => {
      const value = item?.[field.key];
      if (field.isArray) return Array.isArray(value) && value.length > 0;
      return !!value;
    })
  );


export const AERB_STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending", bg: "badge bg-warning" },
  { value: "UNDER_PROCESS", label: "Under Process", bg: "badge bg-info" },
  { value: "COMPLETED", label: "Completed", bg: "badge bg-success" },
  { value: "REJECTED", label: "Rejected", bg: "badge bg-danger" },
];

