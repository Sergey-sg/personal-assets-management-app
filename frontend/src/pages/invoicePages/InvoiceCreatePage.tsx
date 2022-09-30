import React, { useState } from 'react'
import ReactTextareaAutosize from 'react-textarea-autosize'
import customer from '../../assets/images/test_customer_invoice.png'
import { FooterItems, HeaderItems, InvoiceInfoBaner, MagloBaner } from './invoice_componetns/statics'

function InvoiceItemForm() {
  const [invoiceDetail, setInvoiceDetail] = useState('');
  const [invoiceItems, setInvoiceItem] = useState([{}]);
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);

  const InvoiceItems: React.FC = () => {
    const InputItem: React.FC = () => {
      const [name, setName] = useState('');
      const [number, setNumber] = useState('');
      const [price, setPrice] = useState('');

      function submitValue(e: any) {
        e.preventDefault()
        const sum = (obj: any) => {
          return Object.keys(obj).reduce(
            (sum, key) => sum + parseFloat(obj[key] || 0),
            0,
          )
        }
        const item = {
          id: Date.now(),
          name: name,
          number: number,
          price: price,
          total: parseFloat(price) * parseFloat(number) || 0,
        }

        if (item.name && item.price && item.number) {
          if (Object.keys(invoiceItems[0]).length !== 0) {
            setInvoiceItem([...invoiceItems, item])
          } else {
            setInvoiceItem([item])
          }
          const sub = sum([
            ...invoiceItems.map((itemOld: any) => itemOld.total),
            item.total,
          ])

          setSubTotal(sub)
          setTotal(sub)
        }
      }

      return (
        <div className="container grid grid-cols-12 gap-4">
          <input
            className="col-span-5 border border-[#F5F5F5] rounded-xl p-4"
            type={'text'}
            name="name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="col-span-3 border border-[#F5F5F5] rounded-xl p-4"
            type={'number'}
            name="number"
            onChange={(e) => setNumber(e.target.value)}
          />
          <input
            className="col-span-2 border border-[#F5F5F5] rounded-xl p-4"
            type={'number'}
            name="price"
            onChange={(e) => setPrice(e.target.value)}
          />
          <button
            className="col-span-2 text-[#29A073] border border-[#F5F5F5] rounded-xl py-4"
            onClick={submitValue}
          >
            Add Item
          </button>
        </div>
      )
    }

    if (Object.keys(invoiceItems[0]).length !== 0) {
      return (
        <div className="font-medium">
          {invoiceItems.map((item: any) => (
            <div key={item.id}>
              <div className="container grid grid-cols-12 gap-4">
                <div className="border border-[#F5F5F5] rounded-xl p-4 col-span-5">
                  {item.name}
                </div>
                <div className="text-center border border-[#F5F5F5] rounded-xl py-4 col-span-3">
                  {item.number}
                </div>
                <div className="text-center border border-[#F5F5F5] rounded-xl py-4 col-span-2">
                  ${item.price}
                </div>
                <div className="text-right border border-[#F5F5F5] rounded-xl p-4 col-span-2">
                  ${item.total}
                </div>
              </div>
              <br />
            </div>
          ))}
          <InputItem />
        </div>
      )
    } else {
      return <InputItem />
    }
  }

  return (
    <div>
      <div className="text-base font-bold mb-3.5">Item Details</div>
      <ReactTextareaAutosize
        className="w-full border-none rounded-xl"
        name="detail"
        placeholder="Details item with more info"
        onChange={(e) => setInvoiceDetail(e.target.value)}
      />
      <br />
      <br />
      <div className="w-full">
        <HeaderItems />
        <br />
        <InvoiceItems />
      </div>
      <br />
      <FooterItems subTotal={subTotal} total={total} />
    </div>
  )
}

const ClientDetails: React.FC = () => {
  return (
    <div className="container h-max bg-[#FFFFFF] border border-[#F5F5F5] rounded-xl">
      <div className="container text-base font-semibold p-5">
        Client Details
      </div>
      <img className="float-left px-5" src={customer} alt="customer" />
      <div className="columns-1">
        <div className="text-base font-semibold text-lg">Sajib Rahman</div>
        <div className="text-base font-normal text-[#929EAE]">
          rahmansajib@uihut.com
        </div>
      </div>
      <br />
      <hr className="border-[#E5E5E5] w-11/12 mx-auto" />
      <div className="container columns-1 p-5">
        <div className="text-base font-semibold text-lg">UIHUT Agency LTD</div>
        <div className="text-base font-normal text-[#929EAE]">
          3471 Rainy Day Drive Tulsa, USA
        </div>
        <br />
        <button className="bg-[#EEFEF2] text-[#29A073] font-medium rounded-xl w-full py-3.5 font-semibold">
          Add Customer
        </button>
      </div>
    </div>
  )
}

const BasicInfo: React.FC = () => {
  const [dueDate, setDueDate] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const issuedDate = Date.now();

  return (
    <div className="container h-max bg-[#FFFFFF] border border-[#F5F5F5] rounded-xl">
      <div className="container text-base font-semibold p-5">Basic Info</div>
      <div className="columns-1 px-5">
        <div className="font-medium pb-4">
          <span className="text-[#78778B]">Invoice Date</span>
          <input
            name="invoice-date"
            className="w-full border border-[#F5F5F5] rounded-xl p-3.5"
            type={'date'}
            onChange={(e) => {
              setInvoiceDate(e.target.value)
            }}
          />
        </div>
        <div className="font-medium pb-4">
          <span className="text-[#78778B]">Due Date</span>
          <input
            name="due-date"
            className="w-full border border-[#F5F5F5] rounded-xl p-3.5"
            type={'date'}
            onChange={(e) => {
              setDueDate(e.target.value)
            }}
          />
        </div>
        <button className="bg-[#C8EE44] rounded-xl w-full font-semibold text-base py-4 my-4">
          Send Invoice
        </button>
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-[#F8F8F8] rounded-xl w-full font-semibold text-base text-[#29A073] col-span-1">
            Preview
          </button>
          <button className="bg-[#F8F8F8] rounded-xl w-full font-semibold text-base text-[#29A073] py-4 col-span-1">
            Download
          </button>
        </div>
      </div>
      <br />
    </div>
  )
}

const InvoiceRightPanel: React.FC = () => {
  return (
    <div>
      <ClientDetails />
      <br />
      <BasicInfo />
    </div>
  )
}

const InvoiceCreatePage: React.FC = () => {
  return (
    <div className="container mx-auto mb-10">
      <h1 className="container text-3xl font-bold rounded-md px-10 pt-4">
        New Invoices: MGL524874
      </h1>
      <div className="container py-4 grid grid-cols-1 lg:grid-cols-10 gap-4">
        <div className="container col-span-1 lg:col-span-7 md:col-span-7 px-10">
          <MagloBaner />
          <br />
          <InvoiceInfoBaner />
          <br />
          <InvoiceItemForm />
        </div>
        <div className="container lg:col-span-3 col-span-1">
          <InvoiceRightPanel />
        </div>
      </div>
    </div>
  )
}

export default InvoiceCreatePage
