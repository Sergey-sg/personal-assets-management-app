import React, { useState } from 'react'
import { MdOutlineCancel, MdOutlineFilterList } from 'react-icons/md'

const FilterMenu = (props: any) => {
  const [showSidebar, setShowSidebar] = useState(false)
  const [filters, setFilters] = useState({
    minDate: '',
    maxDate: '',
    minPrice: '',
    maxPrice: '',
    status: '',
  })

  function filterWithAll() {
    props.filterByDate(filters.minDate, filters.maxDate)
    props.filterByPrice(filters.minPrice, filters.maxPrice)
    props.filterByStatus(filters.status)
  }

  return (
    <>
      {showSidebar && (
        <button
          className="flex text-4xl text-gray  hover:text-gray-dark items-center cursor-pointer fixed right-10 top-6 z-50"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <MdOutlineCancel size={20} />
        </button>
      )}

      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="border border-[#F5F5F5] rounded-xl font-semibold text-base p-4 my-4 ml-4"
      >
        <div className="flex justify-center">
          <MdOutlineFilterList size={20} />
          <span className="pl-3 lg:block hidden">Filters</span>
        </div>
      </button>

      <div
        className={`top-0 right-0 w-min bg-gray-ultralight  p-5 pl-10 text-white absolute z-40 h-max ease-in-out duration-300 ${
          showSidebar ? 'translate-x-0 ' : 'translate-x-full'
        }`}
      >
        <h3 className="mt-10 mb-4 text-4xl text-gray font-semibold">
          I am a sidebar
        </h3>
        <div className="scroll-auto">
          <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 sm:flex mb-4">
            <li className="w-full">
              <div className="flex items-center pl-3">
                <input
                  onChange={(e) => {
                    setFilters({ ...filters, status: e.target.value })
                  }}
                  id="unpaidStatus"
                  name="status"
                  type="radio"
                  value="Unpaid"
                  className="w-4 h-4 text-[#29A073] bg-gray-100 rounded-xl border-gray-300 focus:ring-[#29A073] focus:ring-2"
                />
                <label
                  htmlFor="unpaidStatus"
                  className="py-3 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Unpaid
                </label>
              </div>
            </li>
            <li className="w-full">
              <div className="flex items-center pl-3">
                <input
                  onChange={(e) => {
                    setFilters({ ...filters, status: e.target.value })
                  }}
                  id="paidStatus"
                  name="status"
                  type="radio"
                  value="Paid"
                  className="w-4 h-4 text-[#29A073] bg-gray-100 rounded-xl border-gray-300 focus:ring-[#29A073] focus:ring-2"
                />
                <label
                  htmlFor="paidStatus"
                  className="py-3 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Paid
                </label>
              </div>
            </li>
            <li className="w-full">
              <div className="flex items-center pl-3">
                <input
                  onChange={(e) => {
                    setFilters({ ...filters, status: e.target.value })
                  }}
                  id="pendingStatus"
                  name="status"
                  type="radio"
                  value="Pending"
                  className="w-4 h-4 text-[#29A073] bg-gray-100 rounded-xl border-gray-300 focus:ring-[#29A073] focus:ring-2"
                />
                <label
                  htmlFor="pendingStatus"
                  className="py-3 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Pending
                </label>
              </div>
            </li>
          </ul>
          <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 sm:flex mb-4">
            <li className="w-full">
              <div className="font-medium py-3 pl-2">
                <span className="text-[#78778B] ml-4">Min Date</span>
                <input
                  onChange={(e) => {
                    setFilters({ ...filters, minDate: e.target.value })
                  }}
                  className="w-max border border-[#F5F5F5] rounded-xl p-2"
                  type={'date'}
                />
              </div>
            </li>
            <li className="w-full">
              <div className="font-medium py-3 pl-2">
                <span className="text-[#78778B] ml-4">Max Date</span>
                <input
                  onChange={(e) => {
                    setFilters({ ...filters, maxDate: e.target.value })
                  }}
                  className="w-max border border-[#F5F5F5] rounded-xl p-2"
                  type={'date'}
                />
              </div>
            </li>
          </ul>
          <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 sm:flex mb-4">
            <li className="w-full">
              <div className="font-medium py-3 pl-2">
                <span className="text-[#78778B] ml-4">Min Price</span>
                <input
                  onChange={(e) => {
                    setFilters({ ...filters, minPrice: e.target.value })
                  }}
                  className="w-full border border-[#F5F5F5] rounded-xl p-2"
                  type={'number'}
                />
              </div>
            </li>
            <li className="w-full">
              <div className="font-medium py-3 pl-2">
                <span className="text-[#78778B] ml-4">Max Price</span>
                <input
                  onChange={(e) => {
                    setFilters({ ...filters, maxPrice: e.target.value })
                  }}
                  className="w-full border border-[#F5F5F5] rounded-xl p-2"
                  type={'number'}
                />
              </div>
            </li>
          </ul>
          <div>
            <button
              onClick={filterWithAll}
              className="w-5/12 bg-[#C8EE44] rounded-xl font-semibold text-base p-4 my-4 mx-3 text-black"
            >
              filter
            </button>
            <button className="w-5/12 bg-[#C8EE44] rounded-xl font-semibold text-base p-4 my-4 mx-3 text-black">
              reset
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default FilterMenu
