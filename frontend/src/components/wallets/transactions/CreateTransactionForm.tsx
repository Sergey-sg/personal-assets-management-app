import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React, { useState } from 'react'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { Typography } from 'components/common/Typography'
import { InputField } from 'components/common/inputs/InputField'
import { Button } from 'components/common/buttons/Button'
import RegExp from 'assets/RegExp'
import { convertToСoins } from '../helpers/convertFunction'
import { AsyncThunk } from '@reduxjs/toolkit'
import clsx from 'clsx'
import { CostsCategories } from 'common/enums/costsCategories.enum'
import { IncomeCategories } from 'common/enums/incomesCategories.enum'
import { wordToUC } from '../helpers/wordToUC'

interface ICreateTransactionFormProps {
  transactionName: 'income_name' | 'cost_name'
  transactionSumName: 'income_sum' | 'cost_sum'
  submitFunction: AsyncThunk<any, any, { rejectValue: string }>
  limit: number
  title: string
  labelName: string
  placeholderName: string
  labelSum: string
  buttonLabel: string
  isShow: boolean
  categories: CostsCategories[] | IncomeCategories[]
  loading: boolean
}

export const CreateTransactionForm: React.FC<ICreateTransactionFormProps> = ({
  transactionName,
  transactionSumName,
  submitFunction,
  limit,
  title,
  labelName,
  placeholderName,
  labelSum,
  buttonLabel,
  isShow,
  categories,
  loading,
}) => {
  const [tramsactionSum, setTramsactionSum] = useState(0)
  const [isPositiveSum, setIsPositiveSum] = useState(false)

  const dispatch = useAppDispatch()
  const currentWalet = useAppSelector((state) => state.wallets.activeWallet)

  const InitialValues = {
    [transactionName]: '',
    [transactionSumName]: tramsactionSum,
    category_name: categories[0],
  }

  const ValidationSchema = Yup.object({
    [transactionName]: Yup.string()
      .min(3, 'Must be at least 3 letters')
      .max(32, 'Must be max 32 letters')
      .required('Enter income name'),
    [transactionSumName]: Yup.number(),
  })

  const handleSubmit = (
    values: typeof InitialValues,
    actions: FormikHelpers<typeof InitialValues>,
  ) => {
    if (currentWalet) {
      const forSubmit = {
        walletId: currentWalet,
        limit,
        data: {
          ...values,
          [transactionSumName]: convertToСoins(tramsactionSum),
        },
      }

      dispatch(submitFunction(forSubmit))
    }

    actions.resetForm({
      values: {
        [transactionName]: '',
        [transactionSumName]: 0,
        category_name: categories[0],
      },
    })
    setTramsactionSum(0)
    setIsPositiveSum(false)
  }

  const checkSum = (value: string) => {
    if (!value.match(RegExp.POSITIVE_DECIMAL_NUMBER)) {
      return setTramsactionSum(tramsactionSum)
    }
    setTramsactionSum(+value)
  }

  return (
    <div className={clsx('min-h-min', isShow ? 'block' : 'hidden')}>
      <Formik
        initialValues={InitialValues}
        validationSchema={ValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ dirty, isValid }) => {
          return (
            <Form>
              <Typography className="mb-4" type="h4">
                {title}
              </Typography>
              <InputField
                label={labelName}
                name={transactionName}
                type="text"
                placeholder={placeholderName}
              />
              <div className="flex justify-around my-4">
                <InputField
                  onChange={(e) => {
                    checkSum(e.target.value)
                    ;+e.target.value > 0
                      ? setIsPositiveSum(true)
                      : setIsPositiveSum(false)
                  }}
                  label={labelSum}
                  value={+tramsactionSum}
                  name={transactionSumName}
                  type="number"
                  className="w-7/12"
                />
                <div className="flex flex-col justify-end">
                  <label htmlFor="category">
                    <Typography type={'Ag-14-regular'}>Category</Typography>
                  </label>
                  <Field
                    id="category"
                    name="category_name"
                    as="select"
                    className="rounded-md border-green-light text-gray-700"
                  >
                    {categories.map((category) => (
                      <option
                        className="text-gray-700"
                        key={category}
                        value={category}
                      >
                        {wordToUC(category)}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>
              <Button
                label={buttonLabel}
                type="submit"
                btnName="primary"
                disabled={!(isValid && dirty && isPositiveSum && !loading)}
              />
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
