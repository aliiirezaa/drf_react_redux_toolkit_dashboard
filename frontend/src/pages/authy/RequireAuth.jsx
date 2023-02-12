import React from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const RequireAuth = ({allowRoles}) => {
    const {userInfo, access} = useSelector((state) => state.user)
    const location = useLocation()


   

  return (
  
        userInfo?.roles?.find(role => allowRoles.includes(role)) 
        ?   <Outlet />
        :access 
        ? <Navigate to="/unAthorize" state={{from:location}} replace={true} />
        : <Navigate to="/login" state={{from:location}} replace={true} />
   
  )
}

export default RequireAuth