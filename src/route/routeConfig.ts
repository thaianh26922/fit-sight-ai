import { match } from 'path-to-regexp'
import React from 'react'
import type { PathRouteProps } from 'react-router-dom'
import Profile from '../pages/Profile'
import FitSightSteps from '../components/FitSightSteps'
// import { PathRouteProps } from 'react-router-dom'

// Define a custom route configuration type
export interface TRouteConfig extends PathRouteProps {
  Element: React.FC // React component to render for the route
}
// Dashboard - Main dashboard page
// const Dashboard = lazyLoading(() => import('@pages/dashboard'))


// Define the route configurations
const routeConfig: TRouteConfig[] = [
  { path: '/', Element: FitSightSteps },
  { path: '/profile', Element: Profile },

  
]

export default routeConfig

export const isValidRoute = (redirectPath: string | null) => {
  if (!redirectPath) return false
  return routeConfig.some((route) => route.path && match(route.path, { decode: decodeURIComponent })(redirectPath))
}
