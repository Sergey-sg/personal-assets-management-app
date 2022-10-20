import React, { useCallback, useEffect } from 'react'
import { Button } from 'components/common/buttons/Button'
import { Select } from 'components/common/inputs/select'

import { Form, Formik, FormikProps } from 'formik'
import api from 'axios/axios'

interface AddWalletLimitsFormProps {
  walletId: number
}

const InitialValues: AddWalletLimitsFormProps = {
  walletId: 0,
}

const defaultWallet = {
  value: 0,
  name: '',
}

const AddWalletLimitsForm: React.FC = (props) => {
  const [walletsArray, setWalletsArray] = React.useState([defaultWallet])

  React.useEffect(() => {
    getWallets()
  }, [])

  const getWallets = async () => {
    api.get('/wallets').then((res: any) => {
      setWalletsArray([defaultWallet])
      res.data.map((row: { id: any; wallet_name: string }) => {
        const wallet = {
          value: row.id,
          name: row.wallet_name,
        }

        setWalletsArray((walletsArray) => [...walletsArray, wallet])
      })
    })
  }
  const handleSubmit = async (values: typeof InitialValues) => {
    await api
      .post('/walletLimits/' + values.walletId, {
        wallet_limit: 1000,
        wallet_duration: 30,
      })
      .then(() => {
        getWallets()
      })
  }

  return (
    <>
      <Formik
        initialValues={InitialValues}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {(props: FormikProps<any>) => {
          const { dirty, isValid, errors, handleBlur, handleChange, values } =
            props

          return (
            <>
              <Form onSubmit={props.handleSubmit}>
                <div className="flex flex-col gap-5 sm:flex-row">
                  <Select
                    type={'select'}
                    name={'walletId'}
                    value={props.values.walletId}
                    optionArray={walletsArray}
                    onChange={handleChange}
                    className={'w-1/2'}
                  />
                  <Button
                    label={'Add'}
                    type={'submit'}
                    btnName={'primary'}
                    className={'w-1/2'}
                  />
                </div>
              </Form>
            </>
          )
        }}
      </Formik>
    </>
  )
}

export default AddWalletLimitsForm
