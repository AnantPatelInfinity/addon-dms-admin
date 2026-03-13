import { Route, Routes } from 'react-router'
import HOME_URLS from '../config/routesFile/index.routes'
import LoginPage from '../pages/home/loginPages/LoginPage'

const HomeRoutes = () => {
    return (
        <>
            <Routes>
                <Route path={HOME_URLS.HOME} element={<LoginPage />} />
            </Routes>
        </>
    )
}

export default HomeRoutes