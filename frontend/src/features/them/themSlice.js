import {createSlice} from '@reduxjs/toolkit'

const save = (data) => {
    localStorage.setItem('mode', JSON.stringify(data))
}

const inintalMode = (()=>{
    let mode = localStorage.getItem('mode')
    try{
        mode = JSON.parse(mode)
        mode = mode ? mode:'light'
        save(mode)
    }
    catch(e){
        mode = 'light'
        save(mode)
    }
    return mode
})()



const initialState = {

    mode: inintalMode
}

const themSlice = createSlice({
    name:'them',
    initialState,
    reducers:{
        changeThem(state,action){
             
            state.mode = action.payload
            save(state.mode)
        }
    }
})

export const mode  = (state) => state.them.mode

export const {changeThem} = themSlice.actions

export default themSlice.reducer