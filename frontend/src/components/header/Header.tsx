import React, { useState } from 'react'
import { Typography } from 'components/common/Typography'
import { useLocation } from 'react-router-dom'
import { Logo } from './Logo/Logo'
import { ReactComponent as NotificationIcon } from 'assets/icons/notification.svg'
import { AvatarForm } from './Avatar/AvatarForm'
import { Modal } from 'components/sideBar/Modal/Modal'
import { SideBar } from 'components/sideBar/SideBar'
import { menuStructure } from 'pages/PortalPage'
import { AppRoute } from 'common/enums/app-route.enum'

export const Header: React.FC = () => {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const title = location.pathname?.split('/')[2]?.replace(/-/g, ' ')

  return (
    <>
      <header className="sticky w-full h-[90px] flex justify-between items-center py-6 px-11 pl-9 border-b border-b-neutral-200">
        <div>
          <div className="block md:hidden">
            <Logo size={'mobile'} onClick={() => setOpen(true)} />
          </div>
          <div className="hidden md:block">
            <Typography type={'h2'} className=" capitalize">
              {title}
            </Typography>
          </div>
        </div>
        <div className="flex items-center ml-auto">
          <NotificationIcon title="Notifications" className="mr-6 h-7 w-7" />
          <AvatarForm />
        </div>
      </header>
      <Modal onClose={() => setOpen(false)} open={open}>
        <SideBar
          logoLink={AppRoute.DASHBOARD}
          structure={menuStructure}
          screen="mobile"
        />
      </Modal>
    </>
  )
}
