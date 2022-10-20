import React, { useEffect, useState } from 'react'
import { TransactionLinks } from '../TransactionLinks'
import {
  addNewIncome,
  deleteIncome,
  fetchIncomes,
  fetchMoreIncomes,
  IGetMoreIncomesParams,
  setCurrentIncome,
  setOffset,
  updateIncome,
} from 'redux/slice/incomeSlice'
import { CreateTransactionForm } from '../CreateTransactionForm'
import { TransactionsItem } from '../TransactionsItem'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import clsx from 'clsx'
import { Button } from 'components/common/buttons/Button'
import { Typography } from 'components/common/Typography'
import { Link } from 'react-router-dom'
import { IncomeCategories } from 'common/enums/incomesCategories.enum'
import { UpdateTransactionForm } from '../UpdateTransactionForm'
import { ShowTransactionFragment } from 'components/wallets/helpers/enums/showTransactionFragment.enum'
import { notifyError, notifySuccess } from 'components/common/notifications'
import { LoadingStatus } from 'common/enums/loading-status'

export const IncomesList: React.FC = () => {
  const [showFragment, setShowFragment] = useState<ShowTransactionFragment>(
    ShowTransactionFragment.LIST,
  )

  const dispatch = useAppDispatch()
  const limit = useAppSelector((state) => state.incomes.limit)
  const offset = useAppSelector((state) => state.incomes.offset)
  const incomes = useAppSelector((state) => state.incomes.incomes)
  const currency = useAppSelector((state) => state.incomes.currency)
  const currentWalletId = useAppSelector((state) => state.wallets.activeWallet)
  const wallets = useAppSelector((state) => state.wallets.wallets)
  const incomeCount = useAppSelector((state) => state.incomes.income_count)
  const error = useAppSelector((state) => state.incomes.errorMessage)
  const currentIncome = useAppSelector((state) => state.incomes.currentIncome)
  const loading = useAppSelector((state) => state.incomes.loading)
  const success = useAppSelector((state) => state.incomes.successMessage)
  const categories = Object.values(IncomeCategories)

  useEffect(() => {
    setShowFragment(ShowTransactionFragment.LIST)
    if (currentWalletId) {
      dispatch(
        fetchIncomes({
          walletId: currentWalletId,
          limit,
        }),
      )
    }
  }, [currentWalletId])

  useEffect(() => {
    error && error !== '' && notifyError(error)
  }, [error])

  useEffect(() => {
    success && success !== '' && notifySuccess(success)
  }, [success])

  const getMoreIncomes = (params: IGetMoreIncomesParams) => {
    const incomeResidue = incomeCount - incomes.length

    if (incomeResidue < limit) {
      dispatch(setOffset(offset + incomeResidue))

      return dispatch(fetchMoreIncomes(params))
    }
    dispatch(setOffset(offset + limit))
    dispatch(fetchMoreIncomes(params))
  }

  return (
    <div className="col-span-2 px-4">
      {currentWalletId && wallets?.length > 0 ? (
        <>
          <TransactionLinks
            show={showFragment}
            setShow={setShowFragment}
            title={'My Incomes'}
            listName={'Wallets Income'}
            createName={'Cleate Income'}
          />
          <div className="bg-gray-300 h-px my-3"></div>
          {incomes?.length === 0 &&
            showFragment === ShowTransactionFragment.LIST && (
              <div className="flex items-center justify-center mt-5">
                <Typography type="Ag-18-semibold">
                  You dont have any incomes yet
                </Typography>
                <Link
                  className="ml-4  transition-colors hover:underline hover:underline-offset-4 hover:text-lime-500"
                  to="#"
                  onClick={() => {
                    setShowFragment(ShowTransactionFragment.CREATE)
                  }}
                >
                  Add Income
                </Link>
              </div>
            )}
          <div
            className={clsx(
              'overflow-auto h-80 overflow-x-hidden',
              showFragment === ShowTransactionFragment.LIST
                ? 'block'
                : 'hidden',
            )}
          >
            <ul>
              {incomes?.map((income) => (
                <TransactionsItem
                  type="income"
                  currency={currency}
                  name={income.income_name}
                  key={income.id}
                  sum={income.income_sum}
                  date={income.createdAt}
                  isTransaction={income.is_transaction}
                  category={income.category_name}
                  setShow={setShowFragment}
                  transaction={income}
                  setTransaction={setCurrentIncome}
                />
              ))}
            </ul>
            {incomeCount > incomes?.length && (
              <Button
                label="Show more"
                type="button"
                btnName="secondary2"
                disabled={loading === LoadingStatus.LOADING}
                onClick={() => {
                  if (currentWalletId) {
                    getMoreIncomes({
                      walletId: currentWalletId,
                      limit,
                      offset,
                    })
                  }
                }}
              />
            )}
          </div>
          <CreateTransactionForm
            transactionName="income_name"
            transactionSumName="income_sum"
            submitFunction={addNewIncome}
            limit={limit}
            title="Add income"
            labelName="Income name"
            placeholderName="My Income"
            labelSum="Income amount"
            buttonLabel="Create Income"
            isShow={showFragment === ShowTransactionFragment.CREATE}
            categories={categories}
            loading={loading === LoadingStatus.LOADING}
          />
          {showFragment === ShowTransactionFragment.UPDATE && currentIncome && (
            <UpdateTransactionForm
              transaction={currentIncome}
              transactionName="income_name"
              transactionSumName="income_sum"
              updateFunction={updateIncome}
              deleteFunction={deleteIncome}
              limit={limit}
              isShow={setShowFragment}
              title="Update income"
              labelName="Income name"
              placeholderName="My Income"
              labelSum="Income amount"
              categories={categories}
            />
          )}
        </>
      ) : (
        <Typography type="Ag-18-semibold">Add Wallets</Typography>
      )}
    </div>
  )
}
