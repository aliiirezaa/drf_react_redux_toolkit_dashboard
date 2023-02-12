import React ,{useEffect}from 'react'
import Pagination from './Pagination'
import TopHeader from './TopHeader'
import { UilUsersAlt, UilComment, UilEye } from '@iconscout/react-unicons'
import './css/main.css'



function Main() {

  useEffect(()=>{

  },[])
  return (
    <div className='main'>
      <TopHeader title='داشبورد' url='/'/>
     
      <div className="inside grid gap-2 grid-cols-3 mt-10">
        {/* total users */}
        <div className="total-users bg-orange-600">
          <div className="box-container">
            <h3>کاربران</h3>
            <div className="box-content">
              <span><UilUsersAlt size="45"/></span>
              <h2>22</h2>
            </div>
          </div>
        </div>
        {/* total messages */}
        <div className="total-messages bg-lime-500">
          <div className="box-container">
            <h3>پیام </h3>
            <div className="box-content">
              <span><UilComment size="45"/></span>
              <h2>33</h2>
            </div>
          </div>
        </div>
        {/* total hits */}
        <div className="total-hits bg-cyan-500">
          <div className="box-container">
            <h3>بازدید</h3>
            <div className="box-content">
              <span><UilEye size="45"/></span>
              <h2>11</h2>
            </div>
          </div>
        </div>

      </div>
      
    </div>
  )
}

export default Main