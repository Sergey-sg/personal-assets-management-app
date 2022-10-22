import { AppRoute } from 'common/enums/app-route.enum'
import { notifyError, notifySuccess } from 'components/common/notifications'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactTextareaAutosize from 'react-textarea-autosize'
import { resetError } from 'redux/slice/error/error.slice'
import {
  fetchGetInvoiceById,
  fetchUpdateInvoice,
} from 'redux/slice/invoiceServices/invoiceActions'
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

const InvoiceUpdatePage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { invoiceId } = useParams()
  const error = useAppSelector((state) => state.error.message)
  const success = useAppSelector((state) => state.success.message)
  const currentInvoice = useAppSelector((state) => state.invoices.invoices[0])
  const [invoice, setInvoice] = useState(currentInvoice)
  const [subTotal, setSubTotal] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    console.log('satrt useEffect')
    if (!invoice) {
      dispatch(fetchGetInvoiceById(`${invoiceId}`, true))
    }
    if (currentInvoice && !invoice) {
      setInvoice({
        ...currentInvoice,
        items: currentInvoice.items.map(
          ({ createdAt, updatedAt, ...item }: any) => item,
        ),
      })
      setSubTotal(sum(currentInvoice.items.map((item: any) => item.subTotal)))
    }
    if (success === 'Invoice updated successfully') {
      navigate(
        `/${AppRoute.PORTAL}/${AppRoute.INVOICES}/${AppRoute.INVOICE_DETAILS}/${invoice.id}`,
      )
    }
    if (error === 'Invoice does not found for user') {
      navigate(
        `/${AppRoute.PORTAL}/${AppRoute.INVOICES}/${AppRoute.INVOICE_DETAILS}/${invoiceId}`,
      )
    }

    error && notifyError(error)
    success && notifySuccess(success)
    dispatch(resetError())
    dispatch(resetSuccess())
  }, [success, error, invoice])

  const setNewItem = useCallback(
    (item: {
      subTotal: number
      id: number
      name: string
      amount: number
      price: number
    }) => {
      const sumSubTotal =
        sum(invoice.items.map((item: any) => item.subTotal)) + item.subTotal
      const total = Math.round((sumSubTotal * (100 - invoice.discount)) / 100)

      setSubTotal(sumSubTotal)
      setInvoice({ ...invoice, items: [...invoice.items, item], total: total })
    },
    [subTotal, invoice],
  )

  const sendInvoice = useCallback(() => {
    if (invoiceId && invoice.id === parseInt(invoiceId)) {
      const items = invoice.items.map(({ id, ...item }: any) => item)
      const newInvoice = { ...invoice, items }

      dispatch(fetchUpdateInvoice(invoiceId, newInvoice))
    }
  }, [invoice])

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
        {invoice && (
          <>
            <div className="container col-span-1 lg:col-span-7 md:col-span-7 px-10">
              <MagloBaner />
              <br />
              <InvoiceInfoBaner
                invoice={invoice}
                billedTo={invoice.billedTo}
                issuedDate={invoice.createdAt}
              />
              <br />
              <div>
                <div className="text-base font-bold mb-3.5">Item Details</div>
                <ReactTextareaAutosize
                  className="w-full border-none rounded-xl focus:outline-none focus:border-green-hover focus:ring-green-hover focus:ring-1"
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
                  {Object.keys(invoice.items[0]).length > 0 && (
                    <InvoiceItemsList items={invoice.items} />
                  )}
                </div>
                <br />
                <InputItemForm setItem={(item: any) => setNewItem(item)} />
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
                client={invoice.billedTo}
                setCustomer={(customer: any) =>
                  setInvoice({ ...invoice, billedTo: customer })
                }
              />
              <br />
              <BasicInfo
                setDate={(date: { invoiceDate: string; dueDate: string }) =>
                  setInvoice({ ...invoice, ...date })
                }
                sendInvoice={sendInvoice}
                date={{
                  dueDate: invoice.dueDate,
                  invoiceDate: invoice.invoiceDate,
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default InvoiceUpdatePage
