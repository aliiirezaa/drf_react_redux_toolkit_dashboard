import React, { useState, useEffect, useRef } from 'react'
import useRefreshToken from '../../hooks/useRefreshToken'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'


function ParsistLogin() {
    const [loading, setLoading] = useState(true)
    const ready = useRef(true)
    const refresh = useRefreshToken()
    const { access } = useSelector((state) => state.user)
    useEffect(() => {
        if (ready.current) {
            const verifyRefreshToken = async () => {
                try {
                    await refresh()
                }
                catch (error) {
                    console.warn("\n error for parsist login\n", error)
                }
                finally {
                    setLoading(false)
                }
            }
            !access ? verifyRefreshToken() : setLoading(false)

        }
        return () => {
            ready.current = false
        }

    }, [])
    // useEffect(() => {
    //     console.log(' loading\n', loading)
    //     console.log(' aT\n ', access)
    // }, [loading])

    return (
        <>
            {
                loading
                    ? <p> loading ....</p>
                    : <Outlet />
            }

        </>

    )
}

export default ParsistLogin
