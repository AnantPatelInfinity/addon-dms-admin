export const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
};


export const getStatusBadge = (status) => {
    switch (status) {
        case 1:
            return <span className="badge bg-warning">Pending</span>;
        case 2:
            return <span className="badge bg-success">Approved</span>;
        case 3:
            return <span className="badge bg-danger">Rejected</span>;
        default:
            return <span className="badge bg-secondary">Unknown</span>;
    }
};

export const getTrialBadge = (status, role) => {
    switch (status) {
        case "CREATED":
            return <span className="badge bg-warning">Awaiting {role?.toLowerCase() === "admin" ? "Admin Dispatch" : "Dealer Dispatch"}</span>;
        case "DISPATCHED":
            return <span className="badge bg-purple-light">Awaiting Customer Confirmation</span>;
        case "RECEIVED_BY_CUSTOMER":
            return <span className="badge bg-info">Product Received By Customer</span>;
        case "RETURNED_BY_CUSTOMER":
            return <span className="badge bg-danger">Product Returned By Customer</span>;
        case "COMPLETED":
            return <span className="badge bg-success">Process Completed</span>;
        default:
            return <span className="badge bg-danger">Unknown</span>;
    }
}

export const getTrialHistoryStatus = (status, role) => {
    switch (status) {
        case "CREATED":
            return <span className="text-muted" style={{ fontWeight: "600" }}>Awaiting {role?.toLowerCase() === "admin" ? "Admin Dispatch" : "Dealer Dispatch"}</span>;
        case "DISPATCHED":
            return <span className="text-muted" style={{ fontWeight: "600" }}>Awaiting Customer Confirmation</span>;
        case "RECEIVED_BY_CUSTOMER":
            return <span className="text-muted" style={{ fontWeight: "600" }}>Product Received By Customer</span>;
        case "RETURNED_BY_CUSTOMER":
            return <span className="text-muted" style={{ fontWeight: "600" }}>Product Returned By Customer</span>;
        case "COMPLETED":
            return <span className="text-muted" style={{ fontWeight: "600" }}>Process Completed</span>;
        default:
            return <span className="text-muted" style={{ fontWeight: "600" }}>Unknown</span>;
    }
}

export const getPoStatusBadge = (status, poDetails = {}) => {
    const badgeBase = "badge badge-pill";

    // Handle status with optional PO details for more granular statuses
    switch (status) {
        case 1: // Pending
            return <span className={`${badgeBase} bg-warning`}>Pending</span>;
        case 2: // Approved
            // Check nested statuses if status is 2 (Approved)
            return <span className={`${badgeBase} bg-info`}>Admin Invoice Pending</span>;
        case 3: // Rejected
            return <span className={`${badgeBase} bg-danger`}>Rejected</span>;
        // These cases are redundant if status 2 handles all substatuses, but included for completeness
        case 4: // Company Invoice Pending
            return <span className={`${badgeBase} bg-primary`}>Company Invoice Pending</span>;

        case 5: // Dispatch Details Pending
            return <span className={`${badgeBase} bg-secondary`}>Dispatch Details Pending</span>;

        case 6: // Receive Pending
            return <span className={`${badgeBase} bg-warning`}>Receive Pending</span>;

        case 7: // Completed
            return <span className={`${badgeBase} bg-success`}>Completed</span>;

        default:
            return <span className={`${badgeBase} bg-secondary`}>Unknown</span>;
    }
};