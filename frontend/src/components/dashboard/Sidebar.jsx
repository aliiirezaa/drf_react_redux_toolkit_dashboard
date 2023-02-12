import React, { useRef, useEffect } from 'react'
import { UilUserArrows, UilFileMedical, UilTimes, UilDashboard, UilUser, UilSignin } from '@iconscout/react-unicons'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../../features/authy/AuthSlice'
import './css/sidebar.css'



function Sidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const closeBtn = useRef(null)
  const { userInfo, isSuucess, message } = useSelector((state) => state.user)
  useEffect(() => {
   
    closeBtn.current.addEventListener('click', (e) => {
      const sidebar = e.target.closest('.sidebar')
      sidebar.style.right = '-100%'
    })
  }, [])

  useEffect(() => {
    if(isSuucess && message == "logout"){
        dispatch(reset())
        navigate('/login')
    }
  }, [isSuucess])

const handelLogout = (e) => {
  e.preventDefault()
  if(window.confirm('آیا تمایل به خروج دارید ؟')){
    dispatch(reset())
    dispatch(logout())
  }
}

  return (
    <div className='sidebar text-right'>
      <div className="top flex justify-end content-center my-3 px-2">
        <span className='cursor-pointer text-zinc-800 hidden' ref={closeBtn}><UilTimes /></span>
        <h2 className="logo text-2xl">وبلاگی</h2>
      </div>
      <div className="sidebar-menu flex flex-col mt-8">
        <NavLink to='/' >
          <span> <UilDashboard /></span>
          <h3>داشبورد</h3>
        </NavLink>

        <NavLink to='/users' >
          <span> <UilUserArrows /></span>
          <h3>کاربران</h3>
        </NavLink>

       

        <NavLink to='/profile' >
          <span> <UilUser /></span>
          <h3>پروفایل</h3>
        </NavLink>
      

        {userInfo  ? (
          <button type="button" className="logout flex justify-end mr-9 mt-3" onClick={handelLogout} >
            <span className='mr-2'> <UilSignin /></span>
            <h3>خروج</h3>
          </button>
        ) : (
          <>
            <NavLink to='/login' >
              <span> <UilSignin /></span>
              <h3>ورود</h3>
            </NavLink>
            <NavLink to='/register' >
              <span> <UilSignin /></span>
              <h3>ثبت نام</h3>
            </NavLink>
          </>
        )}




      </div>
    </div>
  )
}

export default Sidebar