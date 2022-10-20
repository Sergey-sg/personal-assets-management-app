import React from 'react'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { InputField } from 'components/common/inputs/InputField'
import { Button } from 'components/common/buttons/Button'
import { ReactComponent as Cross } from 'assets/icons/cross-icon.svg'
import { ReactComponent as OkIcon } from 'assets/icons/ok-icon.svg'
import { updateWallet, IWallet } from 'redux/slice/walletsSlice'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import { ShowWalletFooter } from './Wallet'
import { LoadingStatus } from 'common/enums/loading-status'

interface IUpdateWalletFormProps {
  wallet: IWallet
  setWalletFooter: (value: ShowWalletFooter) => void
}

export const UpdateWalletForm: React.FC<IUpdateWalletFormProps> = ({
  setWalletFooter,
  wallet,
}) => {
  const dispatch = useAppDispatch()
  const loading = useAppSelector((state) => state.wallets.loading)

  const InitialValues = {
    wallet_name: wallet.wallet_name,
  }

  const ValidationSchema = Yup.object({
    wallet_name: Yup.string()
      .min(3, 'Must be at least 3 letters')
      .max(32, 'Must be max 32 letters')
      .required('Enter your wallet name'),
  })

  const handleSubmit = (values: typeof InitialValues) => {
    dispatch(updateWallet({ data: values, walletId: wallet.id }))
    setWalletFooter(ShowWalletFooter.CLOSE)
  }

  return (
    <Formik
      initialValues={InitialValues}
      validationSchema={ValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ dirty, isValid }) => {
        return (
          <Form className="my-3">
            <InputField
              label="Wallet Name"
              name="wallet_name"
              type="text"
              placeholder="My Wallet"
            />
            <div className="flex justify-around">
              <Button
                label="Save"
                type="submit"
                btnName="tertiary2"
                icon={<OkIcon />}
                disabled={
                  !(isValid && dirty && loading !== LoadingStatus.LOADING)
                }
              />
              <Button
                label="Cancel"
                type="button"
                btnName="delete"
                icon={<Cross />}
                onClick={() => {
                  setWalletFooter(ShowWalletFooter.CLOSE)
                }}
              />
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}
