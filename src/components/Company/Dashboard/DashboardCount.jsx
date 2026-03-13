import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getComDashboardCount } from '../../../middleware/companyUser/companyDashboard/comDashboard';
import {
    ClipboardList,
    ClipboardCheck,
    Hammer,
    Settings,
    AlertCircle,
    Loader2
} from 'lucide-react';
import 'animate.css';
import COMPANY_URLS from '../../../config/routesFile/company.routes';
import { useNavigate } from 'react-router';

const DashboardCount = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { comDashCount, comDashCountError, comDashCountLoading } = useSelector((state) => state?.companyDashboard);

    useEffect(() => {
        dispatch(getComDashboardCount());
    }, []);

    const stats = [
        {
            title: 'Pending POs',
            value: comDashCount?.pendingPoCount || 0,
            icon: <ClipboardList className="w-6 h-6" />,
            link: COMPANY_URLS.PO_LIST
        },
        {
            title: 'Total POs',
            value: comDashCount?.totalPoCount || 0,
            icon: <ClipboardCheck className="w-6 h-6" />,
            link: COMPANY_URLS.PO_LIST
        },
        {
            title: 'Pending Installations',
            value: comDashCount?.pendingInstallationCount || 0,
            icon: <Hammer className="w-6 h-6" />,
            link: COMPANY_URLS.INSTALL_LIST
        },
        {
            title: 'Total Installations',
            value: comDashCount?.totalInstallationCount || 0,
            icon: <Settings className="w-6 h-6" />,
            link: COMPANY_URLS.INSTALL_LIST
        }
    ];

    const getGradientColor = (index) => {
        const gradients = [
            'linear-gradient(135deg, #e5251b 0%, #ff6a61 100%)',   // Red for Pending POs
            'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',   // Green for Total POs
            'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',   // Orange for Pending Installations
            'linear-gradient(135deg, #396afc 0%, #2948ff 100%)'    // Blue for Total Installations
        ];
        return gradients[index % gradients.length];
    };

    if (comDashCountLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                <Loader2 className="animate-spin me-2 text-secondary" size={32} />
                <span className="text-muted">Loading dashboard data...</span>
            </div>
        );
    }

    if (comDashCountError) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center bg-light p-4 rounded shadow-sm" style={{ height: '300px' }}>
                <AlertCircle className="text-danger mb-2" size={32} />
                <h5 className="text-danger">Error loading dashboard data</h5>
                <p className="text-muted">{comDashCountError.message || 'Unknown error occurred'}</p>
                <button
                    onClick={() => dispatch(getComDashboardCount())}
                    className="btn btn-outline-danger mt-3"
                >
                    Retry
                </button>
            </div>
        );
    }


    return (
        <div className="mt-4">
            <div className="row">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="col-12 col-sm-6 col-md-3 mb-4 animate__animated animate__fadeInUp"
                        style={{ animationDelay: `${index * 0.1}s`, animationDuration: '0.6s', cursor: 'pointer' }}
                        onClick={() => navigate(stat.link)}
                    >
                        <div
                            className="card text-white h-100 shadow-lg border-0"
                            style={{
                                background: getGradientColor(index),
                                transition: 'transform 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.03)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            <div className="card-body d-flex flex-column justify-content-center align-items-start p-3 gap-2">
                                <div className="d-flex align-items-center gap-3">
                                    <div
                                        className="p-2 rounded-circle d-flex align-items-center justify-content-center"
                                        style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                                    >
                                        {React.cloneElement(stat.icon, {
                                            className: 'text-dark'
                                        })}
                                    </div>
                                    <div>
                                        <div className="text-uppercase small" style={{ color: 'rgba(255,255,255,0.85)' }}>
                                            {stat.title}
                                        </div>
                                        <h4 className="fw-bold mb-0 text-white">{stat.value}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DashboardCount