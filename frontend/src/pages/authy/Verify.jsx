import React, { useEffect, useRef } from 'react'
import { verify, reset } from '../../features/authy/AuthSlice'
import {useSelector, useDispatch} from 'react-redux'
import { useNavigate, useParams} from "react-router-dom"
import './authy.css'

const Verify = () => {

  const {isLoading, isSuucess, isError, message} = useSelector((state)=> state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {requestId} = useParams()
  const {phone} = useParams()

  const ready = useRef(true)
  const inputs = useRef(null)
  const submitButton = useRef(null)
  useEffect(()=>{
    if(ready.current){
      ready.current = false
      document.title = 'کد احراز هویت'
      const inputsElement =  inputs.current.querySelectorAll('input')
      inputsElement[0].focus()
      inputsElement.forEach((input, index1) => {
        input.addEventListener('keyup', (e)=>{
          const currentInput = input 
          const previousInput = input.previousSibling
          const nextInput = input.nextSibling 
  
          if(currentInput.value.length> 1) {
            currentInput.value = "" 
            return
          }

          if(nextInput && nextInput.hasAttribute('disabled') && currentInput.value !== ""){
              nextInput.removeAttribute('disabled')
              nextInput.focus()
          }
          if(e.key === 'Backspace'){
              inputsElement.forEach((input, index2) => {
                if(index1 <= index2 && previousInput){
                  input.value = ""
                  input.setAttribute('disabled', true)
                  previousInput.focus()
                }
              })
          }
          if(!inputsElement[3].disabled && inputsElement[3].value !== ""){
              let number = ""
              inputsElement.forEach(input =>{
                number += input.value
               
              })
              const formData = {}
              formData.request_id = requestId 
              formData.code = number
              formData.receiver = phone
              dispatch(verify(formData))
              submitButton.current.textContent = "در حال بررسی"
              submitButton.current.removeAttribute("disabled")
              return
          }
          submitButton.current.textContent = "ثبت"
          submitButton.current.setAttribute("disabled", true)

        })
      })
    }
  },[dispatch])

  useEffect(()=>{
    if(isSuucess){
      navigate('/')
      dispatch(reset())
    }
  },[isSuucess])
  useEffect(()=>{
    if(isError){
      
      setTimeout(()=>dispatch(reset()), 3000)
      submitButton.current.textContent = "ثبت"
      submitButton.current.setAttribute("disabled", true)
    }
  },[isError])



  return (
    <div className="form-container mt-4 mb-8 flex justify-center items-center w-full h-screen verify">
      <div className="form-content">
        <div className="form">
        <div className="header">
          <h1>کد احراز هویت</h1>
        </div>
        {isError && message ? (<div className="error text-white bg-red-700 p-2 mt-2 mb-2"><p>{message}</p></div>):null}
        <div className="form-list">
          <form >
              {/**** CODE  *****/}
              <div className="inputs flex justify-center items-center flex-row-reverse mt-7 mb-9" ref={inputs}>
                <input type="number" name="numbrt" id="number1" />
                <input type="number" name="numbrt" id="number2" disabled={true}/>
                <input type="number" name="numbrt" id="number3" disabled={true}/>
                <input type="number" name="numbrt" id="number4" disabled={true}/>

              </div>
            <button type="submit" ref={submitButton} disabled={true}>ثبت</button>

          </form>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Verify
