import React from 'react'
import { Outlet } from 'react-router'

const AdminLoginLayout = () => {
    return (
        <>
            <div className="main-wrapper">
                <Outlet />
            </div>
        </>
    )
}

export default AdminLoginLayout