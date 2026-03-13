import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getComDashboardData } from '../../../middleware/companyUser/companyDashboard/comDashboard'
import { getCompanyStorage } from '../../../components/LocalStorage/CompanyStorage'
import './DashboardModern.css'
import FastAction from '../../../components/Company/Dashboard/FastAction'
import SummaryCards from '../../../components/Company/Dashboard/SummaryCards'
import RecentActivity from '../../../components/Company/Dashboard/RecentActivity'
import DashHeader from '../../../components/Company/Dashboard/DashHeader'
import { getRoleFlags } from '../../../config/DataFile'

const Dashboard = () => {
    const dispatch = useDispatch();
    const companyStorage = getCompanyStorage();

    const userRole = localStorage.getItem('DX_ROLE');
    const roleFlags = getRoleFlags(userRole)
    const { isCompany, isGeneral, isServices, isAccounts, isInstallations } = roleFlags;

    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const {
        comDashboardData,
        comDashboardDataError,
        comDashboardDataLoading,
        comDashboardDataMessage
    } = useSelector((state) => state?.companyDashboard);

    const getDashboardData = (startDate = dateRange.startDate, endDate = dateRange.endDate) => {
        const payload = {
            startDate,
            endDate,
            companyId: companyStorage?.comId,
            firmId: companyStorage?.firmId
        };
        dispatch(getComDashboardData(payload));
        setLastUpdated(new Date());
    };

    useEffect(() => {
        getDashboardData();
    }, [companyStorage?.comId]);

    const { counts = {}, recentActivities = {}, fastActions = [], charts = {} } = comDashboardData || {};

    return (
        <>
            <DashHeader
                dateRange={dateRange}
                setDateRange={setDateRange}
                getDashboardData={getDashboardData}
                loading={comDashboardDataLoading}
                lastUpdated={lastUpdated}
                refreshData={() => getDashboardData(dateRange.startDate, dateRange.endDate)}
            />

            <FastAction role={userRole} fastActions={fastActions} />

            {(isCompany || isGeneral) && (
                <>
                    <SummaryCards counts={counts} charts={charts} role={userRole} />
                    <RecentActivity role={userRole} recentActivities={recentActivities} />
                </>
            )}

            {isServices && (
                <>
                    <SummaryCards counts={counts} charts={charts} role={userRole} />
                    <RecentActivity role={userRole} recentActivities={recentActivities} />
                </>
            )}

            {isAccounts && (
                <>
                    <SummaryCards counts={counts} charts={charts} role={userRole} />
                    <RecentActivity role={userRole} recentActivities={recentActivities} />
                </>
            )}

            {isInstallations && (
                <>
                    <SummaryCards counts={counts} charts={charts} role={userRole} />
                    <RecentActivity role={userRole} recentActivities={recentActivities} />
                </>
            )}
        </>
    )
}

export default Dashboard
