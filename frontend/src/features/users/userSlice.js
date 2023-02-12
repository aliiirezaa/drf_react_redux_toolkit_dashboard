import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userServices from "./userServices";

const initialState = {
    users: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ""
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (AxiosPrivate, thunkAPI) => {
    try {
        return await userServices.fetchUsers(AxiosPrivate)
    }
    catch (error) {
        let message = ""
        if (error?.response?.status == 500) {
            message = "خطایی در بخش سرور اتفاق افتاده است"
        }
        else if (error?.response?.status == 400) {
            message = error?.response?.data?.message || error?.response?.data || error.toString()
        }
        else if (error?.response?.status == 401) {
            message = error?.response?.data?.message || error?.response?.data || error.toString()
        }
        return thunkAPI.rejectWithValue(message)
    }
})

export const addUser = createAsyncThunk('users/add', async ({ AxiosPrivate, userData }, thunkAPI) => {
    try {
        return await userServices.addUser(AxiosPrivate, userData)
    }
    catch (error) {
        let message = ""
        if (error?.response?.status == 500) {
            message = "خطایی در بخش سرور اتفاق افتاده است"
        }
        else if (error?.response?.status == 400) {
            message = error?.response?.data?.message || error?.response?.data || error.toString()
        }
        else if (error?.response?.status == 401) {
            message = error?.response?.data?.message || error?.response?.data || error.toString()
        }
        return thunkAPI.rejectWithValue(message)
    }
})

export const updateUser = createAsyncThunk('users/update', async ({ AxiosPrivate, userData }, thunkAPI) => {
    try {
        return await userServices.EidteUser(AxiosPrivate, userData)
    }
    catch (error) {
        let message = ""
        if (error?.response?.status == 500) {
            message = "خطایی در بخش سرور اتفاق افتاده است"
        }
        else if (error?.response?.status == 400) {
            message = error?.response?.data?.message || error?.response?.data || error.toString()
        }
        else if (error?.response?.status == 401) {
            message = error?.response?.data?.message || error?.response?.data || error.toString()
        }
        return thunkAPI.rejectWithValue(message)
    }
})

export const deleteUSer = createAsyncThunk('users/delete', async ({ AxiosPrivate, phone }, thunkAPI) => {
    try {
        return await userServices.deleteUser(AxiosPrivate, phone)
    }
    catch (error) {
        thunkAPI.rejectWithValue(error)
    }
})

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false,
                state.isError = false,
                state.isSuccess = false,
                state.message = ""
        },
        insertRow: (state, action) => {

            state.isSuccess = true
            state.isLoading = false
            state.users = [action.payload, ...state.users]
        }
    },
    extraReducers(builder) {
        builder
       
            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.users = action.payload
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.message = action.message
            })

            .addCase(addUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(addUser.fulfilled, (state, action) => {

                state.isLoading = false,
                    state.isSuccess = true
                let users = state.users.slice(1)
                state.users = [action.payload, ...users]
            })
            .addCase(addUser.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.isSuccess = false
                state.message = action.payload
            })
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                if (!action.payload.phone) {
                    state.isError = true,
                        state.isSuccess = false,
                        state.isLoading = false,
                        state.message = 'id was not existed'
                }
                state.isSuccess = true
                state.isLoading = false
                state.isError = false
                const { phone } = action.payload
                const users = state.users.filter(user => user.phone !== phone)
                state.users = [action.payload, ...users]

            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.isSuccess = false
                state.message = action.payload
            })

            .addCase(deleteUSer.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteUSer.fulfilled, (state, action) => {
                if (!action.payload) {
                    state.isError = true,
                        state.isSuccess = false,
                        state.isLoading = false,
                        state.message = 'id was not existed'
                }

                state.isSuccess = true
                state.isLoading = false
                state.isError = false
                const { phone } = action.payload
                const users = state.users.filter(user => user.phone !== phone)
                state.users = users

            })
            .addCase(deleteUSer.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.isSuccess = false
                state.message = action.payload
            })


    }
})

export const { reset, insertRow } = usersSlice.actions


export default usersSlice.reducer