import clsx from 'clsx'
import { Typography } from 'components/common/Typography'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { ShowTransactionFragment } from '../helpers/enums/showTransactionFragment.enum'

interface ITransactionLinksProps {
  show: ShowTransactionFragment
  setShow: (value: ShowTransactionFragment) => void
  title: string
  listName: string
  createName: string
}

export const TransactionLinks: React.FC<ITransactionLinksProps> = ({
  show,
  setShow,
  title,
  listName,
  createName,
}) => {
  return (
    <>
      <Typography type="h4">{title}</Typography>
      <nav>
        <ul className="mt-2 flex">
          <li>
            <NavLink
              className={clsx(
                'text-gray-500 hover:text-lime-500 transition-colors hover:underline hover:underline-offset-4 mr-3',
                show === ShowTransactionFragment.LIST
                  ? 'text-black underline underline-offset-4 font-bold'
                  : '',
              )}
              onClick={() => {
                setShow(ShowTransactionFragment.LIST)
              }}
              to="#"
            >
              {listName}
            </NavLink>
          </li>
          <li>
            <NavLink
              className={clsx(
                'text-gray-500 hover:text-lime-500 transition-colors hover:underline hover:underline-offset-4',
                show === ShowTransactionFragment.CREATE
                  ? 'text-black underline underline-offset-4 font-bold'
                  : '',
              )}
              onClick={() => {
                setShow(ShowTransactionFragment.CREATE)
              }}
              to="#"
            >
              {createName}
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  )
}
