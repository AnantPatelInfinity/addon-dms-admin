export const ClearAdminStorage = () => {
    const sessionKeys = [
        "DX_AD_TOKEN",
        "DX_AD_NAME",
        "DX_AD_FIRM",
        "DX_AD_FIRM_NAME",
        "DX_AD_ROLE",
        "DX_AD_FIRM_SN",
        "DX_AD_IMG",
    ]
    sessionKeys.forEach(key => localStorage.removeItem(key));
    if (localStorage.getItem("REM_AD_CHECKED") === "false") {
        localStorage.removeItem("DX_AD_EMAIL")
        localStorage.removeItem("REM_AD_PASS")
        localStorage.removeItem("REM_AD_CHECKED")
    }
}

export const getAdminStorage = () => {
    const adminStorage = {
        "DX_AD_TOKEN": localStorage.getItem("DX_AD_TOKEN"),
        "DX_AD_NAME": localStorage.getItem("DX_AD_NAME"),
        "DX_AD_FIRM": localStorage.getItem("DX_AD_FIRM"),
        "DX_AD_FIRM_NAME": localStorage.getItem("DX_AD_FIRM_NAME"),
        "DX_AD_EMAIL": localStorage.getItem("DX_AD_EMAIL"),
        "REM_AD_PASS": localStorage.getItem("REM_AD_PASS"),
        "REM_AD_CHECKED": localStorage.getItem("REM_AD_CHECKED"),
        "DX_AD_FIRM_SN": localStorage.getItem("DX_AD_FIRM_SN"),
        "DX_AD_IMG": localStorage.getItem("DX_AD_IMG"),
        "AD_ID": localStorage.getItem("AD_ID"),
        "DX_AD_ROLE": localStorage.getItem("DX_AD_ROLE"),
    }
    return adminStorage
}