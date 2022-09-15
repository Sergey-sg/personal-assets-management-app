import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppRoute } from './common/enums/app-route.enum'
// import { useAppDispatch, useAppSelector } from './hooks/useAppDispatch'
import HomePage from './pages/HomePage'

import './index.css'

export default function App() {
  return (
    <div>
      <Routes>
        <Route path={AppRoute.HOME} element={<HomePage />} />
      </Routes>
    </div>
  )
}
