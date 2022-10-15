import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactTextareaAutosize from 'react-textarea-autosize'
import { fetchAllInvoices } from 'redux/slice/invoiceServices/invoiceActions'
import { sum } from './InvoiceCreatePage'
import { FooterItems } from './invoice_componetns/FooterItems'
import { InputItem } from './invoice_componetns/InputItem'
import {
  HeaderItems,
  InvoiceInfoBaner,
  InvoiceItemsList,
  MagloBaner,
} from './invoice_componetns/statics'

const InvoiceUpdatePage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { invoiceId } = useParams()

  console.log(useAppSelector((state) => state.invoices.invoices))
  const currentInvoice = useAppSelector((state) =>
    state.invoices.invoices.filter((invoice) => {
      console.log(invoiceId, invoice.id)

      return invoice.id == 3
    }),
  )

  const [invoice, setInvoice] = useState(currentInvoice[0])
  const [subTotal, setSubTotal] = useState(
    sum(invoice.items.map((item: any) => item.subTotal)),
  )

  return (
    <div className="container mx-auto mb-10">
      <div className="container py-4 grid grid-cols-1 lg:grid-cols-10 gap-4">
        <div className="container col-span-1 lg:col-span-7 md:col-span-7 px-10">
          <MagloBaner />
          <br />
          <InvoiceInfoBaner
            invoice={invoice}
            billedTo={invoice.billedTo}
            issuedDate={invoice.invoiceDate}
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
            <InputItem
              setItem={useCallback(
                (item) => {
                  setInvoice({ ...invoice, items: [...invoice.items, item] })
                },
                [invoice],
              )}
            />
            <br />
            <FooterItems
              subTotal={subTotal}
              total={invoice.total}
              setDiscount={useCallback(
                (discount: number) => {
                  setInvoice({ ...invoice, discount: discount })
                },
                [invoice],
              )}
            />
          </div>
        </div>
        {/* <div className="container lg:col-span-3 col-span-1">
                    <ClientDetails
                        setCustomer={useCallback(
                        (customer: any) => setBilledTo(customer),
                        [billedTo],
                        )}
                    />
                    <br />
                    <BasicInfo
                        setDueDate={useCallback(
                        (dueDate: string) => setInvoice({ ...invoice, dueDate: dueDate }),
                        [invoice],
                        )}
                        setInvoiceDate={useCallback(
                        (invoiceDate: string) =>
                            setInvoice({ ...invoice, invoiceDate: invoiceDate }),
                        [invoice],
                        )}
                        sendInvoice={sendInvoice}
                    />
                </div>  */}
      </div>
    </div>
  )
}

export default InvoiceUpdatePage
