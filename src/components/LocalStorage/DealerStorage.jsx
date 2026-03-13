export const ClearDealerStorage = () => {
    const sessionKeys = [
        "DX_DL_TOKEN",
        "DX_DL_NAME",
        "DX_DL_FIRM_ID",
        "DX_DL_FIRM_NAME",
        "DL_ID",
        "DX_DL_IMG",
        "DX_ROLE",
        "DX_DL_FIRM_SN",
    ]
    sessionKeys.forEach(key => localStorage.removeItem(key));
    if (localStorage.getItem("DX_DL_REM") === "false") {
        localStorage.removeItem("DX_DL_PASS");
        localStorage.removeItem("DX_DL_REM");
        localStorage.removeItem("DX_DL_EMAIL");
    }
}


export const getDealerStorage = () => {
    const dealerStorage = {
        "DX_DL_TOKEN": localStorage.getItem("DX_DL_TOKEN"),
        "DX_DL_NAME": localStorage.getItem("DX_DL_NAME"),
        "DX_DL_EMAIL": localStorage.getItem("DX_DL_EMAIL"),
        "DX_DL_PASS": localStorage.getItem("DX_DL_PASS"),
        "DX_DL_REM": localStorage.getItem("DX_DL_REM"),
        "DX_DL_FIRM_ID": localStorage.getItem("DX_DL_FIRM_ID"),
        "DX_DL_FIRM_NAME": localStorage.getItem("DX_DL_FIRM_NAME"),
        "DX_DL_IMG": localStorage.getItem("DX_DL_IMG"),
        "DL_ID": localStorage.getItem("DL_ID"),
        "DX_ROLE": localStorage.getItem("DX_ROLE"),
        "DX_DL_FIRM_SN": localStorage.getItem("DX_DL_FIRM_SN"),
    }
    return dealerStorage
}