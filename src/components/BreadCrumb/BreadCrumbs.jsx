import React from 'react'
import { Link, useLocation } from 'react-router'
import { ROLE_DASHBOARD } from '../../config/DataFile'

const BreadCrumbs = ({ crumbs = [] }) => {


    const location = useLocation();
    const role = location.pathname.split("/")[1];

    const dashboardLink = ROLE_DASHBOARD[role];

    return (
        <div className="page-header">
            <div className="row align-items-center">
                <div className="col-12">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            {dashboardLink && (
                                <li className="breadcrumb-item">
                                    <Link to={dashboardLink}>Dashboard</Link>
                                </li>
                            )}
                            {crumbs?.map((crumb, idx) => (
                                <li
                                    key={idx}
                                    className={`breadcrumb-item ${idx === crumbs.length - 1 ? "active" : ""}`}
                                    aria-current={idx === crumbs.length - 1 ? "page" : undefined}
                                >
                                    {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : crumb.label}
                                </li>
                            ))}
                        </ol>
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default BreadCrumbs
