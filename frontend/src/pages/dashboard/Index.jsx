import React from 'react'
import { Outlet } from 'react-router-dom'

import Sidebar from '../../components/dashboard/Sidebar'

import Category from '../../components/dashboard/Category'

import './dashboard.css'

function Dashboard() {
 
  return (
    <div className='dashborad '>
      <Category/>
      <Outlet/>
      <Sidebar/>
    </div>
  )
}

export default Dashboard
