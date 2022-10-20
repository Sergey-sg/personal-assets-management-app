import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React, { useState } from 'react'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { Typography } from 'components/common/Typography'
import { InputField } from 'components/common/inputs/InputField'
import RegExp from 'assets/RegExp'
import { convertToMoney, convertToСoins } from '../helpers/convertFunction'
import { AsyncThunk } from '@reduxjs/toolkit'
import { CostsCategories } from 'common/enums/costsCategories.enum'
import { IncomeCategories } from 'common/enums/incomesCategories.enum'
import { wordToUC } from '../helpers/wordToUC'
import { ReactComponent as PenIcon } from 'assets/icons/pen.svg'
import { ReactComponent as DeleteIcon } from 'assets/icons/delete-icon.svg'
import { formatCurrentDate } from '../helpers/formatDate'
import { ShowTransactionFragment } from '../helpers/enums/showTransactionFragment.enum'
import { Button } from 'components/common/buttons/Button'

interface IUpdateTransactionFormProps {
  transaction: any
  transactionName: string
  transactionSumName: string
  updateFunction: AsyncThunk<any, any, { rejectValue: string }>
  deleteFunction: AsyncThunk<any, any, { rejectValue: string }>
  limit: number
  isShow: (value: ShowTransactionFragment) => void
  title: string
  labelName: string
  placeholderName: string
  labelSum: string
  categories: CostsCategories[] | IncomeCategories[]
}

export const UpdateTransactionForm: React.FC<IUpdateTransactionFormProps> = ({
  transaction,
  transactionName,
  transactionSumName,
  updateFunction,
  deleteFunction,
  limit,
  isShow,
  title,
  labelName,
  placeholderName,
  labelSum,
  categories,
}) => {
  const [tramsactionSum, setTramsactionSum] = useState(
    convertToMoney(transaction[transactionSumName]),
  )
  const [isPositiveSum, setIsPositiveSum] = useState(true)

  const dispatch = useAppDispatch()
  const currentWalletId = useAppSelector((state) => state.wallets.activeWallet)

  const InitialValues = {
    [transactionName]: transaction[transactionName],
    [transactionSumName]: convertToMoney(transaction[transactionSumName]),
    category_name: transaction.category_name,
    createdAt: formatCurrentDate(transaction.createdAt),
  }

  const ValidationSchema = Yup.object({
    [transactionName]: Yup.string()
      .min(3, 'Must be at least 3 letters')
      .max(32, 'Must be max 32 letters')
      .required('Enter income name'),
    createdAt: Yup.date().max(new Date(), 'Cant be future'),
  })

  const checkSum = (value: string) => {
    if (!value.match(RegExp.POSITIVE_DECIMAL_NUMBER)) {
      return setTramsactionSum(tramsactionSum)
    }
    setTramsactionSum(+value)
  }

  const handleSubmit = (values: typeof InitialValues) => {
    if (transaction.id) {
      const forSubmit = {
        transactionId: transaction.id,
        walletId: currentWalletId,
        limit,
        data: {
          ...values,
          [transactionSumName]: convertToСoins(tramsactionSum),
          createdAt: new Date(values.createdAt),
        },
      }

      dispatch(updateFunction(forSubmit))
      isShow(ShowTransactionFragment.LIST)
    }
  }

  return (
    <>
      {transaction && (
        <div className="min-h-min">
          <Formik
            initialValues={InitialValues}
            validationSchema={ValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ isValid }) => {
              return (
                <Form>
                  <Typography className="mb-4" type="h4">
                    {title}
                  </Typography>
                  <div className="flex justify-start mb-5 gap-5">
                    <InputField
                      label={labelName}
                      name={transactionName}
                      type="text"
                      placeholder={placeholderName}
                      className="w-5/12"
                    />
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
                      className="w-5/12"
                    />
                  </div>
                  <div className="flex justify-start items-start gap-5 mb-4">
                    <InputField
                      label="Date"
                      type="date"
                      name="createdAt"
                      className="w-5/12"
                    />
                    <div className="flex flex-col justify-end">
                      <label className="mb-1" htmlFor="category">
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
                  <div className="flex items-center justify-around">
                    <Button
                      icon={<PenIcon />}
                      disabled={!(isValid && isPositiveSum)}
                      type="submit"
                      btnName="tertiary2"
                      label="Save"
                    />
                    <Button
                      icon={<DeleteIcon />}
                      type="button"
                      btnName="delete"
                      label="Delete"
                      onClick={() => {
                        dispatch(
                          deleteFunction({
                            transactionId: transaction.id,
                            walletId: currentWalletId,
                            limit,
                          }),
                        )
                        isShow(ShowTransactionFragment.LIST)
                      }}
                    />
                    <Button
                      type="button"
                      btnName="delete"
                      label="Cancel"
                      className="text-lime-600"
                      onClick={() => {
                        isShow(ShowTransactionFragment.LIST)
                      }}
                    />
                  </div>
                </Form>
              )
            }}
          </Formik>
        </div>
      )}
    </>
  )
}
