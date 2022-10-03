import React, { useCallback, useState } from 'react'
import { RiSearchLine } from 'react-icons/ri'
import { MdOutlineCancel, MdArrowDropDown, MdArrowDropUp } from 'react-icons/md'
import { ReactComponent as CreateInvoiceIcon } from 'assets/icons/create_invoice.svg'
import avatarTest from '../../assets/images/invoice_client.test.png'
import DropDownActions from 'pages/invoicePages/invoice_componetns/DropDownActions'
import { InvoiceStatus } from 'pages/invoicePages/invoice_componetns/statics'
import FilterMenu from 'pages/invoicePages/invoice_componetns/FilterMenu'
import { AppRoute } from 'common/enums/app-route.enum'

const testInvoices = [
  {
    billedTo: {
      name: 'test 1',
      avatar: avatarTest,
    },
    id: 524874,
    invoiceDate: '2022-09-22',
    dueDate: '2022-10-27',
    orders: 20,
    total: 42084,
    paid: false,
  },
  {
    billedTo: {
      name: 'Gadget Gallery LTD',
      avatar: avatarTest,
    },
    id: 524567,
    invoiceDate: '2022-09-23',
    dueDate: '2022-09-27',
    orders: 5,
    total: 35467,
    paid: false,
  },
  {
    billedTo: {
      name: 'Gadget Gallery LTD',
      avatar: avatarTest,
    },
    id: 524467,
    invoiceDate: '2022-09-21',
    dueDate: '2022-09-27',
    orders: 5,
    total: 54678,
    paid: true,
  },
]

function convertDate(dateString: string) {
  const date = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    hour12: true,
  }).format(new Date(dateString))
  const dateOut = date.split(',')

  return (
    <>
      {dateOut[0]}
      <p className="text-xs text-[#929EAE] font-normal">
        at {dateOut[1].toLocaleUpperCase()}
      </p>
    </>
  )
}

function InvoicesPage() {
  const [invoices, setInvoices] = useState(testInvoices)
  const [outInvoices, setOutInvoices] = useState(invoices)
  const [searchString, setSearchString] = useState('')
  const [firstNew, setFirstNew] = useState(true)

  function searchInvoices(search: boolean) {
    search
      ? setOutInvoices(
          invoices.filter(
            (invoice) =>
              invoice.billedTo.name
                .toLowerCase()
                .includes(searchString.toLowerCase()) ||
              invoice.id.toString().includes(searchString),
          ),
        )
      : setOutInvoices(invoices)
  }

  function removeInvoice(invoiceId: number) {
    setInvoices(invoices.filter((invoice) => invoice.id !== invoiceId))
    setOutInvoices(invoices.filter((invoice) => invoice.id !== invoiceId))
  }

  function sortByDate() {
    setOutInvoices(
      outInvoices.sort((a, b) => {
        if (new Date(a.invoiceDate) > new Date(b.invoiceDate)) {
          return firstNew ? -1 : 1
        }
        if (new Date(a.invoiceDate) < new Date(b.invoiceDate)) {
          return firstNew ? 1 : -1
        }

        return 0
      }),
    )
  }

  function filterByDatePriceStatus(filters: {
    minDate: string
    maxDate: string
    minPrice: string
    maxPrice: string
    status: string
  }) {
    let invoiceList = outInvoices.slice()

    if (filters.status) {
      invoiceList = invoiceList.filter((invoice) => {
        const nowDate = new Date()
        const dueDate = new Date(invoice.dueDate)
        const statusInvoice = invoice.paid
          ? 'Paid'
          : nowDate < dueDate
          ? 'Pending'
          : 'Unpaid'

        return filters.status === statusInvoice
      })
    }

    if (filters.minDate || filters.maxDate) {
      const minDate = filters.minDate
        ? new Date(filters.minDate)
        : new Date('1990-10-29')
      const maxDate = filters.maxDate ? new Date(filters.maxDate) : new Date()

      invoiceList = invoiceList.filter((invoice) => {
        const invoiceDate = new Date(invoice.invoiceDate)

        return invoiceDate >= minDate && invoiceDate <= maxDate
      })
    }

    if (filters.minPrice || filters.maxPrice) {
      if (filters.minPrice) {
        invoiceList = invoiceList.filter(
          (invoice) => invoice.total / 100 >= parseFloat(filters.minPrice),
        )
      }
      if (filters.maxPrice) {
        invoiceList = invoiceList.filter(
          (invoice) => invoice.total / 100 <= parseFloat(filters.maxPrice),
        )
      }
    }

    setOutInvoices(invoiceList)
  }

  const HeaderInvoiceTable: React.FC = () => {
    return (
      <div className="container grid grid-cols-12 gap-4 text-left text-xs mb-5 text-[#929EAE]">
        <div className="col-span-3">NAME/CLIENT</div>
        <button
          className="col-span-2"
          onClick={() => {
            setFirstNew(!firstNew)
            sortByDate()
          }}
        >
          <span className="float-left">DATE</span>
          {firstNew ? (
            <MdArrowDropUp size={16} />
          ) : (
            <MdArrowDropDown size={16} />
          )}
        </button>
        <div className="col-span-2">ORDERS/TYPE</div>
        <div className="col-span-2">TOTAL</div>
        <div className="col-span-2">STATUS</div>
        <div className="col-span-1">ACTION</div>
      </div>
    )
  }

  const InvoicesList = (props: {
    invoices: {
      id: number
      billedTo: { name: string; avatar: string }
      invoiceDate: string
      orders: number
      total: number
      paid: boolean
      dueDate: string
    }[]
  }) => {
    return (
      <>
        {props.invoices?.map((invoice) => (
          <div
            key={invoice.id}
            className="container grid grid-cols-12 gap-4 text-left text-sm mb-4 font-medium text-[#1B212D]"
          >
            <div className="col-span-3 mt-2">
              <img
                className="float-left pr-4"
                src={invoice.billedTo.avatar}
                alt="client"
              />
              {invoice.billedTo.name}
              <p className="text-xs text-[#929EAE] font-normal">
                Inv: MGL{invoice.id}
              </p>
            </div>
            <div className="col-span-2 mt-2">
              {convertDate(invoice.invoiceDate)}
            </div>
            <div className="col-span-2 text-[#929EAE] mt-2">
              {invoice.orders}
            </div>
            <div className="col-span-2 font-bold mt-2">
              ${invoice.total / 100}
            </div>
            <InvoiceStatus paid={invoice.paid} dueDate={invoice.dueDate} />
            <DropDownActions
              removeInvoice={useCallback(() => removeInvoice(invoice.id), [])}
            />
          </div>
        ))}
      </>
    )
  }

  return (
    <div className="container mx-auto mb-10">
      <div className="container">
        <div className="container grid grid-cols-12 gap-4 mb-4 w-full">
          <div className="col-span-4">
            <label className="relative block flex my-4 w-min font-light">
              <button onClick={() => searchInvoices(true)}>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 hover:text-[#27AE60]">
                  <RiSearchLine />
                </span>
              </button>
              <input
                onChange={(e) => setSearchString(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') searchInvoices(true)
                }}
                className="block bg-[#F5F5F5] w-56 border border-none rounded-2xl py-4 px-9 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                placeholder="Search invoices"
                type="text"
                name="searchInvoice"
              />
              <button onClick={() => searchInvoices(false)}>
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 hover:text-[#EB5757]">
                  <MdOutlineCancel />
                </span>
              </button>
            </label>
          </div>
          <div className="col-span-8">
            <div className="float-right">
              <button className="bg-green-light hover:bg-green-hover rounded-xl font-semibold text-base p-4 my-4">
                <a
                  href={AppRoute.INVOICE_CREATE}
                  className="flex justify-center"
                >
                  <CreateInvoiceIcon className="my-auto" />
                  <span className="pl-3 lg:block hidden">Create Invoice</span>
                </a>
              </button>
              <FilterMenu
                filterByDatePriceStatus={useCallback(
                  (filters) => filterByDatePriceStatus(filters),
                  [],
                )}
              />
            </div>
          </div>
        </div>
        <HeaderInvoiceTable />
        <InvoicesList invoices={outInvoices} />
      </div>
    </div>
  )
}

export default InvoicesPage
