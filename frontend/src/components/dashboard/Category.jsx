import React, {useRef, useEffect}from 'react'
import { UilUserCircle, UilBars, UilSun, UilMoon } from '@iconscout/react-unicons'
import ProgramData from './ProgramData'
import {changeThem} from '../../features/them/themSlice'
import { useDispatch, useSelector } from 'react-redux'
import { mode } from '../../features/them/themSlice'


import './css/category.css'

function Category() {
  const dispatch = useDispatch()
  const toggleBtn = useRef(null)
  const hamburgerMenu = useRef(null)
  const modeActive = useSelector(mode)
  const {userInfo} = useSelector(state => state.user)
  useEffect(()=>{
    const darkMode = toggleBtn.current.querySelector('.moon')
    const lightMode = toggleBtn.current.querySelector('.light')
    const sidebar = document.querySelector('.sidebar')
    hamburgerMenu.current.addEventListener('click', () => {
      sidebar.style.right = 0
    })
    darkMode.addEventListener('click', (e)=>{
      darkMode.classList.add('active')
      lightMode.classList.remove('active')
      dispatch(changeThem('dark'))
    })
    lightMode.addEventListener('click', (e)=>{
      darkMode.classList.remove('active')
      lightMode.classList.add('active')
      dispatch(changeThem('light'))
    })
  
  },[])

  return (
    <div className="category mt-8 px-2">
      <div className="top flex justify-between items-center">
        <div className="them">
          <span className='flex flex-row gap-3' ref={toggleBtn} >
            <UilSun className={modeActive == 'light'? 'light active':'light'} />
            <UilMoon className={modeActive == 'dark'? 'moon active':'moon'} />
          </span>
        </div>
     
        <div className="user flex gap-2 justify-center items-center">
          {userInfo?.first_name || userInfo?.username ? (
            <h3> سلام <span className='text-cyan-500' > {userInfo.first_name || userInfo.username} </span></h3>
          ): null}
          
          <span className="userpicture">
            {userInfo?.image ? (<img src={`http://127.0.0.1:8000/${userInfo.image}`} alt={userInfo.username} width="50" height="50"/>):null }

          </span>
        </div>
        <div className="hamburger-menu hidden" ref={hamburgerMenu}>
          <span ><UilBars /></span>
        </div>

      </div>
      <ProgramData/>
    </div>
  )
}

export default Category