import React from 'react'
import { useAppDispatch, useAppSelector } from './hooks/useAppDispatch'
import LoginPage from './pages/login/LoginPage'
import { checkAuth } from './redux/slice/authSlice'
import LoginLoader from 'components/loaders/loginLoader/LoginLoader'
import PortalRouts from ' routes/PortalRouts'
import './index.css'
import { socket, SocketContext } from 'utils/context/SocketContext'

export default function App() {
  const { isAuth, status } = useAppSelector((store) => store.authSlice)
  const dispatch = useAppDispatch()

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(checkAuth())
    }
  }, [])

  if (status === 'LOADING') {
    return <LoginLoader />
  }

  return (
    <div>
      {isAuth ? (
        <SocketContext.Provider value={socket}>
          <PortalRouts />
        </SocketContext.Provider>
      ) : (
        <>
          <LoginPage />
        </>
      )}
    </div>
  )
}
