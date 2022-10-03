import React from 'react'
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
  InvoicesPage,
} from 'pages/portalPages'
import NotFoundPage from 'pages/NotFoundPage'

import './index.css'
import InvoiceCreatePage from 'pages/invoicePages/InvoiceCreatePage'

export default function App() {
  return (
    <div>
      <Routes>
        <Route path={AppRoute.HOME} element={<PortalPage />} />
        <Route path={AppRoute.PORTAL} element={<PortalPage />}>
          <Route index element={<Dashboard />} />
          <Route path={AppRoute.DASHBOARD} element={<Dashboard />} />
          <Route path={AppRoute.TRANSACTIONS} element={<Transactions />} />
          <Route path={AppRoute.INVOICES} element={<InvoicesPage />} />
          <Route
            path={AppRoute.INVOICE_CREATE}
            element={<InvoiceCreatePage />}
          />
          <Route path={AppRoute.MY_WALLETS} element={<MyWallet />} />
          <Route path={AppRoute.WIDGETS} element={<Widgets />} />
          <Route path={AppRoute.MONEY_BOX} element={<MoneyBox />} />
          <Route path={AppRoute.CHATS} element={<Chats />} />
          <Route path={AppRoute.SETTINGS} element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}
