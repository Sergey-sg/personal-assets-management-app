import { Typography } from 'components/common/Typography'
import React, { useState } from 'react'
import { MdOutlineCancel, MdOutlineFilterList } from 'react-icons/md'

const FilterMenu = (props: {
  filterByDatePriceStatus: (arg0: {
    minDate: string
    maxDate: string
    minPrice: string
    maxPrice: string
    status: string
  }) => void
}) => {
  const [showSidebar, setShowSidebar] = useState(false)
  const [filters, setFilters] = useState({
    minDate: '',
    maxDate: '',
    minPrice: '',
    maxPrice: '',
    status: '',
  })

  function resetFilters() {
    const resetFilters = {
      minDate: '',
      maxDate: '',
      minPrice: '',
      maxPrice: '',
      status: '',
    }

    setFilters(resetFilters)
    props.filterByDatePriceStatus(resetFilters)
  }

  return (
    <>
      {showSidebar && (
        <button
          className="flex text-4xl text-gray  hover:text-gray-dark items-center cursor-pointer absolute right-10 top-6 z-50"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <MdOutlineCancel size={20} />
        </button>
      )}

      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="border border-gray-ultralight hover:bg-gray-ultralight rounded-xl font-semibold text-base px-4 pt-4 pb-3.5 my-4 ml-4"
      >
        <div className="flex justify-center">
          <MdOutlineFilterList size={20} />
          <span className="pl-3 lg:block hidden">Filters</span>
        </div>
      </button>

      {showSidebar && (
        <div
          className={`top-0 right-0 w-min bg-gray-ultralight  p-5 pl-10 text-white absolute z-40 h-screen ease-in-out duration-300 ${
            showSidebar ? 'translate-x-0 ' : 'translate-x-full'
          }`}
        >
          <Typography className="mt-2 mb-4 text-black" type={'h1'}>
            {'Filter By'}
          </Typography>
          <div className="scroll-auto">
            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 sm:flex mb-4">
              {['Unpaid', 'Paid', 'Pending'].map((statusInvoice: string) => (
                <li key={statusInvoice} className="w-full">
                  <div className="flex items-center pl-3">
                    <input
                      onChange={(e) => {
                        setFilters({ ...filters, status: e.target.value })
                      }}
                      id="unpaidStatus"
                      name="status"
                      type="radio"
                      value={statusInvoice}
                      className="w-4 h-4 text-green bg-gray-100 rounded-xl border-gray-300 focus:ring-green focus:ring-2"
                      checked={filters.status === statusInvoice}
                    />
                    <label
                      htmlFor="unpaidStatus"
                      className="py-3 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      {statusInvoice}
                    </label>
                  </div>
                </li>
              ))}
            </ul>

            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 sm:flex mb-4">
              {[true, false].map((min: boolean) => (
                <li key={min ? 'minDate' : 'maxDate'} className="w-full">
                  <div className="font-medium py-3 pl-2">
                    <span className="text-[#78778B] ml-4">
                      {min ? 'Min' : 'Max'} Date
                    </span>
                    <input
                      onChange={(e) => {
                        min
                          ? setFilters({ ...filters, minDate: e.target.value })
                          : setFilters({ ...filters, maxDate: e.target.value })
                      }}
                      className="w-max border border-[#F5F5F5] rounded-xl p-2"
                      type={'date'}
                      value={min ? filters.minDate : filters.maxDate}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 sm:flex mb-4">
              {[true, false].map((min: boolean) => (
                <li key={min ? 'minPrice' : 'maxPrice'} className="w-full">
                  <div className="font-medium py-3 pl-2">
                    <span className="text-[#78778B] ml-4">
                      {min ? 'Min' : 'Max'} Price
                    </span>
                    <input
                      onChange={(e) => {
                        min
                          ? setFilters({ ...filters, minPrice: e.target.value })
                          : setFilters({ ...filters, maxPrice: e.target.value })
                      }}
                      className="w-full border border-[#F5F5F5] rounded-xl p-2"
                      type={'number'}
                      value={min ? filters.minPrice : filters.maxPrice}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <div>
              <button
                onClick={() => props.filterByDatePriceStatus(filters)}
                className="w-5/12 bg-[#C8EE44] hover:bg-green-hover rounded-xl font-semibold text-base p-4 my-4 mx-3 text-black"
              >
                filter
              </button>
              <button
                onClick={() => resetFilters()}
                className="w-5/12 bg-[#C8EE44] hover:bg-green-hover rounded-xl font-semibold text-base p-4 my-4 mx-3 text-black"
              >
                reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FilterMenu
