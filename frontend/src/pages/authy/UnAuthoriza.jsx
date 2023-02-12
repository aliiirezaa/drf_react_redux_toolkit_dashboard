import React, {useEffect} from 'react'

import './authy.css'



const UnAuthoriza = () => {
    useEffect(()=>{
        document.title = 'مجاز نیست'
    },[])
    return (
        <div className="form-container mt-4 mb-8 flex justify-center items-center w-full h-screen verify">
            <div className="form-content">
                <div className="form">
                    <div className="header">
                        <h1 className='text-white bg-red-600'> اجازه دسترسی به محتوای این بخش را فقط ادمین ها دارند </h1>
                    </div>

                </div>
            </div>
        </div>
   
  )
}

export default UnAuthoriza
