import React from 'react'
import { UseAuthStatus } from '../hooks/UseAuthStatus'
import { Navigate, Outlet } from 'react-router-dom'
import Spinner from './Spinner'
function PrivateRoute() {
    const {loggedIn, checkingStatus} = UseAuthStatus()
    if(checkingStatus){
        return <Spinner/>
    }
  return (
    loggedIn? <Outlet/> : <Navigate to='/sign-in'/>
  )
}

export default PrivateRoute
