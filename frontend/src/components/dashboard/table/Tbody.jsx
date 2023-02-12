import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { updateUser, deleteUSer, reset, addUser } from '../../../features/users/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import userAxiosPrivate from '../../../hooks/userAxiosPrivate'

function Tbody(props) {
    const dispatch = useDispatch()
    const AxiosPrivate = userAxiosPrivate()
    const { index, item } = props
    const thumbnail = useRef(null)
    const trElement = useRef(null)
    const ready = useRef(true)
    const [isUpdate, setIsUpdate] = useState(false)
    const [picture, setPicture] = useState("")
    const [userinfo, setUserInfo] = useState({
     
        image: "",
        username: "",
        email: "",
        phone: ""
        
    })
    useEffect(() => {
              setUserInfo({
                 
                  image: item?.image ? item.image : "",
                  username: item?.username ? item.username : "",
                  email: item?.email ? item.email : "",
                  phone: item?.phone ? item.phone : "",
              }) 
    }, [item])

    useEffect(() => {
        let isReady = true

  

        const handelEditeButton = (target) => {
            document.querySelector('.edite').addEventListener('click', () => {
                console.log(' update btn')
                Array.from(target.children).forEach(td => {
                    td.contentEditable = true
                    if (td.querySelector('input')) {
                        td.querySelector('input').disabled = false
                    }
                    if (td.querySelector('input[name="phone"]')) {
                        td.querySelector('input').disabled = true
                    }
                    td.firstElementChild.contentEditable = false
                    setIsUpdate(true)
                })
            })
        }
        const handelDeleteButton = (target) => {
            document.querySelector('.remove').addEventListener('click', () => {
                if (!isReady) {
                    return
                }
                isReady = false
                console.log(' delete')
                if (window.confirm('are you sure')) {
                    const phone = target.querySelector('input[name="phone"]').value
                    dispatch(reset())
                    dispatch(deleteUSer({AxiosPrivate, phone}))
                }
            })
        }
        if (ready.current) {
            ready.current = false

            trElement.current.addEventListener('focus', () => handelEditeButton(trElement.current))
            trElement.current.addEventListener('focus', () => handelDeleteButton(trElement.current))
        }

        return () => {
            ready.current = false
        }


    }, [])




    const {  image, username, email, phone } = userinfo

    



    const onChange = (e) => {
        setUserInfo({ ...userinfo, [e.target.name]: e.target.value })
    }

    const handelClick = (e) => {
        const input = e.target.querySelector('input')
        input?.click()
    }
    const showFile = (e) => {
        const file = e.target.files[0]
     
       
        const validationData = ['image/png', 'image/jpg', 'image/jpeg']
        if (validationData.includes(file.type)) {
            const fileReader = new FileReader()
            fileReader.onload = () => {
                let fileURL = fileReader.result
                let imageTag = `<img src=${fileURL} alt=${index} />`
                const image = thumbnail.current.querySelector('img')
                if (image) {
                    image.src = fileURL
                } else {

                    thumbnail.current.innerHTML += imageTag

                }
              setPicture(file)
            }
            fileReader.readAsDataURL(file)
        }

    }
    const onSubmit = (e) => {
        e.preventDefault()
        const newData = {}
        if(item?.username !== username) newData['username'] = username
        if(item?.phone !== phone) newData['phone'] = phone
        if(item?.email !== email) newData['email'] = email
        if(picture){
            if(item?.image !== picture) newData['image'] = picture
        }

        if(userinfo.phone && !isUpdate) {
            newData['password'] = userinfo['phone']
        }
      
          dispatch(reset())
      console.log(' ', newData)
        if(isUpdate){
         
          console.log('update ', newData)
          newData['phone'] = phone
          dispatch(updateUser({AxiosPrivate, userData:newData}))
        }else{
            console.log('add ', newData)
             dispatch(addUser({AxiosPrivate, userData:newData}))
        }
    }
    const getImage = () => {


        if (image && !isUpdate) {
            return (<img src={`http://127.0.0.1:8000/${image}`} alt={index} />)
        }
        else if (image && isUpdate) {
            return (
                <div className='input-file' ref={thumbnail} onClick={handelClick}><input type="file" name="image" onChange={showFile} /><img src={`http://127.0.0.1:8000/${image}`} alt={index} /></div>
            )
        }
        else if (!image) {
            return (
                <div className='input-file' ref={thumbnail} onClick={handelClick}><input type="file" name="image" onChange={showFile} /></div>
            )
        }
       


    }
    const getButton = () => {
        if (item?.phone && !isUpdate) {
            return (<Link to={`/user/${item.phone}`} >جزئیات</Link>)
        }
        else if (!item?.username || isUpdate) {
            return (<input type="submit" value="ثبت" id="btnSubmit" onClick={onSubmit} />)
        }

    }
    return (
        <tr key={index} tabIndex={index} ref={trElement} id={index}>
            <td >
                <div className='input-item'>
                  {getButton()}

                </div>
            </td>
           
            <td>
                <div className='input-item'>
                    <input type="text" name="phone" value={phone} onChange={onChange} disabled={item?.phone ? true : false} />

                </div>
            </td>
            <td>
                <div className='input-item'>
                    <input type="text" name="email" value={email} onChange={onChange} disabled={item?.email ? true : false} />

                </div>
            </td>
            <td>
                <div className='input-item' >
                    <input type="text" name="username" value={username} onChange={onChange} disabled={item?.username ? true : false} />

                </div>
            </td>
            <td>
                <div className="input-item thumbnail" >
                    {getImage()}
                </div>
            </td>
        </tr>
    )
}

export default Tbody