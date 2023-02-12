import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUsers, reset } from '../../features/users/userSlice'
import userAxiosPrivate from '../../hooks/userAxiosPrivate'

import Table from '../../components/dashboard/table/Table'

import TopHeader from '../../components/dashboard/TopHeader'
import Status from '../../components/status/Status'
import loading from './json/loading.json'

function UserList() {

  const dispatch = useDispatch()
  const AxiosPrivate = userAxiosPrivate()
  const ready = useRef(true)
 

  const { isLoading, isSuccess, isError, users } = useSelector((state) => state.users)

  const [listings, setListings] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [listingsPerpage, setListingsPerpage] = useState(4)
  const [active, setActive] = useState(1)

  const indexOfLastListings = currentPage * listingsPerpage
  const indexOfFirstListings = indexOfLastListings - listingsPerpage
  const listingsSlice = listings?.length ? listings.slice(indexOfFirstListings, indexOfLastListings) : []

  const visitPage = (page) => {
    setCurrentPage(page)
    setActive(page)
  }
  const previousPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1)
      setActive(currentPage - 1)
    }
  }
  const nextPage = () => {
    if (currentPage !== Math.ceil(listings.length / listingsPerpage)) {
      setCurrentPage(currentPage + 1)
      setActive(currentPage + 1)
    }
  }

  useEffect(() => {
    if(ready.current) {
      ready.current = false
      document.title = 'کاربران'
      dispatch(fetchUsers(AxiosPrivate))
    }
  }, [dispatch])


  useEffect(() => {

    if (isSuccess && users?.length) {
      setListings(users)
      dispatch(reset())


    }


  }, [isSuccess])

  return (
    <div>
      <TopHeader title="کاربران" url="users" />
      <div className="formgroup flex flex-col justify-center items-center w-full mt-16">
        {isLoading && (<Status lotttieFile={loading} />)}
        {!isLoading && listings?.length > 0 ? (

            <Table 
            thead={['', 'شماره همراه', 'ایمیل', 'نام', 'تصویر']} 
            listings={listingsSlice}
            itemPerpage={listingsPerpage}
            count={listings.length}
            visit={visitPage}
            preivious={previousPage}
            next={nextPage}
            active={active}
            />
        ) : null}


      </div>
    </div>
  )
}

export default UserList