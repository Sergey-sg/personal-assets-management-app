import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React, { useEffect, useState } from 'react'
import { fetchWallets, setActiveWallet } from 'redux/slice/walletsSlice'
import { Wallet } from './Wallet'
import { Button } from 'components/common/buttons/Button'
import { ReactComponent as AddIcon } from '../../assets/icons/add-icon.svg'
import { AddWalletForm } from './AddWalletForm'
import { ToastContainer, Zoom } from 'react-toastify'
import { notifyError, notifySuccess } from 'components/common/notifications'
import { WalletSlider } from './WalletSlider'

export const WalletsList: React.FC = () => {
  const [showForm, setShowForm] = useState(false)

  const toggleShowAddForm = () => {
    setShowForm(!showForm)
  }

  const dispatch = useAppDispatch()

  const { wallets,
    activeWallet,
    errorMessage,
    successMessage } = useAppSelector((state) => state.wallets)
  const { incomes } = useAppSelector((state) => state.incomes)
  const { costs } = useAppSelector((state) => state.costs)

  useEffect(() => {
    dispatch(fetchWallets(''))
  }, [incomes, costs])

  useEffect(() => {
    errorMessage && errorMessage !== '' && notifyError(errorMessage)
  }, [errorMessage])

  useEffect(() => {
    successMessage && successMessage !== '' && notifySuccess(successMessage)
  }, [successMessage])

  const setActiveWalletId = (walletId: number) => {
    if (walletId === activeWallet) return null
    dispatch(setActiveWallet(walletId))
  }

  return (
    <div className="row-span-2">
      {wallets.length > 3 && (
        <WalletSlider setActiveWalletId={setActiveWalletId} />
      )}

      {wallets.length <= 3 && (
        <ul className="grid grid-cols-1 gap-y-5">
          {wallets &&
            wallets.map((wallet) => (
              <Wallet
                key={wallet.id}
                wallet={wallet}
                onClick={setActiveWalletId}
              />
            ))}
        </ul>
      )}

      {showForm ? (
        <AddWalletForm toggleShowAddForm={toggleShowAddForm} />
      ) : (
        <div className="flex mt-4 w-11/12">
          <Button
            icon={<AddIcon />}
            type="button"
            btnName={'primary'}
            label="Add Wallet"
            onClick={toggleShowAddForm}
          />
        </div>
      )}

      <ToastContainer transition={Zoom} />
    </div>
  )
}
