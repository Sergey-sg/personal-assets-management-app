import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './hooks/useAppDispatch'
import LoginPage from './pages/login/LoginPage'

import PortalRouts from ' routes/PortalRouts'
import './index.css'
import LoginLoader from 'components/loaders/loginLoader/LoginLoader'
import { checkAuth } from 'redux/thunk/authThunk'
import LoginForm from 'components/loginForm/LoginForm'
import RegisterForm from 'components/registerForm/RegisterForm'
import ForgotPassword from 'components/forgotPaswordForm/ForgotPassword'
import CheckCode from 'components/forgotPaswordForm/CheckCode'
import { Route, Routes } from 'react-router-dom'
import { AppRoute } from 'common/enums/app-route.enum'
import NotFoundPage from 'pages/NotFoundPage'
import LoginRouts from ' routes/LoginRouts'
import { socket, SocketContext } from 'utils/context/SocketContext'
import { changeStatusCryptoPosrtfolioOnFalse } from 'redux/slice/authSlice'
import { chengeStatusPortfolio } from 'redux/slice/cryptoPortfolioSlice'
import { fetchWallets } from 'redux/slice/walletsSlice'

export default function App() {
  const { isAuth, status } = useAppSelector((store) => store.authSlice)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isAuth) {
      dispatch(changeStatusCryptoPosrtfolioOnFalse())
      dispatch(chengeStatusPortfolio())
    }
  }, [isAuth])

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(checkAuth())
    }
    sessionStorage.clear()
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
          <LoginRouts />
        </>
      )}
    </div>
  )
}
