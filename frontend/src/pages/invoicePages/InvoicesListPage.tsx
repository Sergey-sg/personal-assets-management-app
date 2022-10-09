import React, { useCallback, useEffect, useState } from 'react'
import { RiSearchLine } from 'react-icons/ri'
import { MdOutlineCancel, MdArrowDropDown, MdArrowDropUp } from 'react-icons/md'
import { ReactComponent as CreateInvoiceIcon } from 'assets/icons/create_invoice.svg'
import DropDownActions from 'pages/invoicePages/invoice_componetns/DropDownActions'
import { InvoiceStatus } from 'pages/invoicePages/invoice_componetns/statics'
import FilterMenu from 'pages/invoicePages/invoice_componetns/FilterMenu'
import { AppRoute } from 'common/enums/app-route.enum'
import {
  fetchAllInvoices,
  fetchRemoveInvoice,
} from 'redux/slice/invoiceServices/invoiceActions'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import { notifyError, notifySuccess } from 'components/common/notifications'
import { resetError } from 'redux/slice/error/error.slice'
import { resetSuccess } from 'redux/slice/success/success.slice'
import { CONSTANTS } from 'shared/constants'
import {
  filterBy,
  removeInvoiceSuccess,
  searchInvoicesByUserNameAndId,
  sortByDateInStore,
} from 'redux/slice/invoiceServices/invoice.slice'

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
      <p className="text-xs text-text-ultralight font-normal">
        at {dateOut[1].toLocaleUpperCase()}
      </p>
    </>
  )
}

function currentImagesPath(path: string) {
  const currentPath = path.includes('MyFinance')
    ? `${CONSTANTS.CLOUDINARY_FILE_STORAGE}${path}`
    : path

  return currentPath
}

function InvoicesListPage() {
  const dispatch = useAppDispatch()
  const invoices = useAppSelector((state) => state.invoices.outInvoices)
  const error = useAppSelector((state) => state.error.message)
  const success = useAppSelector((state) => state.success.message)
  const [searchString, setSearchString] = useState('')
  const [firstNew, setFirstNew] = useState(false)

  useEffect(() => {
    dispatch(fetchAllInvoices())
    error && notifyError(error)
    success && notifySuccess(success)
    dispatch(resetError())
    dispatch(resetSuccess())
  }, [error, success])

  function searchInvoices() {
    dispatch(searchInvoicesByUserNameAndId(searchString))
  }

  function removeInvoice(invoiceId: number) {
    dispatch(fetchRemoveInvoice(invoiceId))
  }

  function sortByDate() {
    dispatch(sortByDateInStore(firstNew))
  }

  function filterByDatePriceStatus(filters: {
    minDate: string
    maxDate: string
    minPrice: string
    maxPrice: string
    status: string
  }) {
    dispatch(filterBy(filters))
  }

  const HeaderInvoiceTable: React.FC = () => {
    return (
      <div className="container grid grid-cols-12 gap-4 text-left text-xs mb-5 text-text-ultralight">
        <div className="col-span-3">NAME/CLIENT</div>
        <button
          className="col-span-2"
          onClick={useCallback(() => {
            setFirstNew(!firstNew)
            sortByDate()
          }, [])}
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

  const InvoicesList = (props: any) => {
    return (
      <>
        {props.invoices.length !== 0 ? (
          props.invoices.map((invoice: any) => (
            <div
              key={invoice.id}
              className="container grid grid-cols-12 gap-4 text-left text-sm mb-4 font-medium text-text"
            >
              <div className="col-span-3 mt-2">
                <img
                  className="float-left pr-4"
                  src={currentImagesPath(invoice.billedTo.avatarPath)}
                  alt={invoice.billedTo.email}
                />
                {`${invoice.billedTo.firstName} ${invoice.billedTo.lastName}`}
                <p className="text-xs text-text-ultralight font-normal">
                  Inv: MGL{invoice.id}
                </p>
              </div>
              <div className="col-span-2 mt-2">
                {convertDate(invoice.invoiceDate)}
              </div>
              <div className="col-span-2 text-text-ultralight mt-2">
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
          ))
        ) : (
          <div>There are no invoices here yet</div>
        )}
      </>
    )
  }

  return (
    <div className="container mx-auto mb-10">
      <div className="container">
        <div className="container grid grid-cols-12 gap-4 mb-4 w-full">
          <div className="col-span-4">
            <label className="relative block flex my-4 w-min font-light">
              <button onClick={() => searchInvoices()}>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 hover:text-green">
                  <RiSearchLine />
                </span>
              </button>
              <input
                onChange={(e) => setSearchString(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') searchInvoices()
                }}
                className="block bg-gray-medium w-56 border border-none rounded-2xl py-4 px-9 shadow-sm focus:outline-none focus:border-green-hover focus:ring-green-hover focus:ring-1 sm:text-sm"
                placeholder="Search invoices"
                type="text"
                name="searchInvoice"
                value={searchString}
              />
              <button
                onClick={useCallback(() => {
                  setSearchString('')
                  searchInvoices()
                }, [])}
              >
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 hover:text-error">
                  <MdOutlineCancel />
                </span>
              </button>
            </label>
          </div>
          <div className="col-span-8">
            <div className="float-right">
              <button>
                <a
                  href={`${AppRoute.INVOICES}/${AppRoute.INVOICE_CREATE}`}
                  className="flex justify-center bg-green-light hover:bg-green-hover rounded-xl font-semibold text-base p-4 my-4"
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
        <InvoicesList invoices={invoices} />
      </div>
    </div>
  )
}

export default InvoicesListPage
