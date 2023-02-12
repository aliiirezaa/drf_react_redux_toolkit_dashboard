import {createSlice,createAsyncThunk } from '@reduxjs/toolkit' 
import AuthServices from './AuthServices'



const save = (access, refresh) => {
    localStorage.setItem('access', JSON.stringify(access))
    localStorage.setItem('refresh', JSON.stringify(refresh))
}



export const profile = createAsyncThunk('user/profile', async(AxiosPrivate , thunkAPI)=>{
    try{
        
        return await AuthServices.profile(AxiosPrivate)
    }
    catch(error){
       
        let message = "" 
        if(error?.response?.status == 500) {
            message = "خطایی در بخش سرور اتفاق افتاده است"
        }
        else if (error?.response?.status == 400){
            message = error?.response?.data?.message
        }
        else if (error?.response?.status == 401){
            message =  error?.response?.data?.message || error?.response?.data || error.toString()
        }
        return thunkAPI.rejectWithValue(message)
    }
})

export const updateUser = createAsyncThunk('user/update', async({axiosPrivate, phone,  updateItem}, thunkAPI) => {
    try{
        return await AuthServices.updateUser(axiosPrivate, phone, updateItem)
    }
    catch(error){
        let message = "" 
        if(error?.response?.status == 500) {
            message = "خطایی در بخش سرور اتفاق افتاده است"
        }
        else if (error?.response?.status == 400){
            message = error?.response?.data?.message
        }
        else if (error?.response?.status == 401){
            message =  error?.response?.data?.message || error?.response?.data || error.toString()
        }
        return thunkAPI.rejectWithValue(message)
    }
})

export const login = createAsyncThunk('user/login', async(userData, thunkAPI)=>{
    try{
        return await AuthServices.login(userData)
    }
    catch(error){
      
        let message = "" 
        if(error?.response?.status == 500) {
            message = "خطایی در بخش سرور اتفاق افتاده است"
        }
        else if (error?.response?.status == 400){
            message =  error?.response?.data?.message || error?.response?.data || error.toString()
        }
        else if (error?.response?.status == 401){
            message = error?.response?.data?.message || error?.response?.data || error.toString()
        }
        return thunkAPI.rejectWithValue(message)
    }
})

export const register = createAsyncThunk('user/register', async(userData, thunkAPI)=>{
    try{
        return await AuthServices.register(userData)
    }
    catch(error){
        let message = "" 
        if(error?.response?.status == 500) {
            message = "خطایی در بخش سرور اتفاق افتاده است"
        }
        else if (error?.response?.status == 400){
            message = 'کاربری با این مشخصات ثبت نام کرده است'
        }
        else if (error?.response?.status == 401){
            message = "شما اجازه ثبت نام ندارید"
        }
        return thunkAPI.rejectWithValue(message)
    }
})

export const verify = createAsyncThunk('user/verify', async(userData, thunkAPI)=>{
    try{
        return await AuthServices.verify(userData)
    }
    catch(error){
        let message = "" 
        if(error?.response?.status == 500) {
            message = "خطایی در بخش سرور اتفاق افتاده است"
        }
        else if (error?.response?.status == 400){
            message =  error?.response?.data?.message || error?.response?.data || error.toString()
        }
        else if (error?.response?.status == 401){
            message = error?.response?.data?.message || error?.response?.data || error.toString()
        }
        return thunkAPI.rejectWithValue(message)
    }
})

export const sendPasswordResetEmail = createAsyncThunk('user/sendPasswordResetEmail', async(userData, thunkAPI)=>{
    try{
        return AuthServices.sendPasswordResetEmail(userData)
    }
    catch(error){
    
        let message = "" 
        if(error?.response?.status == 500) {
            message = "خطایی در بخش سرور اتفاق افتاده است"
        }
        else if (error?.response?.status == 400){
            message = error?.response?.data?.message || error?.response?.data?.non_field_errors || "کاربری یافت نشد! "
        }
        else if (error?.response?.status == 401){
            message =  error?.response?.data?.message || error?.response?.data || error.toString()
        }
        
        return thunkAPI.rejectWithValue(message)
    }
})

export const confirmEmailPasswordReset = createAsyncThunk('user/confirmEmailPasswordReset', async({uid, token, userData}, thunkAPI)=>{
    try{
        return AuthServices.confirmEmailPasswordReset(uid, token, userData)
    }
    catch(error){
        let message = "" 
        if(error?.response?.status == 500) {
            message = "خطایی در بخش سرور اتفاق افتاده است"
        }
        else if (error?.response?.status == 400){
            message = error?.response?.data?.message
        }
        else if (error?.response?.status == 401){
            message =  error?.response?.data?.message || error?.response?.data || error.toString()
        }
        return thunkAPI.rejectWithValue(message)
    }
})

export const changePassword = createAsyncThunk('user/changePassword', async({AxiosPrivate, userData}, thunkAPI)=>{
    try{
        return AuthServices.changePassword(AxiosPrivate, userData)
    }
    catch(error){
        let message = "" 
        if(error?.response?.status == 500) {
            message = "خطایی در بخش سرور اتفاق افتاده است"
        }
        else if (error?.response?.status == 400){
            message = error?.response?.data?.message
        }
        else if (error?.response?.status == 401){
            message =  error?.response?.data?.message || error?.response?.data || error.toString()
        }
        return thunkAPI.rejectWithValue(message)
    }
})


const initialState = {
    userInfo: "",
    access :  "",
    refresh :  "",
    request_id: "",
    isLoading: false,
    isSuucess: false,
    isError: false,
    message : ""
}

const AuthSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        reset: (state) => {
            state.isLoading= false,
            state.isSuucess= false,
            state.isError= false,
            state.message = "",
            state.request_id= ""
        },
        refreshAccessToken : (state, action)=>{
            const roles = {}
            state.access = action.payload.access,
            state.refresh =  action.payload.refresh,
            roles['roles'] = action.payload.roles
            state.userInfo = roles
           
        },
        logout: (state) => {
            state.isLoading= false,
            state.isSuucess= true,
            state.isError= false,
            state.message = "logout",
            state.request_id= "",
            state.userInfo = "",
            state.access = "",
            state.refresh = "",
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')

        }
    },
    extraReducers(builder){
        builder
            .addCase(profile.pending , (state)=>{
                state.isLoading = true
            })
            .addCase(profile.fulfilled, (state, action)=>{
                state.isLoading = false
                state.isSuucess = true 
                state.userInfo = action.payload
            })
            .addCase(profile.rejected, (state, action)=>{
                state.isLoading = false
                state.isError = true 
                state.message = action.payload
         
            })

            .addCase(login.pending, (state)=>{
                state.isLoading = true 
            })
            .addCase(login.fulfilled, (state, action) =>{
                state.isLoading = false
                state.isSuucess = true 
                state.request_id = action.payload.request_id
            })
            .addCase(login.rejected, (state, action)=>{
                state.isLoading = false
                state.isSuucess = false
                state.isError = true
                state.access = ""
                state.refresh = ""
                state.request_id = ""
                state.userInfo = []
                state.message = action.payload
            })

            .addCase(register.pending, (state)=>{
                state.isLoading = true 
            })
            .addCase(register.fulfilled, (state, action) =>{
                state.isLoading = false
                state.isSuucess = true 
                state.request_id = action.payload.request_id
            })
            .addCase(register.rejected, (state, action)=>{
                state.isLoading = false
                state.isSuucess = false
                state.isError = true
                state.message = action.payload
            })

            .addCase(verify.pending, (state)=>{
                state.isLoading = true 
            })
            .addCase(verify.fulfilled, (state, action) =>{
                state.isLoading = false
                state.isSuucess = true 
                state.userInfo = action.payload.user_info
                state.access = action.payload.access
                state.refresh = action.payload.refresh
                save( action.payload.access,  action.payload.refresh)
            })
            .addCase(verify.rejected, (state, action)=>{
                state.isLoading = false
                state.isSuucess = false
                state.isError = true
                state.access = ""
                state.refresh = ""
                state.request_id = ""
                state.userInfo = []
                state.message = action.payload
            })

            .addCase(updateUser.pending, (state)=>{
                state.isLoading = true 
            })
            .addCase(updateUser.fulfilled, (state, action) =>{
                state.isLoading = false
                state.isSuucess = true 
                state.userInfo = action.payload
            })
            .addCase(updateUser.rejected, (state, action)=>{
                state.isLoading = false
                state.isSuucess = false
                state.isError = true
                state.request_id = ""
              
                state.message = action.payload
            })

            .addCase(sendPasswordResetEmail.pending, (state)=>{
                state.isLoading = true 
            })
            .addCase(sendPasswordResetEmail.fulfilled, (state, action) =>{
      
                state.isLoading = false
                state.isError = false
                state.isSuucess = true 
                state.message = action.payload.message
            })
            .addCase(sendPasswordResetEmail.rejected, (state, action)=>{
              
                state.isLoading = false
                state.isSuucess = false
                state.isError = true
                state.request_id = ""
              
                state.message = action.payload
            })

            
            .addCase(confirmEmailPasswordReset.pending, (state)=>{
                state.isLoading = true 
            })
            .addCase(confirmEmailPasswordReset.fulfilled, (state, action) =>{
                state.isLoading = false
                state.isSuucess = true 
                state.message = action.payload.message 
                state.userInfo = ""
                state.access = ""
                state.refresh = ""
                state.request_id = ""
            })
            .addCase(confirmEmailPasswordReset.rejected, (state, action)=>{
                state.isLoading = false
                state.isSuucess = false
                state.isError = true
                state.request_id = ""
              
                state.message = action.payload
            })

         
            .addCase(changePassword.pending, (state)=>{
                state.isLoading = true 
            })
            .addCase(changePassword.fulfilled, (state, action) =>{
                state.isLoading = false
                state.isSuucess = true 
                state.message = action.payload.message
            })
            .addCase(changePassword.rejected, (state, action)=>{
                state.isLoading = false
                state.isSuucess = false
                state.isError = true
                state.request_id = ""
              
                state.message = action.payload
            })

           
    }
})

export const {reset, refreshAccessToken, logout} = AuthSlice.actions 
export default AuthSlice.reducer