import React, {useState, useEffect, useRef} from 'react'
import ProgramItem from './ProgramItem'
import DropZone from './DropZone'
import { UilSearchAlt } from '@iconscout/react-unicons'
import {  useSelector, useDispatch } from 'react-redux' 
import { todos } from '../../features/todo/todoSlice'
import { insertTodo, updateTodo, deleteTodo } from '../../features/todo/todoSlice'

function ProgramData() {

  const items = useRef(null)
  const searchTodo = useRef(null)
  const dispatch = useDispatch()
  const myProgram = useSelector(todos) 
  const [todosList, setTodosList] = useState(myProgram)


  useEffect(()=> setTodosList(myProgram) , [myProgram])

  useEffect(()=>{
    searchTodo.current.addEventListener('keyup', (e) => {
    const value = e.target.value.toLowerCase()
    if(value){
      const filteredList = todosList.filter(item => item.content.toLowerCase().includes(value))
      setTodosList(filteredList)
    } else {
      setTodosList(myProgram)
    }
   

    })
  },[])
  
  const ondblclick = (id) => {
    dispatch(deleteTodo({id}))
  }

  const insertItem = () => {
    dispatch(insertTodo(""))
  }

  const updateItem = (data) => {
    dispatch(updateTodo(data))
  }

  return (
    <div className="program">
        <h1 className="program-title"> برنامه روزانه من</h1>
        <div className="searchbar">
          <span className="icon-search"><UilSearchAlt/></span>
          <input type="search" placeholder='برنامه من' ref={searchTodo}/>
        </div>
        <div className="program-items" ref={items}>
            <DropZone position="top" />
            {
              todosList.map((item, index) =>{
                return(
                  <ProgramItem 
                    key={index} 
                    id={item.id}
                    content={item.content}
                    ondblclick={ondblclick}
                    updateItem={updateItem}
                   />
                )
              })
            }
           
           
        </div>
        <button type='button' className='btn btn-submit' onClick={insertItem}>افزودن + </button>
      </div>
  )
}

export default ProgramData