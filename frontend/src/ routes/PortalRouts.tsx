import { AppRoute } from 'common/enums/app-route.enum'
import InvoiceCreatePage from 'pages/invoicePages/InvoiceCreatePage'
import InvoiceDetailPage from 'pages/invoicePages/InvoiceDetailPage'
import InvoicesListPage from 'pages/invoicePages/InvoicesListPage'
import InvoiceUpdatePage from 'pages/invoicePages/UpdateInvoicePage'
import NotFoundPage from 'pages/NotFoundPage'
import PortalPage from 'pages/PortalPage'
import {
  Chats,
  Dashboard,
  MoneyBox,
  MyWallet,
  Settings,
  Transactions,
  Widgets,
  DashboardOverview,
} from 'pages/portalPages'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const PortalRouts = () => {
  return (
    <Routes>
      <Route path={AppRoute.HOME} element={<PortalPage />} />
      <Route path={AppRoute.PORTAL} element={<PortalPage />}>
        <Route index element={<Dashboard />} />
        <Route path={AppRoute.DASHBOARD} element={<DashboardOverview />} />
        <Route path={AppRoute.TRANSACTIONS} element={<Transactions />} />
        <Route path={AppRoute.INVOICES}>
          <Route path="" element={<InvoicesListPage />} />
          <Route
            path={`${AppRoute.INVOICE_CREATE}/`}
            element={<InvoiceCreatePage />}
          />
          <Route
            path={`${AppRoute.INVOICE_UPDATE}/:invoiceId`}
            element={<InvoiceUpdatePage />}
          />
          <Route
            path={`${AppRoute.INVOICE_DETAILS}/:invoiceId`}
            element={<InvoiceDetailPage />}
          />
        </Route>
        <Route path={AppRoute.MY_WALLETS} element={<MyWallet />} />
        <Route path={AppRoute.WIDGETS} element={<Widgets />} />
        <Route path={AppRoute.MONEY_BOX} element={<MoneyBox />} />
        <Route path={AppRoute.CHATS} element={<Chats />} />
        <Route path={AppRoute.SETTINGS} element={<Settings />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default PortalRouts
