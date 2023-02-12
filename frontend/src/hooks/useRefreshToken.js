import axios from '../api/axios'
import { refreshAccessToken, reset } from "../features/authy/AuthSlice"
import { useDispatch} from 'react-redux'


const useRefreshToken = ()=> {
    const refreshToken = JSON.parse(localStorage.getItem('refresh'))
    const dispatch = useDispatch()
    const refresh = async() => {
        try{
            
            const response = await axios.post('api/token/refresh/', JSON.stringify({"refresh":refreshToken}))
            const data = {
                'access':response?.data?.access,
                'refresh':refreshToken,
                'roles':response?.data?.roles
            }
            
            dispatch(reset())
            dispatch(refreshAccessToken(data))
            return response?.data?.access
            
        }
        catch(error){
            console.warn("error for use refresh:\n", error)
            return Promise.reject(error)
        }
    }
    return refresh


}

export default useRefreshToken