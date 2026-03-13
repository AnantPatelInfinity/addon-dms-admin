
export const ClearCustomerStorage = () => {
  const sessionKeys = [
    "DX_CU_TOKEN",
    "DX_CU_NAME",
    "DX_CU_FIRM_ID",
    "DX_CU_FIRM_NAME",
    "CU_ID",
    "DX_CU_IMG",
    "DX_CU_ROLE",
    "DX_CU_FIRM_SN",
  ];

  sessionKeys.forEach((key) => localStorage.removeItem(key));
  if (localStorage.getItem("DX_CU_REM") === "false") {
    localStorage.removeItem("DX_CU_PASS");
    localStorage.removeItem("DX_CU_REM");
    localStorage.removeItem("DX_CU_EMAIL");
  }
};

export const getCustomerStorage = () => {
  const customerStorage = {
    DX_CU_TOKEN: localStorage.getItem("DX_CU_TOKEN"),
    DX_CU_NAME: localStorage.getItem("DX_CU_NAME"),
    DX_CU_EMAIL: localStorage.getItem("DX_CU_EMAIL"),
    DX_CU_PASS: localStorage.getItem("DX_CU_PASS"),
    DX_CU_REM: localStorage.getItem("DX_CU_REM"),
    DX_CU_FIRM_ID: localStorage.getItem("DX_CU_FIRM_ID"),
    DX_CU_FIRM_NAME: localStorage.getItem("DX_CU_FIRM_NAME"),
    DX_CU_IMG: localStorage.getItem("DX_CU_IMG"),
    CU_ID: localStorage.getItem("CU_ID"),
    DX_ROLE: localStorage.getItem("DX_ROLE"),
    DX_CU_FIRM_SN: localStorage.getItem("DX_CU_FIRM_SN"),
  };
  return customerStorage;
};
