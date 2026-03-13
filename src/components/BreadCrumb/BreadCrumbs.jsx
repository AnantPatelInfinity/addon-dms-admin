import React from 'react'
import { Link } from 'react-router'
import ADMIN_URLS from '../../config/routesFile/admin.routes'
import CUSTOMER_URLS from '../../config/routesFile/customer.routes'
import DEALER_URLS from '../../config/routesFile/dealer.routes'
import COMPANY_URLS from '../../config/routesFile/company.routes'
import { getCustomerStorage } from '../LocalStorage/CustomerStorage'

const BreadCrumbs = ({ crumbs = [] }) => {

    const role = getCustomerStorage()

    return (
        <div className="page-header">
            <div className="row align-items-center">
                <div className="col-12">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                {role.DX_ROLE === "admin" ? (
                                    <Link to={ADMIN_URLS.DASHBOARD}>Dashboard</Link>
                                ) : role.DX_ROLE === "customer" ? (
                                    <Link to={CUSTOMER_URLS.DASHBOARD}>Dashboard</Link>
                                ) : role.DX_ROLE === "dealer" ? (
                                    <Link to={DEALER_URLS.DASHBOARD}>Dashboard</Link>
                                ) : role.DX_ROLE === "company" ? (
                                    <Link to={COMPANY_URLS.DASHBOARD}>Dashboard</Link>
                                ) : null
                                }
                            </li>
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
