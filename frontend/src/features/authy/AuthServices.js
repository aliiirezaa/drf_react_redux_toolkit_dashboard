import axios from "../../api/axios"


export const profile = async(AxiosPrivate) => {
    const response = await AxiosPrivate.get('profile/')
    return response.data
}

export const updateUser = async(axiosPrivate, phone,  updateItem) => {
    const config = {
        headers:{
            "Content-Type":"multipart/form-data"
        }
    }
    const response = await axiosPrivate.put(`user/${phone}/`, updateItem, config)
    return response.data
}

export const login = async(userData) => {
    const response = await axios.post('login/', JSON.stringify(userData))
    return response.data
}

export const register = async(userData) => {
    const response = await axios.post('register/', JSON.stringify(userData))
    return response.data
}

export const verify = async(userData) => {
    const response = await axios.post('verify/', userData)
    return response.data
}

export const sendPasswordResetEmail = async(userData) => {
    const response = await axios.post('user/send/email/for/password/reset/', JSON.stringify(userData))

    return response.data
}

export const confirmEmailPasswordReset = async(uid, token, userData) => {
    const response = await axios.post(`user/reset/password/${uid}/${token}/`, JSON.stringify(userData))
    return response.data 
} 
export const changePassword = async(AxiosPrivate, userData) => {
    const response = await AxiosPrivate.post('user/change/password/',JSON.stringify(userData))
    return response.data
}


export const AuthServices = {profile, updateUser, login, register, verify, sendPasswordResetEmail, confirmEmailPasswordReset, changePassword}
export default AuthServices