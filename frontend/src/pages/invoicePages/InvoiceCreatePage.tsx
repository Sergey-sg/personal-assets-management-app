import { AppRoute } from 'common/enums/app-route.enum'
import { notifyError, notifySuccess } from 'components/common/notifications'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactTextareaAutosize from 'react-textarea-autosize'
import { resetError } from 'redux/slice/error/error.slice'
import { fetchCreateInvoice } from 'redux/slice/invoiceServices/invoiceActions'
import { resetSuccess } from 'redux/slice/success/success.slice'
import { BasicInfo } from './invoice_componetns/BasicInfo'
import { ClientDetails } from './invoice_componetns/ClientDetails'
import { FooterItems } from './invoice_componetns/FooterItems'
import { InputItemForm } from './invoice_componetns/InputItemForm'
import {
  HeaderItems,
  InvoiceInfoBaner,
  InvoiceItemsList,
  MagloBaner,
} from './invoice_componetns/statics'
import { sum } from './secondaryFunctions/secondaryFunctions'

const InvoiceCreatePage: React.FC = () => {
  const dispatch = useAppDispatch()
  const error = useAppSelector((state) => state.error.message)
  const success = useAppSelector((state) => state.success.message)
  const createdInvoice = useAppSelector((state) => state.invoices.invoices[0])
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState({
    invoiceDetails: '',
    total: 0,
    dueDate: '',
    invoiceDate: '',
    discount: 0,
  })
  const [billedTo, setBilledTo] = useState({})
  const [invoiceItems, setInvoiceItems] = useState([{}])
  const [subTotal, setSubTotal] = useState(0)
  const issuedDate = new Date()

  useEffect(() => {
    console.log('satrt useEffect')
    error && notifyError(error)
    success && notifySuccess(success)
    if (success === 'Invoice created successfully' && createdInvoice) {
      navigate(
        `/${AppRoute.PORTAL}/${AppRoute.INVOICES}/${AppRoute.INVOICE_DETAILS}/${createdInvoice.id}`,
      )
    }
    dispatch(resetError())
    dispatch(resetSuccess())
  }, [error, success, createdInvoice])

  const setNewItem = useCallback(
    (item: {
      subTotal: number
      id: number
      name: string
      amount: number
      price: number
    }) => {
      if (Object.keys(invoiceItems[0]).length > 0) {
        setInvoiceItems([...invoiceItems, item])
      } else {
        setInvoiceItems([item])
      }

      const sumSubTotal =
        sum(invoiceItems.map((item: any) => item.subTotal)) + item.subTotal
      const total = Math.round((sumSubTotal * (100 - invoice.discount)) / 100)

      setSubTotal(sumSubTotal)
      setInvoice({ ...invoice, total: total })
    },
    [invoiceItems, subTotal, invoice],
  )

  const sendInvoice = useCallback(() => {
    const items = invoiceItems.map(({ id, ...item }: any) => item)
    const newInvoice = { ...invoice, billedTo: billedTo, items }

    dispatch(fetchCreateInvoice(newInvoice))
  }, [invoiceItems, invoice, billedTo])

  const setDiscount = useCallback(
    (discount: number) => {
      const total = Math.round((subTotal * (100 - discount)) / 100)

      setInvoice({ ...invoice, total: total, discount: discount })
    },
    [invoice],
  )

  return (
    <div className="container mx-auto mb-10">
      <div className="container py-4 grid grid-cols-1 lg:grid-cols-10 gap-4">
        <div className="container col-span-1 lg:col-span-7 md:col-span-7 px-10">
          <MagloBaner />
          <br />
          <InvoiceInfoBaner
            invoice={invoice}
            billedTo={billedTo}
            issuedDate={issuedDate}
          />
          <br />
          <div>
            <div className="text-base font-bold mb-3">Item Details</div>
            <ReactTextareaAutosize
              className="w-full border-none rounded-xl focus:border-green-hover focus:ring-green-hover focus:ring-1"
              name="detail"
              placeholder="Details item with more info"
              onChange={(e) =>
                setInvoice({ ...invoice, invoiceDetails: e.target.value })
              }
              value={invoice.invoiceDetails}
              maxLength={500}
            />
            <br />
            <br />
            <div className="w-full">
              <HeaderItems />
              <br />
              {Object.keys(invoiceItems[0]).length > 0 && (
                <InvoiceItemsList items={invoiceItems} />
              )}
            </div>
            <br />
            <InputItemForm
              setItem={(item: any) => {
                setNewItem(item)
              }}
            />
            <br />
            <FooterItems
              invoice={invoice}
              subTotal={subTotal}
              total={invoice.total}
              setDiscount={(discount: number) => setDiscount(discount)}
            />
          </div>
        </div>
        <div className="container lg:col-span-3 col-span-1">
          <ClientDetails
            setCustomer={useCallback(
              (customer: any) => setBilledTo(customer),
              [billedTo],
            )}
          />
          <br />
          <BasicInfo
            setDate={useCallback(
              (date: { invoiceDate: string; dueDate: string }) =>
                setInvoice({ ...invoice, ...date }),
              [invoice],
            )}
            sendInvoice={sendInvoice}
            date={{
              dueDate: invoice.dueDate,
              invoiceDate: invoice.invoiceDate,
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default InvoiceCreatePage
