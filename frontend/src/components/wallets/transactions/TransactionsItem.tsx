import { Typography } from 'components/common/Typography'
import React from 'react'
import ArrowUp from '../../../assets/icons/arrow-up.svg'
import ArrowDown from '../../../assets/icons/arrow-down.svg'
import Cross from '../../../assets/icons/cross-icon.svg'
import { ReactComponent as SettingIcon } from '../../../assets/icons/settings.svg'
import { Currencies } from 'common/enums/currency.enum'
import { currencyIcon } from '../helpers/currencyIcon'
import { convertToMoney } from '../helpers/convertFunction'
import { formatDate } from '../helpers/formatDate'
import { IncomeCategories } from 'common/enums/incomesCategories.enum'
import { CostsCategories } from 'common/enums/costsCategories.enum'
import { wordToUC } from '../helpers/wordToUC'
import { ShowTransactionFragment } from '../helpers/enums/showTransactionFragment.enum'
import { useAppDispatch } from 'hooks/useAppDispatch'

interface ITransactionsItemProps {
  type: 'income' | 'cost'
  currency: Currencies
  name: string
  sum: number
  date: Date
  isTransaction: boolean
  category: IncomeCategories | CostsCategories
  setShow: (value: ShowTransactionFragment) => void
  transaction: any
  setTransaction: any
}

export const TransactionsItem: React.FC<ITransactionsItemProps> = ({
  type,
  currency,
  name,
  sum,
  date,
  isTransaction,
  category,
  setShow,
  transaction,
  setTransaction,
}) => {
  const dispatch = useAppDispatch()

  return (
    <li className="grid grid-rows-1 grid-cols-12 items-center justify-items-center gap-1 bg-gray-100">
      <div>
        {type === 'income' && <img src={ArrowUp} alt="arrow-up" />}
        {type === 'cost' && <img src={ArrowDown} alt="arrow-up" />}
      </div>
      <div className="flex flex-col col-span-5 items-center">
        <Typography type="Ag-16-semibold">{name}</Typography>
        <Typography className="text-zinc-500" type="Ag-16-regular">
          {formatDate(date)}
        </Typography>
      </div>
      <Typography className="col-span-2 text-slate-500" type="Ag-16-semibold">
        {wordToUC(category)}
      </Typography>
      <Typography
        className={`col-span-2 ${
          type === 'income' ? 'text-green-500' : 'text-red-500'
        }`}
        type="Ag-16-semibold"
      >
        {type === 'cost' && <span>-</span>} {currencyIcon(currency)}
        {convertToMoney(sum)}
      </Typography>
      {isTransaction ? (
        <img src={Cross} alt="cross" />
      ) : (
        <div className="col-span-2">
          <button
            onClick={() => {
              dispatch(setTransaction(transaction))
              setShow(ShowTransactionFragment.UPDATE)
            }}
            className="inline-block p-4 hover:scale-110"
          >
            <SettingIcon />
          </button>
        </div>
      )}
    </li>
  )
}
