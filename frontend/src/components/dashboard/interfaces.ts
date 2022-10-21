import { Currency } from './types'

interface ItemMainData {
  id: number | string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Wallet extends ItemMainData {
  wallet_name: string
  status: string
  total_balance: number
  currency: Currency
}

export interface Transaction {
  isIncome: boolean
  category: string
  sum: number
}

export interface Period {
  startDate: string
  endDate: string
}

export interface BalanceItemProps {
  title: string
  currency: Currency
  amount: number
}

export interface QueryParams {
  walletId: number | string
  startDate: string
  endDate: string
}
