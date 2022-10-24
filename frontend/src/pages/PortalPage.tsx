import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { AppRoute } from 'common/enums/app-route.enum'
import { Header } from 'components/header/Header'
import { SideBar } from 'components/sideBar/SideBar'
import { ReactComponent as DashboardIcon } from 'assets/icons/dashboard.svg'
import { ReactComponent as SettingsIcon } from 'assets/icons/settings.svg'
import { ReactComponent as TransactionIcon } from 'assets/icons/transaction.svg'
import { ReactComponent as InvoiceIcon } from 'assets/icons/invoices.svg'
import { ReactComponent as MoneyBoxIcon } from 'assets/icons/money-box.svg'
import { ReactComponent as PluginIcon } from 'assets/icons/plugins.svg'
import { ReactComponent as WalletIcon } from 'assets/icons/wallet.svg'
import { ReactComponent as ChatIcon } from 'assets/icons/chat.svg'
import { Layout } from 'components/common/Layout/Layout'
import { fetchUserProfile } from 'redux/slice/userProfile/actionCreators'
import { fetchWallets } from 'redux/slice/walletsSlice'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import { notifyError, notifySuccess } from 'components/common/notifications'
import { resetError } from 'redux/slice/error/error.slice'
import { resetSuccess } from 'redux/slice/success/success.slice'
import { ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const menuStructure = [
  {
    title: 'Dashboard',
    link: AppRoute.DASHBOARD,
    icon: <DashboardIcon />,
  },
  {
    title: 'Transactions',
    link: AppRoute.TRANSACTIONS,
    icon: <TransactionIcon />,
  },
  {
    title: 'Invoices',
    link: AppRoute.INVOICES,
    icon: <InvoiceIcon />,
  },
  {
    title: 'My Wallets',
    link: AppRoute.MY_WALLETS,
    icon: <WalletIcon />,
  },
  {
    title: 'Widgets',
    link: AppRoute.WIDGETS,
    icon: <PluginIcon />,
  },
  {
    title: 'Moneybox',
    link: AppRoute.MONEY_BOX,
    icon: <MoneyBoxIcon />,
  },
  {
    title: 'Chats',
    link: AppRoute.CHATS,
    icon: <ChatIcon />,
  },
  {
    title: 'Settings',
    link: AppRoute.SETTINGS,
    icon: <SettingsIcon />,
  },
]

const PortalPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const error = useAppSelector((state) => state.error.message)
  const success = useAppSelector((state) => state.success.message)

  useEffect(() => {
    error && notifyError(error)
    success && notifySuccess(success)
    dispatch(resetError())
    dispatch(resetSuccess())
  }, [error, success])

  useEffect(() => {
    dispatch(fetchUserProfile())
    dispatch(fetchWallets(''))
  }, [dispatch])

  return (
    <div className="flex overflow-hidden">
      <SideBar
        logoLink={AppRoute.DASHBOARD}
        structure={menuStructure}
        screen="desktop"
      />
      <div className="w-full h-screen sticky top-0 ">
        <Header />
        <Layout>
          <Outlet />
        </Layout>
      </div>
      <ToastContainer transition={Zoom} />
    </div>
  )
}

export default PortalPage
