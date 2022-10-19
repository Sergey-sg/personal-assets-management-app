import { AppRoute } from 'common/enums/app-route.enum'
import { notifyError, notifySuccess } from 'components/common/notifications'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
import { sum } from './secondaryFunctions/secondaryFunctions'

const InvoiceDetailPage = () => {
  const dispatch = useAppDispatch()
  const { invoiceId } = useParams()
  const error = useAppSelector((state) => state.error.message)
  const success = useAppSelector((state) => state.success.message)
  const invoice = useAppSelector((state) => state.invoices.invoices[0])
  const subTotal = invoice
    ? sum(invoice.items?.map((item: any) => item.subTotal))
    : 0
  const navigate = useNavigate()

  useEffect(() => {
    console.log('satrt useEffect')
    dispatch(fetchGetInvoiceById(`${invoiceId}`, false))
    if (error === 'Invoice does not found for user') {
      navigate(`/${AppRoute.PORTAL}/${AppRoute.INVOICES}`)
    }
    error && notifyError(error)
    success && notifySuccess(success)
    dispatch(resetError())
    dispatch(resetSuccess())
  }, [error])

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
              billedTo={invoice.billedTo}
            />
            <br />
            <div>
              <div className="text-base font-bold mb-3.5">Item Details</div>
              <div className="w-full">{invoice.invoiceDetails}</div>
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
                invoice={invoice}
                subTotal={subTotal}
                total={invoice.total}
              />
            </div>
          </div>
          <div className="container lg:col-span-3 col-span-1">
            <ClientDetails billedTo={invoice.billedTo} />
            <br />
            <BasicInfo
              invoice={invoice}
              date={{
                dueDate: invoice.dueDate,
                invoiceDate: invoice.invoiceDate,
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default InvoiceDetailPage
