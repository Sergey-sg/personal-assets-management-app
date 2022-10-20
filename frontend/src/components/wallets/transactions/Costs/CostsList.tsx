import React, { useEffect, useState } from 'react'
import { TransactionLinks } from '../TransactionLinks'
import { CreateTransactionForm } from '../CreateTransactionForm'
import {
  addNewCost,
  deleteCost,
  fetchCosts,
  fetchMoreCosts,
  IGetMoreCostsParams,
  setCurrentCost,
  setOffset,
  updateCost,
} from 'redux/slice/costsSlice'
import { TransactionsItem } from '../TransactionsItem'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import { Button } from 'components/common/buttons/Button'
import { Typography } from 'components/common/Typography'
import { Link } from 'react-router-dom'
import { CostsCategories } from 'common/enums/costsCategories.enum'
import { ShowTransactionFragment } from 'components/wallets/helpers/enums/showTransactionFragment.enum'
import { UpdateTransactionForm } from '../UpdateTransactionForm'
import { notifyError, notifySuccess } from 'components/common/notifications'
import { LoadingStatus } from 'common/enums/loading-status'

export const CostsList: React.FC = () => {
  const [showFragment, setShowFragment] = useState<ShowTransactionFragment>(
    ShowTransactionFragment.LIST,
  )

  const dispatch = useAppDispatch()
  const limit = useAppSelector((state) => state.costs.limit)
  const offset = useAppSelector((state) => state.costs.offset)
  const costs = useAppSelector((state) => state.costs.costs)
  const currency = useAppSelector((state) => state.costs.currency)
  const currentWalletId = useAppSelector((state) => state.wallets.activeWallet)
  const wallets = useAppSelector((state) => state.wallets.wallets)
  const costsCount = useAppSelector((state) => state.costs.costs_count)
  const error = useAppSelector((state) => state.costs.errorMessage)
  const currentCost = useAppSelector((state) => state.costs.currentCost)
  const loading = useAppSelector((state) => state.costs.loading)
  const success = useAppSelector((state) => state.costs.successMessage)
  const categories = Object.values(CostsCategories)

  useEffect(() => {
    setShowFragment(ShowTransactionFragment.LIST)
    if (currentWalletId) {
      dispatch(
        fetchCosts({
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

  const getMoreCosts = (params: IGetMoreCostsParams) => {
    const costsResidue = costsCount - costs.length

    if (costsResidue < limit) {
      dispatch(setOffset(offset + costsResidue))

      return dispatch(fetchMoreCosts(params))
    }
    dispatch(setOffset(offset + limit))
    dispatch(fetchMoreCosts(params))
  }

  return (
    <div className="col-span-2 px-4 mt-5">
      {currentWalletId && wallets.length > 0 ? (
        <>
          <TransactionLinks
            show={showFragment}
            setShow={setShowFragment}
            title={'My Costs'}
            listName={'Wallets Costs'}
            createName={'Cleate Cost'}
          />
          <div className="bg-gray-300 h-px my-3"></div>
          {costs?.length === 0 &&
            showFragment === ShowTransactionFragment.LIST && (
              <div className="flex items-center justify-center mt-5">
                <Typography type="Ag-18-semibold">
                  You dont have any costs yet
                </Typography>
                <Link
                  className="ml-4 underline underline-offset-4 transition-colors hover:underline hover:underline-offset-4 hover:text-lime-500"
                  to="#"
                  onClick={() => {
                    setShowFragment(ShowTransactionFragment.CREATE)
                  }}
                >
                  Add Cost
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
              {costs.map((cost) => (
                <TransactionsItem
                  type="cost"
                  currency={currency}
                  name={cost.cost_name}
                  key={cost.id}
                  sum={cost.cost_sum}
                  date={cost.createdAt}
                  isTransaction={cost.is_transaction}
                  category={cost.category_name}
                  setShow={setShowFragment}
                  transaction={cost}
                  setTransaction={setCurrentCost}
                />
              ))}
            </ul>
            {costsCount > costs?.length && (
              <Button
                label="Show more"
                type="button"
                btnName="secondary2"
                disabled={loading === LoadingStatus.LOADING}
                onClick={() => {
                  if (currentWalletId) {
                    getMoreCosts({
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
            transactionName="cost_name"
            transactionSumName="cost_sum"
            submitFunction={addNewCost}
            limit={limit}
            title="Add cost"
            labelName="Cost name"
            placeholderName="My Cost"
            labelSum="Cost amount"
            buttonLabel="Create Cost"
            isShow={showFragment === ShowTransactionFragment.CREATE}
            categories={categories}
            loading={loading === LoadingStatus.LOADING}
          />
          {showFragment === ShowTransactionFragment.UPDATE && currentCost && (
            <UpdateTransactionForm
              transaction={currentCost}
              transactionName="cost_name"
              transactionSumName="cost_sum"
              updateFunction={updateCost}
              deleteFunction={deleteCost}
              limit={limit}
              isShow={setShowFragment}
              title="Update cost"
              labelName="Cost name"
              placeholderName="My Cost"
              labelSum="Cost amount"
              categories={categories}
            />
          )}
        </>
      ) : null}
    </div>
  )
}
