import { AppRoute } from 'common/enums/app-route.enum'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactTextareaAutosize from 'react-textarea-autosize'
import { errorOccurred } from 'redux/slice/error/error.slice'
import { IInvoice } from 'redux/slice/invoiceServices/invoice.slice'
import { fetchCreateInvoice } from 'redux/slice/invoiceServices/invoiceActions'
import { IUserProfile } from 'redux/slice/userProfile/userProfile.slice'
import { IInvoiceItem } from './interfaces/invoiceItem.interface'
import { BasicInfo } from './invoice_componetns/BasicInfo'
import { ClientDetails } from './invoice_componetns/ClientDetails'
import { FooterItems } from './invoice_componetns/FooterItems'
import { InputItemForm } from './invoice_componetns/InputItemForm'
import { InvoiceItemsList } from './invoice_componetns/InvoiceItemsList'
import {
  HeaderItems,
  InvoiceInfoBaner,
  MagloBaner,
} from './invoice_componetns/statics'
import { invoiceNotValid, sum } from './secondaryFunctions/secondaryFunctions'

const InvoiceCreatePage: React.FC = () => {
  const dispatch = useAppDispatch()
  const success = useAppSelector((state) => state.success.message)
  const createdInvoice = useAppSelector((state) => state.invoices.invoices[0])
  const navigate = useNavigate()
  // const [invoice, setInvoice] = useState({
  //   invoiceDetails: '',
  //   total: 0,
  //   dueDate: '',
  //   invoiceDate: '',
  //   discount: 0,
  // })
  const [invoice, setInvoice] = useState<IInvoice>({
    items: [],
    discount: 0,
    dueDate: '',
    invoiceDate: '',
    invoiceDetails: '',
    total: 0,
    billedTo: undefined
  })
  // const [billedTo, setBilledTo] = useState<IUserProfile>()
  // const [invoiceItems, setInvoiceItems] = useState([{}])
  const [subTotal, setSubTotal] = useState(0)
  const issuedDate = new Date()

  useEffect(() => {
    if (success === 'Invoice created successfully' && createdInvoice) {
      navigate(
        `/${AppRoute.PORTAL}/${AppRoute.INVOICES}/${AppRoute.INVOICE_DETAILS}/${createdInvoice.id}`,
      )
    }
  }, [success, createdInvoice])

  const setNewItem = useCallback(
    (
      newItem: IInvoiceItem,
      remove = false,
    ) => {
      const newItems = remove
        ? invoice.items.filter((item) => newItem.id !== item.id)
        : [...invoice.items, newItem]
      const sumSubTotal = sum(newItems.map((item) => item.subTotal)) || 0
      const total =
        Math.round((sumSubTotal * (100 - invoice.discount)) / 100) || 0

      setSubTotal(sumSubTotal)
      setInvoice({ ...invoice, items: newItems, total: total })
    },
    [subTotal, invoice],
  )

  const sendInvoice = useCallback(() => {
    const items = invoice.items.map(({ id, ...item }: any) => item)
    const newInvoice: IInvoice = { ...invoice, items }
    const messageValidation = invoiceNotValid(newInvoice)

    if (!messageValidation) {
      dispatch(fetchCreateInvoice(newInvoice))
    } else {
      dispatch(errorOccurred({ statusCode: 400, message: messageValidation }))
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
        <div className="container col-span-1 lg:col-span-7 md:col-span-7 px-10">
          <MagloBaner />
          <br />
          <InvoiceInfoBaner
            invoice={invoice}
            billedTo={invoice.billedTo}
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
              {invoice.items.length > 0 && (
                <InvoiceItemsList
                  items={invoice.items}
                  removeItem={setNewItem}
                />
              )}
            </div>
            <br />
            <InputItemForm setItem={setNewItem} />
            <br />
            <FooterItems
              invoice={invoice}
              subTotal={subTotal}
              total={invoice.total}
              setDiscount={setDiscount}
            />
          </div>
        </div>
        <div className="container lg:col-span-3 col-span-1">
          <ClientDetails 
            setCustomer={(customer: IUserProfile) =>
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
      </div>
    </div>
  )
}

export default InvoiceCreatePage
