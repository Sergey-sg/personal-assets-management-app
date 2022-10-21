import React, { useCallback, useEffect, useState } from 'react'
import { ReactComponent as CreateInvoiceIcon } from 'assets/icons/create_invoice.svg'
import FilterMenu from 'pages/invoicePages/invoice_componetns/FilterMenu'
import { AppRoute } from 'common/enums/app-route.enum'
import { fetchAllInvoices } from 'redux/slice/invoiceServices/invoiceActions'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import { notifyError, notifySuccess } from 'components/common/notifications'
import { resetError } from 'redux/slice/error/error.slice'
import { resetSuccess } from 'redux/slice/success/success.slice'
import { InvoicesList } from './invoice_componetns/ListInvoices'
import { HeaderInvoicesTable } from './invoice_componetns/HeaderInvoicesTable'
import { SearchInvoices } from './invoice_componetns/SearchInvoices'
import { useLocation, useSearchParams } from 'react-router-dom'

const InvoicesListPage = () => {
  const dispatch = useAppDispatch()
  const error = useAppSelector((state) => state.error.message)
  const success = useAppSelector((state) => state.success.message)
  const [searchParams, setSearchParams] = useSearchParams()
  const pagination = useAppSelector((state) => state.pagination.pagination)
  const queryParamsFromUrl = new URLSearchParams(useLocation().search)
  const loader = useAppSelector((state) => state.loader)
  const [filters, setFilters] = useState({
    search: queryParamsFromUrl.get('search')
      ? queryParamsFromUrl.get('search')
      : '',
    firstNew: queryParamsFromUrl.get('firstNew') ? true : false,
    minDate: queryParamsFromUrl.get('minDate')
      ? queryParamsFromUrl.get('minDate')
      : '',
    maxDate: queryParamsFromUrl.get('maxDate')
      ? queryParamsFromUrl.get('maxDate')
      : '',
    minPrice: queryParamsFromUrl.get('minPrice')
      ? queryParamsFromUrl.get('minPrice')
      : '',
    maxPrice: queryParamsFromUrl.get('maxPrice')
      ? queryParamsFromUrl.get('maxPrice')
      : '',
    status: queryParamsFromUrl.get('status')
      ? queryParamsFromUrl.get('status')
      : '',
    target: queryParamsFromUrl.get('target')
      ? queryParamsFromUrl.get('target')
      : '',
  })

  useEffect(() => {
    console.log('satrt useEffect')
    dispatch(fetchAllInvoices({ ...filters, page: 1, take: pagination.take }))
    error && notifyError(error)
    success && notifySuccess(success)
    dispatch(resetError())
    dispatch(resetSuccess())
  }, [error, filters])

  const getInvoicesWithFilters = useCallback(
    (newFilters: any) => {
      const currentFilters = { ...filters, ...newFilters }
      const queryParams = Object.keys(currentFilters)
        .map((key: string) =>
          currentFilters[key as keyof typeof currentFilters]
            ? `${key}=${currentFilters[key as keyof typeof currentFilters]}`
            : '',
        )
        .filter((param) => (param ? true : false))

      setFilters(currentFilters)
      setSearchParams(`${queryParams.join('&')}`)
    },
    [filters, searchParams, pagination],
  )

  return (
    <div className="container mx-auto mb-10">
      <div className="container">
        <div className="container grid grid-cols-12 gap-4 mb-4 w-full">
          <SearchInvoices
            setSearchString={(searchString: string) =>
              getInvoicesWithFilters({ search: searchString })
            }
            searcheString={filters.search}
          />
          <div className="col-span-8">
            <div className="float-right">
              <button disabled={loader ? true : false}>
                <a
                  href={`${AppRoute.INVOICES}/${AppRoute.INVOICE_CREATE}`}
                  className="flex justify-center bg-green-light hover:bg-green-hover rounded-xl font-semibold text-base p-4 my-4"
                >
                  <CreateInvoiceIcon className="my-auto" />
                  <span className="pl-3 lg:block hidden">Create Invoice</span>
                </a>
              </button>
              <FilterMenu
                setFilters={(filters: any) => getInvoicesWithFilters(filters)}
                filters={filters}
              />
            </div>
          </div>
        </div>
        <HeaderInvoicesTable
          setFirstNew={(firstNew: boolean) =>
            getInvoicesWithFilters({ firstNew: firstNew })
          }
          firstNew={filters.firstNew}
        />
        <InvoicesList filters={filters} />
      </div>
    </div>
  )
}

export default InvoicesListPage
