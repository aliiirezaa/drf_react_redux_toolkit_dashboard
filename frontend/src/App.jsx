import React, { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/dashboard/Dashboard'
import Userform from './pages/dashboard/Userform'
import Profile from './pages/dashboard/Profile'
import UserList from './pages/dashboard/UserList'
import Index from './pages/dashboard/Index'
import Login from './pages/authy/Login'
import Register from './pages/authy/Register'
import Verify from './pages/authy/Verify'
import ChangPassword from './pages/authy/ChangePassword'
import ResetPassword from './pages/authy/ResetPassword'
import ForgotPassword from './pages/authy/ForgotPassword'
import ParsistLogin from './pages/authy/ParsistLogin'
import RequireAuth from './pages/authy/RequireAuth'
import UserDetail from './pages/dashboard/UserDetail'
import UnAuthoriza from './pages/authy/UnAuthoriza'
import { mode } from './features/them/themSlice'
import { profile, reset } from './features/authy/AuthSlice'
import userAxiosPrivate from './hooks/userAxiosPrivate'
import { useSelector, useDispatch } from 'react-redux'

import './App.css'


function App() {
  const them = useSelector(mode)
  const ready = useRef(true)
  const dispatch = useDispatch()
  const AxiosPricate = userAxiosPrivate()
  const { userInfo} = useSelector((state) => state.user)

  useEffect(() => {
    if (ready.current) {
      ready.current = false
      if (!userInfo) {
        dispatch(reset())
        dispatch(profile(AxiosPricate))
      }
    }
  }, [])



  return (
    <div className={them} >
      <BrowserRouter>

        <Routes>
          <Route path='/' element={<Index />}>
            <Route index element={<Dashboard />} />
            <Route path="create-update-user" element={<Userform />} />
            <Route element={<ParsistLogin />}>
              <Route element={<RequireAuth allowRoles={["admin"]} />} >
                <Route path="users" element={<UserList />} />
              </Route>
            </Route>


            <Route element={<ParsistLogin />}>
              <Route element={<RequireAuth allowRoles={["admin"]} />} >
                <Route path="user/:phoneParams" element={<UserDetail />} />
              </Route>
            </Route>
            <Route element={<ParsistLogin />}>
              <Route path="profile" element={<Profile />} />
            </Route>


          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/verify/:phone/:requestId/' element={<Verify />} />
          <Route path='/change-password' element={<ChangPassword />} />
          <Route path='/user/reset/:uid/:token' element={<ResetPassword />} />
          <Route path='/forgot-password/' element={<ForgotPassword />} />
          <Route path='/unAthorize' element={<UnAuthoriza />} />
        </Routes>

      </BrowserRouter>
    </div>
  )
}

export default App
