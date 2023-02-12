import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import loading from './json/loading.json'
import Status from '../../components/status/Status'
import TopHeader from '../../components/dashboard/TopHeader'
import { UilUserMd, UilMobileAndroidAlt, UilEnvelopeMinus, UilCheck, UilAngleDown, UilUserTimes  } from '@iconscout/react-unicons'
import './profile.css'
import userAxiosPrivate from '../../hooks/userAxiosPrivate'

function UserDetail() {
  const [open, setOpen] = useState(false)
  const axiosPrivate = userAxiosPrivate()
  const {phoneParams} = useParams()
  const [isLoading, setLoading] = useState(true)
  const [isError, setError] = useState("")
  const [picture, setPicture] = useState("")

  const ready = useRef(true)
  const thumbnail = useRef(null)
  const selectOptions = useRef(null)

  const [userData, setUserData] = useState({
    image:"",
    username: "",
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    roles:""
  })
  const [userInfo, setUserInfo] = useState({
    image:"",
    username: "",
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    roles:""
  })

  const fetchUser = async(phone) => {
    try{
      const response = await axiosPrivate.get(`user/${phone}/`)
      const user = response.data
      if(user) {

        setUserData({
          image:user.image || "",
          username: user.username || "",
          email: user.email || "",
          phone: user.phone || "",
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          roles:user.roles || []
        })  
        setUserInfo({
          image:user.image || "",
          username: user.username || "",
          email: user.email || "",
          phone: user.phone || "",
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          roles:user.roles || []
        }) 
       setLoading(false)
      }
      return user
      
    }
    catch(error){
      let message = ""
        if (error?.response?.status == 500) {
            message = "خطایی در بخش سرور اتفاق افتاده است"
        }
        else if (error?.response?.status == 400) {
            message = error?.response?.data?.message || error?.response?.data || error.toString()
        }
        else if (error?.response?.status == 401) {
            message = error?.response?.data?.message || error?.response?.data || error.toString()
        }
       return setError(message)
    }
  }

  const EditeUser = async(phone, userData) =>{
    try{

      const config = {
        headers:{
          "Content-Type":"multipart/form-data"
        }
      }
      const response = await axiosPrivate.put(`user/${phone}/`, userData, config)
      const user =response.data
      if(user) {
        setUserData({
          image:user.image || "",
          username: user.username || "",
          email: user.email || "",
          phone: user.phone || "",
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          roles:user.roles || []
        })  
        setUserInfo({
          image:user.image || "",
          username: user.username || "",
          email: user.email || "",
          phone: user.phone || "",
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          roles:user.roles || []
        }) 
       setLoading(false)
      }
      return user
    }
    catch(error){
      let message = ""
        if (error?.response?.status == 500) {
            message = "خطایی در بخش سرور اتفاق افتاده است"
        }
        else if (error?.response?.status == 400) {
            message = error?.response?.data?.message || error?.response?.data || error.toString()
        }
        else if (error?.response?.status == 401) {
            message = error?.response?.data?.message || error?.response?.data || error.toString()
        }
       
       return setError(message)
  }
}

  useEffect(() => {
    document.title = "جزئیات کاربر"
    if (ready.current) {
        ready.current = false
        phoneParams ? fetchUser(phoneParams) : null 
   
    }
   
  }, [phoneParams, EditeUser])





  const onClick = (e) => {
        e.target.classList.toggle('check')
        const parentElement = e.target.parentElement 
        const items = parentElement.querySelectorAll('.check')
        const rolesData = []
        for (let item of items){
            rolesData.push(item.dataset.name)
        }
        return setUserData({...userData, ['roles']:rolesData})
      
  }
  const onChange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value })

  const onClickSelectMenu = (e) => { setOpen(!open) }

  const fileShow = (e) => {
    const file = e.target.files[0]
    const type = file.type
    const validationData = ['image/png', 'image/jpg', 'image/jpeg']
    if(validationData.includes(type)){
      const fileReader = new FileReader() 
      fileReader.onload = (e) => {
        const fileURL = fileReader.result
      
        const imgTag = `<img src=${fileURL} alt=${phone}/>`
        const image = thumbnail.current.querySelector('img')
        if (image){
            image.src=fileURL
        }else{
          thumbnail.current.innerHTML += imgTag
        }
        
        setPicture(file)
      }
      fileReader.readAsDataURL(file)
    }
  }

  const getImage = () => {
    if(userData.image) {
      return( <img src={`http://127.0.0.1:8000${userData.image}`} alt={userData.phone}/>)
    }
    else {
      return(< UilUserTimes  size="14" />)
    }
  }
  const onSubmitButton = () => {
    let editeData = {}
    if(userData.username !== userInfo.username)  editeData['username'] = userData.username
    if(userData.email !== userInfo.email)  editeData['email'] = userData.email
    if(userData.firstName !== userInfo.firstName)  editeData['first_name'] = userData.firstName
    if(userData.lastName !== userInfo.lastName)  editeData['last_name'] = userData.lastName
    if(userData.phone !== userInfo.phone)  editeData['phone'] = userData.phone
    if(picture){
      editeData['image'] = picture 

    }
    const roles = selectOptions.current.querySelectorAll('.check')
    if (roles.length > 0) {

      for(let role of roles){
          if(!userData.roles.includes(role)) editeData[role.dataset.name] = true
      }

    }
    else {
   
      editeData['admin'] = false
      editeData['employee'] = false
    }

    
    if(Object.keys(editeData).length > 0){
      setLoading(true)
       EditeUser(userData.phone, editeData)
   }
   
  }
  return (
    <div>
    
      <TopHeader title="جزئیات کاربر" url={`user/${phoneParams}`} />
  
      <div className='formgroup flex flex-col justify-center items-center w-full mt-4'>
        {isLoading && (<Status lotttieFile={loading} />)}
        {!isLoading && userData ? (
          <div className="profile-container py-10 px-12 mb-5 w-full ">
            <div className="thumbnail"><div className="img" ref={thumbnail}> <input type="file" onChange={fileShow} /> {getImage()}</div></div>
            <ul className="items-list flex flex-row flex-wrap">
              <li className="item">
                <input type="text" id="username" name="username" value={userData.username} onChange={onChange} className={userData.username.length ? 'check' : null} />
                <span className="user-icon"><UilUserMd size={18} className="icon" /></span>
                <span className="title">نام کاربری</span>
              </li>
              <li className="item">
                <input type="text" id="firstName" name="firstName" value={userData.firstName} onChange={onChange} className={userData.firstName ? 'check' : null} />
                <span className="user-icon"><UilUserMd size={18} className="icon" /></span>
                <span className="title">نام</span>
              </li>
              <li className="item">
                <input type="text" id="lastName" name="lastName" value={userData.lastName} onChange={onChange} className={userData.lastName ? 'check' : null} />
                <span className="user-icon"><UilUserMd size={18} className="icon" /></span>
                <span className="title">فامیلی</span>
              </li>
              <li className="item">
                <input type="text" id="phone" name="phone" value={userData.phone} onChange={onChange} className={userData.phone.length ? 'check' : null} />
                <span className="user-icon"><UilMobileAndroidAlt size={18} className="icon" /></span>
                <span className="title">تلفن</span>
              </li>
              <li className="item">
                <input type="text" id="email" name="email" value={userData.email} onChange={onChange} className={userData.email.length ? 'check' : null} />
                <span className="user-icon"><UilEnvelopeMinus size={18} className="icon" /></span>
                <span className="title">ایمیل</span>
              </li>
              <li className="item select-rols">
                <div className="role-container">
                  <div onClick={onClickSelectMenu} className={open ? 'header open' : 'header'}>
                    <span className='icon-role'><UilAngleDown size={18} className="icon" /></span>
                    <span className='title'>نقش</span>
                  </div>

                  <ul className="items-list" ref={selectOptions}>
                    <li className={userData.roles.includes('admin') ? 'item check' : 'item'} data-name="admin" onClick={onClick}>
                      <span className="check-icon"><UilCheck size={18} className="icon" /></span>
                      <span className="title" data-role="admin">ادمین</span>
                    </li>
                    <li className={userData.roles.includes('employee') ? 'item check' : 'item'} data-name="employee" onClick={onClick}>
                      <span className="check-icon"><UilCheck size={18} className="icon" /></span>
                      <span className="title" data-role="employee">کارمند</span>
                    </li>
                   
                  </ul>

                </div>
              </li>
            </ul>
            <div className="buttons">
              <button type="submit" id="submitButton" onClick={onSubmitButton}>ثبت</button>
              

            </div>
           
          </div>
        ) : null}



      </div>
    </div>
  )
}


export default UserDetail