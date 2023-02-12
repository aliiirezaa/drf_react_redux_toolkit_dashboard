import React from 'react'
import {useLocation, Navigate, Outlet} from 'react-router-dom'
import {useSelector} from 'react-redux'

const RequireAuth = () => {
  const {userInfo, access} = useSelector((state)=>state.user)
  return (
  
  )
}

export default RequireAuth