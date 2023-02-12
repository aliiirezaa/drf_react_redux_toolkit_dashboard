import React, { useState, useEffect } from 'react'
import {Link, useNavigate} from "react-router-dom"
import { UilUser, UilAt, UilMobileVibrate, UilKeyholeSquare } from '@iconscout/react-unicons'
import './authy.css'
import { register, reset } from '../../features/authy/AuthSlice'
import {useSelector, useDispatch} from 'react-redux'

const Register = () => {
  const {isLoading, isSuucess, isError, message, request_id} = useSelector((state)=> state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(()=>{
    document.title = 'ثبت نام'

  },[])

  useEffect(()=>{
    if(isSuucess && request_id){
      navigate(`/verify/${phone}/${request_id}`)
      dispatch(reset())
    }
  },[isSuucess])

  useEffect(()=>{
    if(isError){
      setTimeout(()=>dispatch(reset()),3000)
    }
  },[isError])
  const [userData, setUserData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    re_password: "",
    admin:false,
    employee:false,
  })

  useEffect(()=>{
    validateData()
  
  },[userData])

  const { username, first_name, last_name, email, phone, password, re_password, admin, employee, is_required} = userData

  const [error, setError] = useState({
    username:[],
    first_name:[],
    last_name: [],
    email: [],
    phone: [],
    password:[],
    re_password: [],
    is_required: []
  })

  const [valid, setValid] = useState({
    username:false,
    first_name:false,
    last_name: false,
    email: false,
    phone: false,
    password:false,
    re_password: false,
    is_required: true
  })

  const validateData = () => {
    const errorData = {} 
    errorData['username'] = []
    if(!username) errorData['username'].push(' نام کاربری نباید خالی باشد')

    errorData['email'] = []
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if(!email) errorData['email'].push('ایمیل نباید خالی باشد')
    if(!emailRegex.test(email)) errorData['email'].push("ایمیل موردنظر صحیح نمیباشد")

    errorData['phone'] = []
    const phoneRegex = /09\d{9}/
    if(!phone) errorData['phone'].push('شماره همراه نباید خالی باشد')
    if(!phoneRegex.test(phone)) errorData['phone'].push('شماره موردنظر صحیح نمیباشد')
    if(phone.length !== 11)errorData['phone'].push('شماره موردنظر باید 11 کاراکتر باشد')

    errorData['first_name'] = []
    const userRegex = /^[a-zA-Z]+$/
    if(!first_name) errorData['first_name'].push('اسم نباید خالی باشد')
    if(!userRegex.test(first_name)) errorData['first_name'].push("اسم موردنظر صحیح نمیباشد")

    errorData['last_name'] = []
    if(!first_name) errorData['last_name'].push('نام خانوادگی نباید خالی باشد')
    if(!userRegex.test(last_name)) errorData['last_name'].push("نام خانوادگی موردنظر صحیح نمیباشد")

    errorData['password'] = []
    const passwordRegex  = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,12}$/
    if(!password) errorData['password'].push('گذرواژه نباید خالی باشد')
    if(!passwordRegex.test(password)) errorData['password'].push("گذرواژه باید شامل حداقل یک حرف کوچک و برزگ لاتین و عدد و بین 6 تا 12 کاراکتر یاشد")

    errorData['re_password'] = []
    if(!re_password) errorData['re_password'].push('  تکرار گذرواژه نباید خالی باشد')
    if(!passwordRegex.test(re_password)) errorData['re_password'].push("گذرواژه باید شامل حداقل یک حرف کوچک و برزگ لاتین و عدد و بین 6 تا 12 کاراکتر یاشد")
    if(re_password !== password) errorData['re_password'].push("گذرواژها با هم مطابقت نداردند")
    
    setError(errorData)

    }

  const isValid = () =>{
    let status = true 
    for(const item in error){
      if(error[item].length > 0) status = false  
    }
    return status
  }
  const onBlur = (e) => {
   
    setValid({...valid, [e.target.name]: true})
    validateData()
  }

  const onSubmit = (e) => {
      
    e.preventDefault()
    const validationData = valid 
    Object.keys(validationData).forEach(key => {
      validationData[key] = true
    })
    setValid(validationData)
    validateData()
 
    if(isValid()){
    console.log(' ',userData )
    dispatch(register(userData))
    }
  }
  const onChecked = (e) => {
    let status = userData[e.target.name]
    setUserData({...userData, [e.target.name]:!status})
  }
  const onchange = (e) => setUserData({...userData, [e.target.name]:e.target.value})
  return (
    <div className="form-container mt-4 mb-8 flex justify-center items-center w-full h-screen signup">
      <div className="form-content">
        <div className="form">
        <div className="header">
          <h1>ثبت نام</h1>
        </div>
        <div className="form-list">
        {isError && message ? (<div className="error text-white bg-red-700 p-2 mt-2 mb-2"><p>{message}</p></div>):null}
          <div className="errors grid grid-cols-2 gap-3 mt-3">
            {Object.keys(error).map((item, index) =>{
                
                if(valid[item] && error[item].length > 0){
                  return <div key={index} className="error text-red-700"><p>{error[item][0]}</p></div>
                }
            }) }
          </div>
          <form  method='post' onSubmit={onSubmit}>

            <ul>
              {/**** USERNAME *****/}
              <li className="item">
                <input type="text" name="username" id="username" onChange={onchange} value={username} onBlur={onBlur}  className={ username ? "check":null}/>
                <span className="icon"><UilUser size={14} /></span>
                <span className="title">نام کاربری</span>
              </li>
              {/**** FIRST NAME *****/}
              <li className="item">
                <input type="text" name="first_name" id="first_name" onChange={onchange} value={first_name} onBlur={onBlur}  className={ first_name ? "check":null}/>
                <span className="icon"><UilUser size={14} /></span>
                <span className="title">نام</span>
              </li>
              {/**** LAST NAME *****/}
              <li className="item">
                <input type="text" name="last_name" id="last_name" onChange={onchange} value={last_name} onBlur={onBlur}  className={ last_name ? "check":null}/>
                <span className="icon"><UilUser size={14} /></span>
                <span className="title">نام خانوادگی</span>
              </li>
              {/**** E_MAIL *****/}
              <li className="item">
                <input type="text" name="email" id="email" onChange={onchange} value={email} onBlur={onBlur}  className={ email ? "check":null}/>
                <span className="icon"><UilAt size={14} /></span>
                <span className="title">ایمیل</span>
              </li>
              {/**** PHONE *****/}
              <li className="item">
                <input type="text" name="phone" id="phone"  onChange={onchange} value={phone} onBlur={onBlur} className={phone ? "check":null}/>
                <span className="icon"><UilMobileVibrate size={14} /></span>
                <span className="title">تلفن همراه</span>
              </li>
              {/**** PASSWORD *****/}
              <li className="item">
                <input type="password" name="password" id="password"  onChange={onchange} value={password} onBlur={onBlur} className={ password? "check":null}/>
                <span className="icon"><UilKeyholeSquare size={14} /></span>
                <span className="title">گذرواژه</span>
              </li>
              {/**** CONFIRM PASSWORD *****/}
              <li className="item">
                <input type="password" name="re_password" id="re_password" onChange={onchange} value={re_password} onBlur={onBlur}  className={ re_password? "check":null}/>
                <span className="icon"><UilKeyholeSquare size={14} /></span>
                <span className="title">تکرار گذرواژه</span>
              </li>

            </ul>
            <div className="roles">
              <div className="role">
                <div className="title"><h3>ادمین</h3></div>
                <div className="box">
                
                  <div className={admin ? "check":null}><input type="checkbox" name="admin" id="admin" onClick={onChecked} /></div>
                </div>
              </div>
              <div className="role">
                <div className="title"><h3>کارمند</h3></div>
                <div className="box">
                  <div className={employee ? "check":null}> <input type="checkbox" name="employee" id="employee" onClick={onChecked} /></div>
                </div>
              </div>
            </div>
            <button type="submit">ثبت نام</button>

          </form>
        </div>
        <div className="details">
            <Link to="/login">حسابی دارید وارد شوید</Link>
          
        </div>
        </div>
      </div>
    </div>
  )
}

export default Register
