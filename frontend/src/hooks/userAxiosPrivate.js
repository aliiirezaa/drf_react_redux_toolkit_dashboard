import {useEffect} from 'react'
import { axiosPrivate } from '../api/axios'
import useRefreshToken from './useRefreshToken'
import { useSelector } from 'react-redux'

const userAxiosPrivate = () => {
    const refresh = useRefreshToken()
    const {access} = useSelector((state)=> state.user) 

    useEffect(()=>{
        const requestIntercept = axiosPrivate.interceptors.request.use(
            (config) =>{
                if(!config.headers["Authorization"] ){
                    config.headers["Authorization"] = `Bearer ${access}`
                }
                return config
            },
            (error) => Promise.reject(error)
        )
        const responseIntercept = axiosPrivate.interceptors.response.use(
            (response) => response,
            async (error) => {
           
                const prevRequest = error?.config 
                // console.warn('\n error for use Axios \n', error) 
                if(error?.response?.status === 401){
                    
                    const newAccessToken = await refresh()
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
                    return axiosPrivate(prevRequest)
                }
                return Promise.reject(error)
            }
        )
        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept)
            axiosPrivate.interceptors.response.eject(responseIntercept)
        }

    },[refresh, access])

    return axiosPrivate
}

export default userAxiosPrivate