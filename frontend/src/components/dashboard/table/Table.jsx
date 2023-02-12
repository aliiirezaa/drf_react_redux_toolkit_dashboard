import React, { useRef, useEffect } from 'react'
import Pagination from '../Pagination'
import { useDispatch, useSelector } from 'react-redux'
import { insertRow, reset } from '../../../features/users/userSlice'
import Tbody from './Tbody'
import './css/table.css'

function Table(props) {
    const { thead, listings, itemPerpage, count, visit, preivious, next, active } = props

    const dispatch = useDispatch()
   
    const ready = useRef(true)
    const table = useRef(null)

    const { isLoading } = useSelector((state) => state.users)
   
    useEffect(() => {
        if(ready.current){
            ready.current = false
            document.querySelector('.add').addEventListener('click',(e) => {
              console.log('click ', )
            
             dispatch(reset())
             dispatch(insertRow())
            
             
            })
    
        }

    }, [])

    return (


        <>
            {!isLoading && (

                <>
                    <div className="table-container flex flex-col justify-between items-center">
                        <div className="buttons mb-3" >
                            <button type='button' className='add' >افزودن</button>
                            <button type='button' className='edite'>ویرایش</button>
                            <button type='button' className='remove' >حذف</button>
                        </div>
                        <table className='border-collapse  w-full text-center' ref={table}>
                            <thead>

                                <tr>
                              
                              
                                    {thead.map((title, index) => {

                                        return (
                                            <th key={index}>{title}</th>

                                        )
                                      
                                    })}
                                   

                                </tr>
                                <tr>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {!isLoading && listings.map((item, index) => {
                                 
                                    return (
                                        <Tbody key={index} item={item} index={index}/>
                                    )
                                })}

                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        itemPerpage={itemPerpage}
                        count={count}
                        visit={visit}
                        preivious={preivious}
                        next={next}
                        active={active}

                    />
                </>
            )}

        </>
    )
}

export default Table