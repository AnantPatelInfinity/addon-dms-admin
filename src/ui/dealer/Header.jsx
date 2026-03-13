import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router';
import DEALER_URLS from '../../config/routesFile/dealer.routes';
import { ClearDealerStorage, getDealerStorage } from '../../components/LocalStorage/DealerStorage';
import HOME_URLS from '../../config/routesFile/index.routes';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { getDealerCart } from '../../middleware/cart/cart';

const Header = ({ toggleMobileSidebar }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { cartList } = useSelector((state) => state.cart);
    const dealerStorage = getDealerStorage();
    const [profileImage, setProfileImage] = useState(dealerStorage.DX_DL_IMG);

    useEffect(() => {
        const formData = new URLSearchParams();
        formData.append("dealerId", dealerStorage.DL_ID);
        dispatch(getDealerCart(formData))
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const img = localStorage.getItem("DX_DL_IMG");
            setProfileImage(prev => (prev !== img ? img : prev));
        }, 1000); // or use a better mechanism below

        return () => clearInterval(interval);
    }, []);

    const totalQuantity = cartList[0]?.products?.reduce((total, product) => total + product.quantity, 0) || 0;

    const toggleButton = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        ClearDealerStorage();
        navigate(HOME_URLS.HOME);
        toast.success("You’re now logged out.Have a great day!")
    }

    return (
        <div className="header">
            <div className={`header-left ${isSidebarOpen ? "active" : ""}`}>
                <Link to={DEALER_URLS.DASHBOARD} className="logo logo-normal">
                    {/* <img src="/assets/img/logo-svg.svg" alt="Logo" /> */}
                    <img src={profileImage || "/assets/img/default.jpg"} alt="Logo" style={{ width: "80px" }} />
                </Link>
                <Link to={DEALER_URLS.DASHBOARD} className="logo-small">
                    <img src="/assets/img/dx-small-logo.svg" alt="Logo" />
                </Link>
                <a id="toggle_btn" href="javascript:void(0);" onClick={toggleButton} className={`${isSidebarOpen ? "active" : ""}`}>
                    <i className="ti ti-arrow-bar-to-left" />
                </a>
            </div>
            <Link
                // id="mobile_btn"
                className="mobile_btn"
                // to="javascript:void(0);"
                onClick={toggleMobileSidebar}>
                <span className="bar-icon">
                    <span />
                    <span />
                    <span />
                </span>
            </Link>
            <div className="header-user">
                <ul className="nav user-menu">
                    <li className="nav-item nav-item-email nav-item-box">
                        <Link to={DEALER_URLS.CART_LIST}>
                            <i className="fa-solid fa-cart-shopping"></i>
                            <span className="badge rounded-pill">
                                {totalQuantity > 9 ? "9+" : totalQuantity}
                            </span>
                        </Link>
                    </li>

                    {/* <li className="nav-item nav-list">
                        <ul className="nav">
                            <FullScreen />
                            <DarkMode />
                        </ul>
                    </li> */}
                    <li className="nav-item dropdown has-arrow main-drop">
                        <a
                            href="javascript:void(0);"
                            className="nav-link userset"
                            data-bs-toggle="dropdown"
                        >
                            <span className="user-info">
                                <span className="user-letter">
                                    <img
                                        src={profileImage || "/assets/img/default.jpg"}
                                        alt="Profile"
                                        style={{ width: "35px", height: "35px", borderRadius: "9px", objectFit: "contain" }}
                                    />
                                </span>
                                <span className="badge badge-success rounded-pill" />
                            </span>
                        </a>
                        <div className="dropdown-menu menu-drop-user">
                            <div className="profilename">
                                <Link className="dropdown-item" to={DEALER_URLS.DE_PROFILE}>
                                    <i className="ti ti-user-pin" /> My Profile
                                </Link>
                                <button type='button' className="dropdown-item" onClick={handleLogout}>
                                    <i className="ti ti-lock" /> Logout
                                </button>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="dropdown mobile-user-menu">
                <a
                    href="javascript:void(0);"
                    className="nav-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <i className="fa fa-ellipsis-v" />
                </a>
                <div className="dropdown-menu">
                    <Link className="dropdown-item" to={DEALER_URLS.DE_PROFILE}>
                        <i className="ti ti-user-pin" /> My Profile
                    </Link>
                    <Link className='dropdown-item' to={DEALER_URLS.CART_LIST}>
                        <i className="ti ti-user-pin" /> My Cart
                    </Link>
                    <Link
                        to="#"
                        className="dropdown-item"
                        onClick={e => { e.preventDefault(); handleLogout(); }}
                    >
                        <i className="ti ti-lock" /> Logout
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Header