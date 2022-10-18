import { notifyError, notifySuccess } from 'components/common/notifications'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { resetError } from 'redux/slice/error/error.slice'
import { fetchGetInvoiceById } from 'redux/slice/invoiceServices/invoiceActions'
import { resetSuccess } from 'redux/slice/success/success.slice'
import { BasicInfo } from './invoice_componetns/BasicInfo'
import { ClientDetails } from './invoice_componetns/ClientDetails'
import { FooterItems } from './invoice_componetns/FooterItems'
import {
  HeaderItems,
  InvoiceInfoBaner,
  InvoiceItemsList,
  MagloBaner,
} from './invoice_componetns/statics'

const InvoiceDetailPage = () => {
  const dispatch = useAppDispatch()
  const { invoiceId } = useParams()
  const error = useAppSelector((state) => state.error.message)
  const success = useAppSelector((state) => state.success.message)
  const invoice = useAppSelector((state) => state.invoices.invoices[0])

  useEffect(() => {
    dispatch(fetchGetInvoiceById(`${invoiceId}`))
    error && notifyError(error)
    success && notifySuccess(success)
    dispatch(resetError())
    dispatch(resetSuccess())
  }, [success, error, invoiceId])

  return (
    <div className="container mx-auto mb-10">
      {invoice && (
        <div className="container py-4 grid grid-cols-1 lg:grid-cols-10 gap-4">
          <div className="container col-span-1 lg:col-span-7 md:col-span-7 px-10">
            <MagloBaner />
            <br />
            <InvoiceInfoBaner
              invoice={invoice}
              issuedDate={invoice.createdAt}
            />
            <br />
            <div>
              <div className="text-base font-bold mb-3.5">Item Details</div>
              <div className="w-full border-none rounded-xl focus:outline-none focus:border-green-hover focus:ring-green-hover focus:ring-1">
                {invoice.invoiceDetails}
              </div>
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
              <FooterItems
                //   subTotal={subTotal}
                subTotal={invoice.total}
                total={invoice.total}
                setDiscount={(discount: number) => console.log(discount)}
              />
            </div>
          </div>
          <div className="container lg:col-span-3 col-span-1">
            <ClientDetails
              setCustomer={(customer: any) => console.log(customer)}
            />
            <br />
            <BasicInfo
              setDueDate={(dueDate: string) => console.log(dueDate)}
              setInvoiceDate={(invoiceDate: string) => console.log(invoiceDate)}
              sendInvoice={() => console.log('send')}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default InvoiceDetailPage
