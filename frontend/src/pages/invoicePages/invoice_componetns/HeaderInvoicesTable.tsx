import { useAppDispatch } from 'hooks/useAppDispatch'
import React, { useState } from 'react'
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md'
import { sortByDateInStore } from 'redux/slice/invoiceServices/invoice.slice'

export const HeaderInvoicesTable: React.FC = () => {
  const [firstNew, setFirstNew] = useState(false)
  const dispatch = useAppDispatch()

  return (
    <div className="container grid grid-cols-12 gap-4 text-left text-xs mb-5 text-text-ultralight">
      <div className="col-span-3">NAME/CLIENT</div>
      <button
        className="col-span-2"
        onClick={() => {
          setFirstNew(!firstNew)
          dispatch(sortByDateInStore(firstNew))
        }}
      >
        <span className="float-left">DATE</span>
        {firstNew ? <MdArrowDropUp size={16} /> : <MdArrowDropDown size={16} />}
      </button>
      <div className="col-span-2">ORDERS/TYPE</div>
      <div className="col-span-2">TOTAL</div>
      <div className="col-span-2">STATUS</div>
      <div className="col-span-1">ACTION</div>
    </div>
  )
}
