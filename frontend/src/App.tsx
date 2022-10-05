import React from 'react'
import { useAppDispatch, useAppSelector } from './hooks/useAppDispatch'
import HomePage from './pages/HomePage'
import LoginPage from './pages/login/LoginPage'
import { checkAuth } from './redux/slice/authSlice'
import './index.css'
import { Route, Routes } from 'react-router-dom'
import { AppRoute } from 'common/enums/app-route.enum'
import PortalPage from 'pages/PortalPage'
import {
  Chats,
  Dashboard,
  MoneyBox,
  Settings,
  MyWallet,
  Transactions,
  Widgets,
} from 'pages/portalPages'
import NotFoundPage from 'pages/NotFoundPage'

import './index.css'
import LoginLoader from 'components/loaders/loginLoader/LoginLoader'
import PortalRouts from ' routes/PortalRouts'

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
        <>
          <PortalRouts />
        </>
      ) : (
        <>
          <LoginPage />
        </>
      )}
    </div>
  )
}
