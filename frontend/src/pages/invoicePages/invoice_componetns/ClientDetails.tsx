import React, { useCallback, useState } from 'react'
import { getUserByParams } from 'redux/slice/invoiceServices/invoiceActions'
import { currentImagesPath } from './ListInvices'
import { UserInputModal } from './UserInputModal'

export function ClientDetails(props: any) {
  const [billedTo, setBilledTo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phone: '',
    avatarPath: '',
  })
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [userAllReady, setUserAllReady] = useState(false)
  const userFullName = billedTo.firstName
    ? `${billedTo.firstName} ${billedTo.lastName}`
    : billedTo.email
  const address = billedTo.address ? billedTo.address.split(',') : ''

  async function getUser(params: any) {
    let correctParams = {}

    Object.keys(params).forEach((key) => {
      if (params[key]) {
        correctParams = { ...correctParams, [key]: params[key] }
      }
    })

    try {
      const user = await getUserByParams(correctParams)

      setBilledTo(user)
      props.setCustomer(user)
      setError('')
      setUserAllReady(true)
    } catch (e: any) {
      setError(e.response.data.message)
      setShowModal(true)
    }
  }

  return (
    <div className="container h-max bg-text-white border border-gray-medium rounded-xl">
      <div className="container text-base font-semibold p-5">
        Client Details
      </div>
      <div className="container columns-1">
        <img
          className="px-5 mb-2 float-left"
          src={currentImagesPath(billedTo.avatarPath)}
          alt={userFullName}
        />
        <div className="text-base font-semibold text-lg px-4">
          {userFullName}
        </div>
        <div className="text-base font-normal text-text-ultralight px-4">
          {billedTo.email}
        </div>
      </div>
      <br />
      <hr className="border-gray-border w-11/12 mx-auto" />
      <div className="container columns-1 p-5">
        <div className="text-base font-semibold text-lg">{address[1]}</div>
        <div className="text-base font-normal text-text-ultralight">
          {address[0]}, {address[2]}
        </div>
        <br />
        <UserInputModal
          getCustomer={useCallback(
            (params: { email: string; phone: string }) => getUser(params),
            [],
          )}
          showModal={showModal}
          userAllReady={userAllReady}
          setShowModal={useCallback(
            (status: boolean) => setShowModal(status),
            [],
          )}
          error={error}
        />
      </div>
    </div>
  )
}
