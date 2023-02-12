import { createSlice, nanoid } from "@reduxjs/toolkit";


const myProgram = (()=>{
    let program = localStorage.getItem('todos')
    try{
        program = JSON.parse(program)
        program = program.length ? program : null

    }
    catch{

        program = null
    }
    if(program == null) {
        program = [
            {
                id:'1',
                content:'ورزش کردن'
            },
            {
                id:'2',
                content:'برنامه نویسی'
            },
            {
                id:'3',
                content:"مطالعه"
            },
            {
                id:'4',
                content:'رانندگی'
            },
        
        ]
        localStorage.setItem('todos', JSON.stringify(program))
        program = JSON.parse(localStorage.getItem('todos'))
    }
    return program
})()

const initialState = {
    todos : myProgram,
}

const save = (data) => {
    localStorage.setItem('todos', JSON.stringify(data))
}

const todoSlice = createSlice({
    name:'todos',
    initialState,
    reducers:{
       
        updateTodo:(state, action) =>{
            const {id, content=undefined, target=undefined} = action.payload 

            state.todos.map(todo => {
                if(todo.id == id){
                    todo.content = content === undefined ? todo.content:content
                    state.todos.splice(state.todos.indexOf(todo),1)
                    state.todos.splice(target, 0, todo )
                }
            })
            save(state.todos)
        },
        deleteTodo:(state, action) => {
            const {id} = action.payload 
            const item = state.todos.filter(item => item.id != id)
            state.todos = item
            save(state.todos)
            
        },
        insertTodo:{
            reducer(state, action){
                state.todos.unshift(action.payload)
                save(state.todos)
            },
            prepare(content=null){
              
                return {
                    payload:{
                        id:nanoid(),
                        content
                    }
                }
            }
        },

    }
})

export const todos = (state) => state.todos.todos
export const {getTodos, updateTodo, deleteTodo, insertTodo} = todoSlice.actions

export default todoSlice.reducer