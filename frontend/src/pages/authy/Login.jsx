import React, { useState, useEffect } from 'react'
import ReCAPTCHA from "react-google-recaptcha";
import { Link, useNavigate } from "react-router-dom"
import { UilMobileVibrate, UilKeyholeSquare } from '@iconscout/react-unicons'
import { login, reset } from '../../features/authy/AuthSlice'
import { useSelector, useDispatch } from 'react-redux'
import './authy.css'

const Login = () => {
  const { isLoading, isSuucess, isError, message, request_id } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    document.title = 'ورود'
  }, [])

  useEffect(() => {
    if (isSuucess && request_id) {
      navigate(`/verify/${phone}/${request_id}/`)
      dispatch(reset())

    }
  }, [isSuucess])
  useEffect(() => {

    if (isError) {
      setTimeout(() => dispatch(reset()), 3000)
      setUserData({
        phone: "",
        password: "",
      })
    }

  }, [isError])

  const [userData, setUserData] = useState({
    phone: "",
    password: "",
  })
  const [rechaptcha, setRecpatcha] = useState(false) 

  const { phone, password } = userData
  const [error, setError] = useState({

    phone: [],
    recaptcha:[],
  })

  const [valid, setValid] = useState({

    phone: false,
    recaptcha:false
  })

  useEffect(() => {
    validateData()
  }, [userData])

  const validateData = () => {
    const errorData = {}

    errorData['phone'] = []
    const phoneRegex = /09\d{9}/
    if (!phone) errorData['phone'].push('شماره همراه نباید خالی باشد')
    if (!phoneRegex.test(phone)) errorData['phone'].push('شماره موردنظر صحیح نمیباشد')
    if (phone.length !== 11) errorData['phone'].push('شماره موردنظر باید 11 کاراکتر باشد')

    errorData['recaptcha'] = []
    if(!rechaptcha) errorData['recaptcha'].push('من ربات نیستم رو کلیک کن')

    setError(errorData)

  }

  const isValid = () => {
    let status = true
    for (const item in error) {
      if (error[item].length > 0) status = false
    }
    return status
  }
  const onBlur = (e) => {

    setValid({ ...valid, [e.target.name]: true })
    validateData()
  }
  const onChangeRecaptcha = (response) => {
    if(response){
      setRecpatcha(true)
    }
  
  }
  const onSubmit = (e) => {

    e.preventDefault()
    const validationData = valid
    Object.keys(validationData).forEach(key => {
      validationData[key] = true
    })
    setValid(validationData)
    validateData()

    if (isValid()) {
   
        dispatch(login(userData))
    }
  }
  const onchange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value })
  return (
    <div className="form-container mt-4 mb-8 flex justify-center items-center w-full h-screen">
      <div className="form-content">
        <div className="form">
          <div className="header">
            <h1>ورود</h1>
          </div>
          <div className="form-list">
            {isError && message ? (<div className="error text-white bg-red-700 p-2 mt-2 mb-2"><p>{message}</p></div>) : null}
            <div className="errors grid grid-cols-2 gap-3 mt-3">

              {Object.keys(error).map((item, index) => {

                if (valid[item] && error[item].length > 0) {
                  return <div key={index} className="error text-red-700"><p>{error[item][0]}</p></div>
                }
              })}
            </div>
            <form method="post" onSubmit={onSubmit}>

              <ul>

                {/**** PHONE *****/}
                <li className="item">
                  <input type="text" name="phone" id="phone" onChange={onchange} value={phone} className={phone ? "check" : null} onBlur={onBlur} />
                  <span className="icon"><UilMobileVibrate size={14} /></span>
                  <span className="title">تلفن همراه</span>
                </li>
                {/**** PASSWORD *****/}
                <li className="item">
                  <input type="password" name="password" id="password" onChange={onchange} value={password} className={password ? "check" : null} onBlur={onBlur} />
                  <span className="icon"><UilKeyholeSquare size={14} /></span>
                  <span className="title">گذرواژه</span>
                </li>

              </ul>
              <ReCAPTCHA
                sitekey="6LdEkWckAAAAANhRCwGPmaaRMUS7C2fiQfkn8mmF"
                onChange={onChangeRecaptcha}
                hl = "fa"
              />
              <button type="submit">ورود</button>

            </form>
          </div>
          <div className="details">
            <Link to="/register">ثبت نام کنید</Link>
            <Link to="/forgot-password/">گذرواژه خود را فراموش کردم</Link>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
