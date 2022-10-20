import { Currencies } from 'common/enums/currency.enum'
import React from 'react'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { Typography } from 'components/common/Typography'
import { InputField } from 'components/common/inputs/InputField'
import { Button } from 'components/common/buttons/Button'
import { ReactComponent as Cross } from '../../assets/icons/cross-icon.svg'
import { addNewWallets, IWalletDto } from 'redux/slice/walletsSlice'
import { useAppDispatch } from 'hooks/useAppDispatch'

interface AddWalletFormProps {
  toggleShowAddForm: () => void
}

export const AddWalletForm: React.FC<AddWalletFormProps> = ({
  toggleShowAddForm,
}) => {
  const dispatch = useAppDispatch()
  const currency = Object.values(Currencies)

  const InitialValues: IWalletDto = {
    wallet_name: '',
    currency: Currencies.UAH,
  }

  const ValidationSchema = Yup.object({
    wallet_name: Yup.string()
      .min(3, 'Must be at least 3 letters')
      .max(32, 'Must be max 32 letters')
      .required('Enter your wallet name'),
  })

  const handleSubmit = (values: typeof InitialValues) => {
    dispatch(addNewWallets(values))
    toggleShowAddForm()
  }

  return (
    <div className="mt-5 w-11/12 p-3 bg-gray-100 rounded-md">
      <Formik
        initialValues={InitialValues}
        validationSchema={ValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ dirty, isValid }) => {
          return (
            <Form>
              <Typography className="mb-4" type="h4">
                New Wallet
              </Typography>
              <InputField
                label="Wallet Name"
                name="wallet_name"
                type="text"
                placeholder="My Wallet"
              />
              <div className="flex items-center justify-around my-2">
                <label htmlFor="currency">Currency</label>
                <Field
                  id="currency"
                  name="currency"
                  as="select"
                  className="rounded-md border-green-light"
                >
                  {currency.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="flex justify-around">
                <Button
                  label="Create Wallet"
                  type="submit"
                  btnName="primary"
                  disabled={!(isValid && dirty)}
                />
                <Button
                  label="Cancel"
                  type="button"
                  btnName="delete"
                  icon={<Cross />}
                  onClick={toggleShowAddForm}
                />
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
