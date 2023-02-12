import React from 'react'
import Lottie from "lottie-react";


function Status({ lotttieFile }) {
    return (

        <div className="status flex flex-row justify-center items-center w-full">
            <Lottie animationData={lotttieFile} loop={true} className="w-60" />
        </div>
    )
}

export default Status