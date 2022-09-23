import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import MenuItem from './MenuItem'
import { Typography } from '../common/Typography/Typography'
import LogoutButton from '../common/buttons/LogoutButton'

interface MenuStructureItem {
  title: string
  link: string
  icon: ReactNode | string | null
}

interface SideBarProps {
  logoLink: string
  structure: MenuStructureItem[]
}

const SideBar: React.FC<SideBarProps> = ({ logoLink, structure }) => {
  return (
    <div className="sticky top-0 hidden bg-gray-ultralight md:block px-6 pt-7 h-screen md:max-w-[274px] w-full">
      <Link to={logoLink} className="block w-[145px] h-[42px] mb-10">
        <Typography type={'h1'}>{'MyFinance'}</Typography>
      </Link>

      <nav className="flex flex-col justify-between h-5/6">
        <div>
          {structure.map(({ link, title, icon }) => (
            <MenuItem key={link} link={link} label={title} icon={icon} />
          ))}
        </div>
        <div className="pl-4 text-gray  hover:text-gray-dark fill-gray hover:fill-gray-dark transition">
          <LogoutButton />
        </div>
      </nav>
    </div>
  )
}

export default SideBar
