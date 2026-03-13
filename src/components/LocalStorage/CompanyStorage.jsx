export const ClearCompanyStorage = () => {
    const sessionKeys = [
        "DX_CO_NAME",
        "DX_CO_TOKEN",
        "DX_CO_FIRM_ID",
        "DX_CO_FIRM_NAME",
        "CO_ID",
        "DX_CO_IMG",
        "DX_ROLE",
    ]
    sessionKeys.forEach(key => localStorage.removeItem(key));
    if (localStorage.getItem("DX_CO_REM") === "false") {
        localStorage.removeItem("DX_CO_EMAIL");
        localStorage.removeItem("DX_CO_REM");
        localStorage.removeItem("DX_US_EMAIL");
        localStorage.removeItem("DX_US_REM");
        localStorage.removeItem("DX_CO_PASS");
    }
}

export const getCompanyStorage = () => {
    const companyStorage = {
        name: localStorage.getItem("DX_CO_NAME"),
        token: localStorage.getItem("DX_CO_TOKEN"),
        email: localStorage.getItem("DX_CO_EMAIL"),
        rememberMe: localStorage.getItem("DX_CO_REM") === 'true',
        firmId: localStorage.getItem("DX_CO_FIRM_ID"),
        firmName: localStorage.getItem("DX_CO_FIRM_NAME"),
        comId: localStorage.getItem("CO_ID"),
        image: localStorage.getItem("DX_CO_IMG"), 
        role: localStorage.getItem("DX_ROLE"),
    };
    return companyStorage
}