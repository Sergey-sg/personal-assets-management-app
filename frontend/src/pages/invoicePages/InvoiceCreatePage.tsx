import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import React, { useCallback, useState } from 'react'
import ReactTextareaAutosize from 'react-textarea-autosize'
import { getUserByParams } from 'redux/slice/invoiceServices/invoiceActions'
import { number } from 'yup/lib/locale'
import customer from '../../assets/images/customer_invoice.test.png'
import { currentImagesPath } from './invoice_componetns/ListInvices'
import {
  FooterItems,
  HeaderItems,
  InvoiceInfoBaner,
  InvoiceItemsList,
  MagloBaner,
} from './invoice_componetns/statics'

const sum = (obj: any) => {
  return Object.keys(obj).reduce(
    (sum, key) => sum + (parseFloat(obj[key] || 0) * 100) / 100,
    0,
  )
}

function ClientDetails(props: any) {
  const [billedTo, setBilledTo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phone: '',
    avatarPath: '',
  })
  const userFullName = billedTo.firstName
    ? `${billedTo.firstName} ${billedTo.lastName}`
    : billedTo.email

  async function getUser(params: any) {
    const user = await getUserByParams({ email: 'glushaksergey90@gmail.com' })

    setBilledTo(user)
    props.setCustomer(user)
  }

  return (
    <div className="container h-max bg-text-white border border-gray-medium rounded-xl">
      <div className="container text-base font-semibold p-5">
        Client Details
      </div>
      <img
        className="float-left px-5"
        src={currentImagesPath(billedTo.avatarPath)}
        alt={userFullName}
      />
      <div className="columns-1">
        <div className="text-base font-semibold text-lg">{userFullName}</div>
        <div className="text-base font-normal text-text-ultralight">
          {billedTo.email}
        </div>
      </div>
      <br />
      <hr className="border-gray-border w-11/12 mx-auto" />
      <div className="container columns-1 p-5">
        <div className="text-base font-semibold text-lg">UIHUT Agency LTD</div>
        <div className="text-base font-normal text-text-ultralight">
          {billedTo.address}
        </div>
        <br />
        <button
          className="bg-green-minimal text-green-medium font-medium rounded-xl w-full py-3.5 font-semibold hover:bg-green-ultralight"
          onClick={() => getUser('')}
        >
          Add Customer
        </button>
      </div>
    </div>
  )
}

function BasicInfo(props: any) {
  return (
    <div className="container h-max bg-text-white border border-gray-medium rounded-xl">
      <div className="container text-base font-semibold p-5">Basic Info</div>
      <div className="columns-1 px-5">
        <div className="font-medium pb-4">
          <span className="text-text-light">Invoice Date</span>
          <input
            name="invoice-date"
            className="w-full border border-gray-medium rounded-xl p-3.5"
            type={'date'}
            onChange={(e) => {
              props.setInvoiceDate(e.target.value)
            }}
          />
        </div>
        <div className="font-medium pb-4">
          <span className="text-text-light">Due Date</span>
          <input
            name="due-date"
            className="w-full border border-gray-medium rounded-xl p-3.5"
            type={'date'}
            onChange={(e) => {
              props.setDueDate(e.target.value)
            }}
          />
        </div>
        <button className="bg-green-light rounded-xl w-full font-semibold text-base py-4 my-4 hover:bg-green-hover">
          Send Invoice
        </button>
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-gray-ultralight hover:bg-gray-border rounded-xl w-full font-semibold text-base text-green-medium col-span-1">
            Preview
          </button>
          <button className="bg-gray-ultralight hover:bg-gray-border rounded-xl w-full font-semibold text-base text-green-medium py-4 col-span-1">
            Download
          </button>
        </div>
      </div>
      <br />
    </div>
  )
}

function InputItem(props: {
  setItem: (arg0: {
    subTotal: number
    id: number
    name: string
    number: string
    price: string
  }) => void
}) {
  const [item, setItem] = useState({
    id: Date.now(),
    name: '',
    number: '',
    price: '',
  })

  function submitValue() {
    const subTotal =
      ((parseFloat(item.price) * 100 * parseFloat(item.number) * 100) / 10000) |
      0

    if (item.name && item.price && item.number) {
      props.setItem({ ...item, subTotal })
      setItem({ id: Date.now(), name: '', number: '', price: '' })
    }
  }

  return (
    <div className="container grid grid-cols-12 gap-4">
      <input
        className="col-span-5 border border-gray-medium rounded-xl p-4 focus:outline-none focus:border-green-hover focus:ring-green-hover focus:ring-0"
        type={'text'}
        name="name"
        onChange={(e) => setItem({ ...item, name: e.target.value })}
        value={item.name}
      />
      <input
        className="col-span-3 border border-gray-medium rounded-xl p-4 focus:outline-none focus:border-green-hover focus:ring-green-hover focus:ring-0"
        type={'number'}
        name="number"
        onChange={(e) => setItem({ ...item, number: e.target.value })}
        value={item.number}
      />
      <input
        className="col-span-2 border border-gray-medium rounded-xl p-4 focus:outline-none focus:border-green-hover focus:ring-green-hover focus:ring-0"
        type={'number'}
        name="price"
        onChange={(e) => setItem({ ...item, price: e.target.value })}
        value={item.price}
      />
      <button
        className="col-span-2 text-green-medium border border-gray-medium rounded-xl py-4 hover:bg-gray-ultralight"
        onClick={() => submitValue()}
      >
        Add Item
      </button>
    </div>
  )
}

const InvoiceCreatePage: React.FC = () => {
  const dispatch = useAppDispatch()
  const error = useAppSelector((state) => state.error.message)
  const success = useAppSelector((state) => state.success.message)
  const [invoice, setInvoice] = useState({
    detail: '',
    total: 0,
    dueDate: '',
    invoiceDate: '',
    discount: 0,
  })
  const [billedTo, setBilledTo] = useState({})
  const [invoiceItems, setInvoiceItems] = useState([{}])
  const [subTotal, setSubTotal] = useState(0)
  const issuedDate = new Date()

  function setTotalAndSubTotal() {
    const sumSubTotal = sum(invoiceItems.map((item: any) => item.subTotal))
    const total = (sumSubTotal / invoice.discount) * 100 || 0

    setSubTotal(sumSubTotal)
    setInvoice({ ...invoice, total })
  }

  function setNewItem(item: any) {
    console.log(Object.keys(invoiceItems[0]), invoiceItems)
    if (Object.keys(invoiceItems[0]).length > 0) {
      setInvoiceItems([...invoiceItems, item])
    } else {
      setInvoiceItems([item])
    }
    setTotalAndSubTotal()
  }

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
            <div className="text-base font-bold mb-3.5">Item Details</div>
            <ReactTextareaAutosize
              className="w-full border-none rounded-xl focus:outline-none focus:border-green-hover focus:ring-green-hover focus:ring-1"
              name="detail"
              placeholder="Details item with more info"
              onChange={(e) =>
                setInvoice({ ...invoice, detail: e.target.value })
              }
              value={invoice.detail}
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
            <InputItem
              setItem={useCallback((item: any) => {
                setNewItem(item)
              }, [])}
            />
            <br />
            <FooterItems subTotal={subTotal} total={invoice.total} />
          </div>
        </div>
        <div className="container lg:col-span-3 col-span-1">
          <ClientDetails
            setCustomer={useCallback(
              (customer: any) => setBilledTo(customer),
              [],
            )}
          />
          <br />
          <BasicInfo
            setDueDate={useCallback(
              (dueDate: string) => setInvoice({ ...invoice, dueDate }),
              [],
            )}
            setInvoiceDate={useCallback(
              (invoiceDate: string) => setInvoice({ ...invoice, invoiceDate }),
              [],
            )}
          />
        </div>
      </div>
    </div>
  )
}

export default InvoiceCreatePage
