import { Routes, Route, Outlet } from 'react-router-dom'
import routeConfig, { type TRouteConfig } from './routeConfig'
import LayoutApp from '../components/Layout'
import Login from '../pages/auth/login'
import Register from '../pages/auth/register'
import ForgotPassword from '../pages/auth/forgotPassword'
import ResetPassword from '../pages/auth/resetPassword'
import Manager from '../pages/manager'

function RouteApp() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/manager" element={<Manager />} />


      {routeConfig.map(({ path, Element, ...args }: TRouteConfig, index: number) => (
        <Route
          path={path}
          key={index} 
          element={
            // <ProtectedRoute keyName={key}>
            <>
              <LayoutApp>
                  <Element />
                </LayoutApp>
                <Outlet />
            </>
                
            // </ProtectedRoute>
          }
          action={args.action}
          loader={args.action}
        />
      ))}
    </Routes>
  )
}

export default RouteApp
