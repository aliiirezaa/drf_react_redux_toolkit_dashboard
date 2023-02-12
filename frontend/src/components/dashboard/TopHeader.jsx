import React,{useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import persianDate from 'persian-date' 

function TopHeader(props) {
    const [day, setDay] = useState('')
    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')
  
    useEffect(()=>{
      document.title = 'داشبورد'
      const tarikh = new persianDate()
      setYear(tarikh.toLocale('fa').format('YYYY'))
      setMonth(tarikh.toLocale('fa').format('MMMM'))
      setDay(tarikh.toLocale('fa').format('DD'))
    }, [])
  return (
    <div className="top flex justify-between items-center p-4 mt-8">
        
    <div className="date flex flex-row justify-center">
      <span className="year order-1  mx-1">{year}</span>
      <span className="month order-2 mx-1">{month}</span>
      <span className="day order-3 mx-1">{day}</span>
    </div>

    <div className="breadcrumb">
      <h1 className='text-3xl'><Link to={props.url}> /{props.title}</Link></h1>
    </div>
  </div>
  )
}

export default TopHeader