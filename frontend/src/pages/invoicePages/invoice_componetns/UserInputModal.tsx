import React, { useState } from 'react'
import { MdOutlineCancel } from 'react-icons/md'

export const UserInputModal = (props: any) => {
  const [customerParams, setCustomerParams] = useState({ email: '', phone: '' })

  return (
    <>
      <button
        className="bg-green-minimal text-green-medium font-medium rounded-xl w-full py-3.5 font-semibold hover:bg-green-ultralight"
        onClick={() => props.setShowModal(true)}
      >
        {props.userAllReady ? (
          <span>Change Customer</span>
        ) : (
          <span>Add Customer</span>
        )}
      </button>
      {props.showModal ? (
        <>
          <div className="flex backdrop-blur-sm justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-3xl text-base font-semibold">
                    Customer Info
                  </h3>
                  <button
                    className="bg-transparent border-0 text-black float-right"
                    onClick={() => props.setShowModal(false)}
                  >
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 hover:text-error h-12 w-11 block opacity-7">
                      <MdOutlineCancel size={20} />
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  {props.error && (
                    <div className="text-error mb-4">{props.error}</div>
                  )}
                  <form className="bg-gray-ultralight rounded px-8 pt-6 pb-8 w-full">
                    <label className="block text-black text-sm font-bold mb-1">
                      Email:
                    </label>
                    <input
                      type="email"
                      onChange={(e) =>
                        setCustomerParams({
                          ...customerParams,
                          email: e.target.value,
                        })
                      }
                      value={customerParams.email}
                      className="w-full border border-gray-light rounded-xl p-2 mb-2 focus:outline-none focus:border-green-hover focus:ring-green-hover focus:ring-0"
                    />
                    <label className="block text-black text-sm font-bold mb-1">
                      Phone:
                    </label>
                    <input
                      onChange={(e) =>
                        setCustomerParams({
                          ...customerParams,
                          phone: e.target.value,
                        })
                      }
                      value={customerParams.phone}
                      className="w-full border border-gray-light rounded-xl p-2 focus:outline-none focus:border-green-hover focus:ring-green-hover focus:ring-0"
                    />
                  </form>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-error hover:text-error-dark background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => props.setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-green-minimal text-green-medium font-medium rounded-xl font-semibold hover:bg-green-ultralight px-6 py-3 outline-none focus:outline-none mr-1 mb-1"
                    type="submit"
                    onClick={() => {
                      props.setShowModal(false)
                      if (customerParams.email || customerParams.phone) {
                        props.getCustomer(customerParams)
                      }
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  )
}
