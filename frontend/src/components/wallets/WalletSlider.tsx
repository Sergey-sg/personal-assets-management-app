import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React from 'react'
import { setFirstIndex, setLastIndex } from 'redux/slice/walletsSlice'
import { ReactComponent as Down } from '../../assets/icons/slide-down.svg'
import { ReactComponent as Up } from '../../assets/icons/slide-up.svg'
import { Wallet } from './Wallet'

interface IWalletSliderProps {
  setActiveWalletId: (value: number) => void
}

export const WalletSlider: React.FC<IWalletSliderProps> = ({
  setActiveWalletId,
}) => {
  const dispatch = useAppDispatch()

  const wallets = useAppSelector((state) => state.wallets.wallets)
  const firstWalletIndex = useAppSelector(
    (state) => state.wallets.firstWalletIndex,
  )
  const lastWalletIndex = useAppSelector(
    (state) => state.wallets.lastWalletIndex,
  )

  const nextWallet = () => {
    if (lastWalletIndex >= wallets.length - 1) {
      dispatch(setFirstIndex(0))
      dispatch(setLastIndex(2))
    } else {
      dispatch(setFirstIndex(firstWalletIndex + 1))
      dispatch(setLastIndex(lastWalletIndex + 1))
    }
  }

  const prewWallet = () => {
    if (firstWalletIndex <= 0) {
      dispatch(setFirstIndex(wallets.length - 3))
      dispatch(setLastIndex(wallets.length - 1))
    } else {
      dispatch(setFirstIndex(firstWalletIndex - 1))
      dispatch(setLastIndex(lastWalletIndex - 1))
    }
  }

  return (
    <>
      <div
        className="flex justify-center mb-5 cursor-pointer hover:scale-105"
        onClick={prewWallet}
      >
        <Up />
      </div>
      <ul className="grid grid-cols-1 gap-y-5">
        {wallets &&
          wallets.map(
            (wallet, index) =>
              index >= firstWalletIndex &&
              index <= lastWalletIndex && (
                <Wallet
                  key={wallet.id}
                  wallet={wallet}
                  onClick={setActiveWalletId}
                />
              ),
          )}
      </ul>
      <div
        className="flex justify-center mt-5 cursor-pointer hover:scale-105"
        onClick={nextWallet}
      >
        <Down />
      </div>
    </>
  )
}
