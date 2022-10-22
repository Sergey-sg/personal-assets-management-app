import React, { useCallback, useEffect } from 'react'
import { Button } from 'components/common/buttons/Button'
import { Input } from 'components/common/inputs/Input'
import AddWalletLimitsForm from './AddWalletLimitFrom'

import { Field, Form, Formik, FormikProps, useFormik } from 'formik'
import { WalletLimitsSchema } from './schemas/walletLimitsSchema'
import { SectionTitle } from './SectionTitle'
import { ReactComponent as PenIcon } from 'assets/icons/pen.svg'
import api from 'axios/axios'

interface WalletLimitsFormProps {
  id: number
  wallet_name: string | number
  wallet_limit: number
  wallet_duration: number
  wallet: object
}

const InitialValues: WalletLimitsFormProps = {
  id: 0,
  wallet_name: '',
  wallet_limit: 1000,
  wallet_duration: 30,
  wallet: {
    wallet_name: '',
  },
}

const WalletLimitsForm: React.FC = () => {
  const [editWalletId, setEditWalletId] = React.useState(0)
  const [walletsArray, setWalletsArray] = React.useState([
    {
      id: 0,
      wallet_name: '',
      wallet_limit: 1000,
      wallet_duration: 30,
      wallet: {
        wallet_name: '',
      },
    },
  ])

  React.useEffect(() => {
    getWalletLimit()
  }, [])

  const handleSubmit = async (values: typeof InitialValues) => {
    const wallet_limit = values.wallet_limit
    const wallet_duration = values.wallet_duration

    // await api.post('/walletLimits/1', {
    //   wallet_limit: wallet_limit,
    //   wallet_duration: wallet_duration,
    // })

    return api
      .patch('/walletLimits/' + editWalletId, {
        wallet_limit: wallet_limit,
        wallet_duration: wallet_duration,
      })
      .then(() => {
        getWalletLimit()
      })

    // console.log('handleSubmit',values,editWalletId)
  }

  const toggleWalletBlock = useCallback((walletId: any = 0) => {
    if (editWalletId == 0) {
      setEditWalletId(walletId)
    } else {
      setEditWalletId(0)
    }
  }, [])

  const deleteWalletLimit = useCallback(() => {
    api.delete('/walletLimits/' + editWalletId).then(() => {
      getWalletLimit()
    })
  }, [editWalletId])

  const getWalletLimit = () => {
    api.get('/walletLimits').then((res: any) => {
      setWalletsArray(res.data.tmp)
    })
  }

  return (
    <>
      <SectionTitle
        title={'Wallets settings'}
        subTitle={'Create and edit wallets limits'}
      />

      <AddWalletLimitsForm />

      {walletsArray.map((row) => {
        return (
          <div key={row.id}>
            <SectionTitle
              title={`Change limits for: ${row.wallet.wallet_name}`}
              subTitle={
                'Wallet limit: ' +
                row.wallet_limit.toString() +
                ' and wallet duration: ' +
                row.wallet_duration.toString()
              }
              icon={<PenIcon />}
              iconLabel={'Edit'}
              onClick={() => {
                toggleWalletBlock(row.id)
              }}
            />

            {editWalletId == row.id && (
              <>
                <Formik
                  initialValues={row}
                  onSubmit={handleSubmit}
                  enableReinitialize={true}
                >
                  {(props: FormikProps<any>) => {
                    const {
                      dirty,
                      isValid,
                      errors,
                      handleBlur,
                      handleChange,
                      values,
                    } = props

                    return (
                      <>
                        <Form onSubmit={props.handleSubmit}>
                          <Field
                            label={'Wallet limit'}
                            name={'wallet_limit'}
                            id={'wallet_limit'}
                            placeholder={'1000'}
                            type={'number'}
                            value={values.wallet_limit}
                            error={values.wallet_limit}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            component={Input}
                            className="sm:w-1/2"
                          />
                          <Field
                            label={'Wallet duration'}
                            name={'wallet_duration'}
                            id={'wallet_duration'}
                            placeholder={'30'}
                            type={'number'}
                            value={values.wallet_duration}
                            error={values.wallet_duration}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            component={Input}
                            className="w-full sm:w-1/2"
                          />
                          <br />
                          <div className="flex flex-col gap-5 sm:flex-row">
                            <div className="w-full lg:w-1/3">
                              <Button
                                label={'Save'}
                                type={'submit'}
                                btnName={'primary'}
                              />
                            </div>
                            <div className="w-full lg:w-1/3">
                              <Button
                                label={'Delete'}
                                type={'button'}
                                onClick={deleteWalletLimit}
                                btnName={'tertiary2'}
                              />
                            </div>
                            <div className="w-full lg:w-1/3">
                              <Button
                                label={'Cancel'}
                                type={'button'}
                                onClick={toggleWalletBlock}
                                btnName={'tertiary'}
                              />
                            </div>
                          </div>
                        </Form>
                      </>
                    )
                  }}
                </Formik>
              </>
            )}
          </div>
        )
      })}
    </>
  )
}

export default WalletLimitsForm
