import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { changePassword, reset } from '../../features/authy/AuthSlice'
import userAxiosPrivate from '../../hooks/userAxiosPrivate'
import { UilKeyholeSquare } from '@iconscout/react-unicons'
import './authy.css'


const ChnagePassword = () => {
    const AxiosPrivate = userAxiosPrivate()
    const {isLoading, isSuucess, isError, message} = useSelector((state)=>state.user)
    const dispatch = useDispatch()
    const loacation = useLocation()
    const navigate = useNavigate()
    const from = loacation?.state?.from?.pathname || '/profile'

    useEffect(() => {
       if(isSuucess){
        setTimeout(()=>{
            dispatch(reset())
            navigate(from, {replace:true})
        },3000)
       }
    }, [isSuucess])

    useEffect(() => {
        if(isError){
            setTimeout(()=>{
                dispatch(reset())
               
            },3000)
           }
    }, [isError])

    useEffect(() => {
        document.title = 'تغییر گذرواژه'
    }, [])

    const [userData, setUserData] = useState({
        password: "",
        re_password: ""
    })

    const { password, re_password } = userData
    const [error, setError] = useState({
        password: [],
        re_password: [],
    })

    const [valid, setValid] = useState({

        password: false,
        re_password: false,

    })

    const validateData = () => {
        const errorData = {}
        errorData['password'] = []
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,12}$/
        if (!password) errorData['password'].push('گذرواژه نباید خالی باشد')
        if (!passwordRegex.test(password)) errorData['password'].push("گذرواژه باید شامل حداقل یک حرف کوچک و برزگ لاتین و عدد و بین 6 تا 12 کاراکتر یاشد")

        errorData['re_password'] = []
        if (!re_password) errorData['re_password'].push('  تکرار گذرواژه نباید خالی باشد')
        if (!passwordRegex.test(re_password)) errorData['re_password'].push("گذرواژه باید شامل حداقل یک حرف کوچک و برزگ لاتین و عدد و بین 6 تا 12 کاراکتر یاشد")
        if (re_password !== password) errorData['re_password'].push("گذرواژها با هم مطابقت نداردند")

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

    const onSubmit = (e) => {

        e.preventDefault()
        const validationData = valid
        Object.keys(validationData).forEach(key => {
            validationData[key] = true
        })
        setValid(validationData)
        validateData()

        if (isValid()) {
            console.log(' userData', userData)
            dispatch(reset())
            dispatch(changePassword({AxiosPrivate, userData}))

        }
    }

    const onchange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value })
    return (
        <div className="form-container mt-4 mb-8 flex justify-center items-center w-full h-screen">
            <div className="form-content">
                <div className="form">
                    <div className="header">
                        <h1>تغییر گذرواژه </h1>
                    </div>
                    <div className="form-list">
                    { !isLoading && isError && message ? (<div className="error text-white bg-red-700 p-2 mt-2 mb-2"><p>{message}</p></div>):null}
                    { !isLoading && isSuucess && message ? (<div className="error text-white bg-green-700 p-2 mt-2 mb-2"><p>{message}</p></div>):null}
                        <div className="errors grid grid-cols-2 gap-3 mt-3">
                            {Object.keys(error).map((item, index) => {

                                if (valid[item] && error[item].length > 0) {
                                    return <div key={index} className="error text-red-700"><p>{error[item][0]}</p></div>
                                }
                            })}
                        </div>
                        <form method='post' onSubmit={onSubmit}>

                            <ul>

                                {/**** PASSWORD *****/}
                                <li className="item">
                                    <input type="password" name="password" id="password" onChange={onchange} value={password} className={password ? "check" : null} onBlur={onBlur} />
                                    <span className="icon"><UilKeyholeSquare size={14} /></span>
                                    <span className="title">گذرواژه</span>
                                </li>
                                {/**** CONFIRM PASSWORD *****/}
                                <li className="item">
                                    <input type="password" name="re_password" id="re_password" onChange={onchange} value={re_password} className={re_password ? "check" : null} onBlur={onBlur} />
                                    <span className="icon"><UilKeyholeSquare size={14} /></span>
                                    <span className="title">تکرار گذرواژه</span>
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

export default ChnagePassword
