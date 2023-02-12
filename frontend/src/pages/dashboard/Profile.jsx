import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { profile, updateUser, reset } from '../../features/authy/AuthSlice'
import loading from './json/loading.json'
import Status from '../../components/status/Status'
import TopHeader from '../../components/dashboard/TopHeader'
import { UilUserMd, UilMobileAndroidAlt, UilEnvelopeMinus, UilCheck, UilAngleDown, UilUserTimes  } from '@iconscout/react-unicons'
import './profile.css'
import userAxiosPrivate from '../../hooks/userAxiosPrivate'

function Profile() {
  const [open, setOpen] = useState(false)
  const axiosPrivate = userAxiosPrivate()
  const { userInfo, isError, message, isSuucess, isLoading } = useSelector((state) => state.user)

  const ready = useRef(true)
  const thumbnail = useRef(null)
  const selectOptions = useRef(null)
  const dispatch = useDispatch()

  useEffect(() => {
    document.title = "پروفایل"
    if (ready.current) {
      ready.current = false
     
      dispatch(profile(axiosPrivate))
    }
   
  }, [])

  useEffect(() => {
    if (isSuucess && userInfo) {
      dispatch(reset())
      setUserData({
        image:userInfo.image,
        username: userInfo.username,
        email: userInfo.email,
        phone: userInfo.phone,
        firstName: userInfo.first_name,
        lastName: userInfo.last_name,
        roles:userInfo.roles
      })
    }
  }, [isSuucess, userInfo])

  const [userData, setUserData] = useState({
    image:"",
    username: "",
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    roles:""
  })
  const [picture, setPicture] = useState("")
  const { username, email, phone, firstName, lastName, image, roles } = userData

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
      
        const imgTag = `<img src=${fileURL} alt=${username}/>`
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
    if(image) {
      return( <img src={`http://127.0.0.1:8000${image}`} alt={username}/>)
    }
    else {
      return(< UilUserTimes  size="14" />)
    }
  }
  const onSubmitButton = () => {
    let updateItem = {}
    if(picture){
      if(picture !== userInfo.image) updateItem['image'] = picture
    }
    if(username !== userInfo.username) updateItem['username'] = username
    if(firstName !== userInfo.first_name) updateItem['first_name'] = firstName
    if(lastName !== userInfo.last_name) updateItem['last_name'] = lastName
    if(email !== userInfo.email) updateItem['email'] = email
    if(phone !== userInfo.phone) updateItem['phone'] = phone
    
    const roles = selectOptions.current.querySelectorAll('.check')
    if(roles.length>0){
        for(let role of roles){
          if(!userInfo.roles.includes(role)) updateItem[role.dataset.name] = true
        }

    }
    else {
      updateItem['admin'] = false
      updateItem['employee'] = false
    }
   

    Object.freeze(updateItem)

    if(Object.keys(updateItem).length >0){
        dispatch(reset())
        dispatch(updateUser({axiosPrivate, phone, updateItem}))
    }
  }
  return (
    <div>
      <TopHeader title="پروفایل" url="profile" />
      <div className='formgroup flex flex-col justify-center items-center w-full mt-4'>
        {isLoading && (<Status lotttieFile={loading} />)}
        {!isLoading && userInfo ? (
          <div className="profile-container py-10 px-12 mb-5 w-full ">
            <div className="thumbnail"><div className="img" ref={thumbnail}> <input type="file" onChange={fileShow} /> {getImage()}</div></div>
            <ul className="items-list flex flex-row flex-wrap">
              <li className="item">
                <input type="text" id="username" name="username" value={username} onChange={onChange} className={username.length ? 'check' : null} />
                <span className="user-icon"><UilUserMd size={18} className="icon" /></span>
                <span className="title">نام کاربری</span>
              </li>
              <li className="item">
                <input type="text" id="firstName" name="firstName" value={firstName} onChange={onChange} className={firstName ? 'check' : null} />
                <span className="user-icon"><UilUserMd size={18} className="icon" /></span>
                <span className="title">نام</span>
              </li>
              <li className="item">
                <input type="text" id="lastName" name="lastName" value={lastName} onChange={onChange} className={lastName ? 'check' : null} />
                <span className="user-icon"><UilUserMd size={18} className="icon" /></span>
                <span className="title">فامیلی</span>
              </li>
              <li className="item">
                <input type="text" id="phone" name="phone" value={phone} onChange={onChange} className={phone.length ? 'check' : null} />
                <span className="user-icon"><UilMobileAndroidAlt size={18} className="icon" /></span>
                <span className="title">تلفن</span>
              </li>
              <li className="item">
                <input type="text" id="email" name="email" value={email} onChange={onChange} className={email.length ? 'check' : null} />
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
                    <li className={roles.includes('admin') ? 'item check' : 'item'} data-name="admin" onClick={onClick}>
                      <span className="check-icon"><UilCheck size={18} className="icon" /></span>
                      <span className="title" data-role="admin">ادمین</span>
                    </li>
                    <li className={roles.includes('employee') ? 'item check' : 'item'} data-name="employee" onClick={onClick}>
                      <span className="check-icon"><UilCheck size={18} className="icon" /></span>
                      <span className="title" data-role="employee">کارمند</span>
                    </li>
                   
                  </ul>

                </div>
              </li>
            </ul>
            <div className="buttons">
              <button type="submit" id="submitButton" onClick={onSubmitButton}>ثبت</button>
              <button type="submit" id="changePasswordButton" ><Link to='/change-password'>تغییر گذرواژه</Link></button>

            </div>
           
          </div>
        ) : null}



      </div>
    </div>
  )
}

export default Profile