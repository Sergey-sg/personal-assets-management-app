import React, { useState, useEffect } from 'react'
// import { useSearchParams } from 'react-router-dom'
import { format } from 'date-fns'

import { PrimaryInfo, WidgetsBar } from './components'
import { Wallet, Transaction, Period } from './interfaces'

import { fetchReportForPeriod, fetchWallets } from './service/api'
import { Totals } from './types'

const now = new Date()
const year = now.getFullYear()
const month = now.getMonth()
const firstDayOfMonth = format(new Date(year, month, 1), 'yyyy-MM-dd')
const today = format(now, 'yyyy-MM-dd')

const initialPeriod: Period = {
  startDate: firstDayOfMonth,
  endDate: today,
}

const Reports = () => {
  // const [searchParams, setSearchParams] = useSearchParams({})

  const [period, setPeriod] = useState<Period>(initialPeriod)
  const [wallets, setWallets] = useState<Array<Wallet>>([])
  const [selectedWallet, setSelectedWallet] = useState<Wallet>({} as Wallet)
  const [totals, setTotals] = useState<Totals>({
    incomeSum: 0,
    outcomeSum: 0,
  })
  const [transactions, setTransactions] = useState<Transaction[]>(
    [] as Transaction[],
  )

  useEffect(() => {
    const getWallets = async () => {
      const data = await fetchWallets()

      const sortedWallets = data?.sort((a: Wallet, b: Wallet) =>
        a.wallet_name > b.wallet_name ? 1 : -1,
      )

      setWallets(sortedWallets)
      setSelectedWallet(sortedWallets[0])
    }

    getWallets()
  }, [])

  const getPeriodData = async (selectedWalletId: number | string) => {
    if (!selectedWalletId) return

    const { periodReport, sums } = await fetchReportForPeriod(
      selectedWalletId,
      period.startDate,
      period.endDate,
    )

    const newTotals = { incomeSum: 0, outcomeSum: 0 }

    sums.forEach((s: { isIncome: boolean; sum: number }) => {
      if (s.isIncome === true) {
        return (newTotals.incomeSum = s.sum / 100)
      } else return (newTotals.outcomeSum = s.sum / 100)
    })

    setTotals(newTotals)
    setTransactions(periodReport)
  }

  useEffect(() => {
    getPeriodData(selectedWallet.id)
  }, [selectedWallet])

  const onWalletChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const walletName = e.target.value
    const targetWallet = wallets.find((w) => w.wallet_name === walletName)

    targetWallet && setSelectedWallet(targetWallet)
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setPeriod((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault()

    setPeriod((prev) => {
      return { ...prev, ...period }
    })

    getPeriodData(selectedWallet.id)
  }

  return (
    <>
      <div className="flex gap-2 h-screen">
        <PrimaryInfo
          selectedWallet={selectedWallet}
          totals={totals}
          wallets={wallets}
          onWalletChange={onWalletChange}
          transactions={transactions}
          period={period}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
        <WidgetsBar />
      </div>
    </>
  )
}

export default Reports
