import React, { useState } from 'react'

export function FooterItems(props: any) {
  const [inputDiscount, setInputDiscount] = useState(
    props.invoice.discount ? true : false,
  )
  const [inputTax, setInputTax] = useState(false)
  const [discount, setDiscount] = useState(props.invoice.discount)

  function sendDiscountToInvoice(value: number) {
    const discount = value ? (value < 0 ? 0 : value > 100 ? 100 : value) : 0

    setDiscount(discount)
    props.setDiscount(discount)
  }

  const InputDiscount = () => (
    <div className="col-span-2">
      <label className="relative block flex">
        <input
          className="border border-gray-medium w-20 rounded-xl p-2 focus:outline-none focus:border-green-hover focus:ring-green-hover focus:ring-0"
          type={'number'}
          name="discount"
          onChange={(e) => sendDiscountToInvoice(parseInt(e.target.value))}
          value={discount}
        />
        <span className="absolute inset-y-0 right-6 flex items-center">%</span>
      </label>
    </div>
  )

  return (
    <div className="grid justify-items-end font-semibold text-right">
      <div>
        <div className="flex p-3">
          <div className="mr-8">Subtotal</div>
          <div className="mx-auto">${props.subTotal / 100}</div>
        </div>
        <div className="flex px-3">
          <div className="mt-2 mr-8">Discount</div>
          {!props.setDiscount ? (
            <div className="mx-auto mt-2">{props.invoice.discount}%</div>
          ) : inputDiscount ? (
            <InputDiscount />
          ) : (
            <button
              onClick={() => setInputDiscount(true)}
              className="text-green-medium w-2/4 mx-auto mt-2"
            >
              Add
            </button>
          )}
        </div>
        <div className="flex px-3 mt-4">
          <div className="mr-16 pr-2">Tax</div>
          {props.invoice ? (
            <div className="mx-auto">
              {props.invoice.tax ? props.invoice.tax : 0}%
            </div>
          ) : inputTax ? (
            <InputDiscount />
          ) : (
            <button
              className="text-green-medium text-rigth w-2/4 mx-auto"
              // onClick={() => setInputTax(true)}
            >
              Add
            </button>
          )}
        </div>
        <hr className="col-span-2 border-gray-border mt-2" />
        <div className="flex p-3">
          <div className="mr-14">Total</div>
          <div className="mx-auto">${props.total / 100}</div>
        </div>
      </div>
    </div>
  )
}
