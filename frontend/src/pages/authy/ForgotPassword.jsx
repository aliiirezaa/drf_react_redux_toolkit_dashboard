import React, { useState, useEffect } from 'react'
import {  UilAt } from '@iconscout/react-unicons'
import { useDispatch, useSelector } from 'react-redux'
import { sendPasswordResetEmail, reset } from '../../features/authy/AuthSlice'
import './authy.css'

const ForgotPassword = () => {

  const {isLoading, isSuucess, isError, message} = useSelector((state)=>state.user)
  const dispatch = useDispatch()
 

    useEffect(() => {
        document.title = 'فراموشی گذرواژه'
    }, [])

    useEffect(()=>{
      if(isSuucess){
        setTimeout(()=>{dispatch(reset())},3000)
       
      }
    },[isSuucess])

    useEffect(()=>{
      if(isError){
        setTimeout(()=>{
  
          dispatch(reset())},3000)
        setUserData({...userData, ['email']:""})
      }
    },[isError])

    const [userData, setUserData] = useState({
       email:""
    })

    const { email } = userData
    const [error, setError] = useState({
        email: []
      })
    
      const [valid, setValid] = useState({
        email: false,
      })
    
      const validateData = () => {
        const errorData = {} 
        errorData['email'] = []
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if(!email) errorData['email'].push('ایمیل نباید خالی باشد')
        if(!emailRegex.test(email)) errorData['email'].push("ایمیل موردنظر صحیح نمیباشد")
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
            console.log(' userData',userData )
            dispatch(reset())
            dispatch(sendPasswordResetEmail(userData))
        }
      }

    const onchange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value })
    return (
        <div className="form-container mt-4 mb-8 flex justify-center items-center w-full h-screen">
            <div className="form-content">
                <div className="form">
                    <div className="header">
                        <h1>فراموشی گذرواژه</h1>
                    </div>
                    <div className="form-list">
                      { isError && message ? (<div className="error text-white bg-red-700 p-2 mt-2 mb-2"><p>{message}</p></div>):null}
                      { isSuucess && message ? (<div className="error text-white bg-green-700 p-2 mt-2 mb-2"><p>{message}</p></div>):null}
                    <div className="errors grid grid-cols-2 gap-3 mt-3">
                        {Object.keys(error).map((item, index) =>{
                            
                            if(valid[item] && error[item].length > 0){
                            return <div key={index} className="error text-red-700"><p>{error[item][0]}</p></div>
                            }
                        }) }
                    </div>
                        <form method="post" onSubmit={onSubmit}>

                            <ul>

                                {/**** E_MAIL *****/}
                                <li className="item">
                                    <input type="text" name="email" id="email" onChange={onchange} value={email} className={email ? "check" : null} onBlur={onBlur} />
                                    <span className="icon"><UilAt size={14} /></span>
                                    <span className="title">ایمیل</span>
                                </li>

                            </ul>
                            <button type="submit">ورود</button>

                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
