import React from 'react'
import { UilPrevious, UilStepForward  } from '@iconscout/react-unicons'
import './css/pagination.css'

function Pagination(props) {

  const { itemPerpage, count, visit, preivious, next, active} = props
  const getNumbers = () => {

    let numbers = []
    let itemPerPage = itemPerpage 
    let pageNumber = 1
    
    for(let i=0; i < count; i+= itemPerPage){
      const page = pageNumber 
      let style = 'page'
      let content = ""
      if(page === active){
        style = "page active"
        content = (
            <li key={i} className={style}>
              {pageNumber}
            </li>
        )
      }
      else {
        content = (
          <li key={i} className={style} onClick={() => visit(page)}>
            {pageNumber}
          </li>
        )
      }
      numbers.push(content)
      pageNumber++
    }
    return numbers
  }
  return (
    <div className="paginatoins mt-4">
          <ul className='flex flex-row justify-center'>
            <li className='previous' onClick={preivious}>
              <UilPrevious />
            </li>
            {getNumbers()}
            <li className='next' onClick={next}>
              <UilStepForward/>
            </li>
          </ul>
        </div>
  )
}

export default Pagination