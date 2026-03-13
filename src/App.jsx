import React from 'react'
import AdminRoute from './routes/AdminRoute'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeRoutes from './routes/HomeRoutes';
import DealerRoute from './routes/DealerRoute';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css';
import CompanyRoute from './routes/CompanyRoute';
import CustomerRoute from './routes/CustomerRoute';

const App = () => {
  return (
    <>
      <HomeRoutes />
      <DealerRoute />
      <CompanyRoute />
      <AdminRoute />
      <CustomerRoute />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        // pauseOnFocusLoss
        draggable
      // pauseOnHover
      />
    </>
  )
}

export default App