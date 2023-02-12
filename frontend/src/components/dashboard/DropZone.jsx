import React,{useEffect, useRef} from 'react'
import { updateTodo } from '../../features/todo/todoSlice'
import { useDispatch } from 'react-redux'


function DropZone(props) {
  const dispatch = useDispatch()
  const dropZone = useRef(null)
  useEffect(()=>{
    dropZone.current.addEventListener('dragover', (e)=>{
      e.preventDefault()
      e.target.classList.add('active')
    })
    dropZone.current.addEventListener('dragleave', (e)=>{
      e.preventDefault()
      e.target.classList.remove('active')
    })
    dropZone.current.addEventListener('drop', (e)=>{
      e.preventDefault()
      e.target.classList.remove('active')

      const itemElement = dropZone.current.closest('.program-items')
      const dropZoneItems = Array.from(itemElement.querySelectorAll('.dropzone'))
      const dropZOneIndex = dropZoneItems.indexOf(dropZone.current)
      const target = props.position == 'top' ? dropZOneIndex:dropZOneIndex-1
      const itemId = e.dataTransfer.getData('text/plain')
      const dropItemElement = document.getElementById(itemId)
      if(dropItemElement.contains(dropZone.current)){
        return
      }
      dispatch(updateTodo({id:itemId, target:target}))

      
    })
  },[])

  return (
    <div className='dropzone' ref={dropZone} data-position={props.position}></div>
  )
}

export default DropZone