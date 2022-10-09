import React, { useEffect } from 'react'
import { ReactComponent as CreateInvoiceIcon } from 'assets/icons/create_invoice.svg'
import FilterMenu from 'pages/invoicePages/invoice_componetns/FilterMenu'
import { AppRoute } from 'common/enums/app-route.enum'
import { fetchAllInvoices } from 'redux/slice/invoiceServices/invoiceActions'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import { notifyError, notifySuccess } from 'components/common/notifications'
import { resetError } from 'redux/slice/error/error.slice'
import { resetSuccess } from 'redux/slice/success/success.slice'
import { InvoicesList } from './invoice_componetns/ListInvices'
import { HeaderInvoicesTable } from './invoice_componetns/HeaderInvoicesTable'
import { SearchInvoices } from './invoice_componetns/SearchInvoices'

function InvoicesListPage() {
  const dispatch = useAppDispatch()
  const error = useAppSelector((state) => state.error.message)
  const success = useAppSelector((state) => state.success.message)

  useEffect(() => {
    dispatch(fetchAllInvoices())
    error && notifyError(error)
    success && notifySuccess(success)
    dispatch(resetError())
    dispatch(resetSuccess())
  }, [error, success])

  return (
    <div className="container mx-auto mb-10">
      <div className="container">
        <div className="container grid grid-cols-12 gap-4 mb-4 w-full">
          <SearchInvoices />
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
              <FilterMenu />
            </div>
          </div>
        </div>
        <HeaderInvoicesTable />
        <InvoicesList />
      </div>
    </div>
  )
}

export default InvoicesListPage
