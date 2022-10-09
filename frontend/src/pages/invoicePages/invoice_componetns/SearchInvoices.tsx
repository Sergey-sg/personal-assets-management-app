import { useAppDispatch } from 'hooks/useAppDispatch'
import React, { useCallback, useState } from 'react'
import { MdOutlineCancel } from 'react-icons/md'
import { searchInvoicesByUserNameAndId } from 'redux/slice/invoiceServices/invoice.slice'
import { RiSearchLine } from 'react-icons/ri'

export const SearchInvoices = () => {
  const [searchString, setSearchString] = useState('')
  const dispatch = useAppDispatch()

  function searchInvoices() {
    dispatch(searchInvoicesByUserNameAndId(searchString))
  }

  return (
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
  )
}
