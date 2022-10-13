import React, { useState } from 'react'

export function InputItem(props: {
  setItem: (arg0: {
    subTotal: number
    id: number
    name: string
    amount: number
    price: number
  }) => void
}) {
  const [item, setItem] = useState({
    id: Date.now(),
    name: '',
    amount: 0,
    price: 0,
  })

  function submitValue() {
    const subTotal = (item.price * item.amount) | 0

    if (item.name && item.price && item.amount) {
      props.setItem({ ...item, subTotal })
      setItem({ id: Date.now(), name: '', amount: 0, price: 0 })
    }
  }

  return (
    <div className="container grid grid-cols-12 gap-4">
      <input
        className="col-span-5 border border-gray-medium rounded-xl p-4 focus:outline-none focus:border-green-hover focus:ring-green-hover focus:ring-0"
        type={'text'}
        name="name"
        onChange={(e) => setItem({ ...item, name: e.target.value })}
        value={item.name}
      />
      <input
        className="col-span-3 border border-gray-medium rounded-xl p-4 focus:outline-none focus:border-green-hover focus:ring-green-hover focus:ring-0"
        type={'number'}
        name="number"
        onChange={(e) => setItem({ ...item, amount: parseInt(e.target.value) })}
        value={item.amount > 0 ? item.amount : ''}
      />
      <input
        className="col-span-2 border border-gray-medium rounded-xl p-4 focus:outline-none focus:border-green-hover focus:ring-green-hover focus:ring-0"
        type={'number'}
        name="price"
        onChange={(e) =>
          setItem({ ...item, price: parseFloat(e.target.value) * 100 })
        }
        value={item.price > 0 ? item.price / 100 : ''}
      />
      <button
        className="col-span-2 text-green-medium border border-gray-medium rounded-xl py-4 hover:bg-gray-ultralight"
        onClick={() => submitValue()}
      >
        Add Item
      </button>
    </div>
  )
}
