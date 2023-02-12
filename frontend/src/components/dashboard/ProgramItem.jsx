import React, { useEffect, useRef } from 'react'
import DropZone from './DropZone'
function programItem(props) {
  const todo = useRef(null)
  useEffect(() => {

    todo.current.addEventListener('dragstart', (e) => {
      const id = e.target.id
      e.dataTransfer.setData('text/plain', id)
    })
    todo.current.addEventListener('drop', (e) => {
      e.preventDefault()
    })
  }, [])
  const updateItem = (e) => {
    const content = props.content
    const newContent = e.target.textContent.trim()
    if (content == newContent) {
      return
    }

    props.updateItem({ id: e.target.parentElement.id, content: newContent })
  }
  return (

    <div className="program-item" draggable={true} ref={todo} id={props.id}>
       
      <div
        className="program-item-input"
        contentEditable={true}
        suppressContentEditableWarning={true}
        onDoubleClick={() => props.ondblclick(props.id)}
        onBlur={updateItem}

      >
        {props.content}

      </div>
      <DropZone position="buttom"/>
    </div>

  )
}

export default programItem