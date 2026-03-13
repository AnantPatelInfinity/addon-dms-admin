export const getWarrantyCodeStatus = (installationData, amcData) => {
    const today = new Date();

    if (amcData && amcData.length > 0) {
        const amc = amcData[0];
        const amcEndDate = new Date(amc.endDate);
        if (amcEndDate >= today) {
            return 2; // Under AMC
        }
    }

    if (installationData) {
        const warrantyEndDate = new Date(installationData.warrantyEndDate);
        if (warrantyEndDate >= today) {
            return 1; // Under Warranty
        }
    }

    return 3; // Expired
};
