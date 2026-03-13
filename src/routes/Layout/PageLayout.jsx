import React from 'react'
import { Outlet } from 'react-router'

const PageLayout = () => {
    return (
        <div className="page-wrapper">
            <div className="content">
                <Outlet />
            </div>
        </div>
    )
}

export default PageLayout