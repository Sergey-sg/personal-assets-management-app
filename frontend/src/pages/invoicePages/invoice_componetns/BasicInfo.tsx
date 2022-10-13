import React from 'react'

export function BasicInfo(props: any) {
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
        <button
          onClick={() => props.sendInvoice()}
          className="bg-green-light rounded-xl w-full font-semibold text-base py-4 my-4 hover:bg-green-hover"
        >
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
