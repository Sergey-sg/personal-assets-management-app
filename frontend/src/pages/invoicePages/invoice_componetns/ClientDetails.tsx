import React, { useCallback, useState } from 'react'
import { getUserByParams } from 'redux/slice/invoiceServices/invoiceActions'
import { currentImagesPath } from '../secondaryFunctions/secondaryFunctions'
import { UserInputModalForm } from './UserInputModalForm'

export function ClientDetails(props: any) {
  const [client, setClient] = useState(
    props.client
      ? props.client
      : {
          firstName: '',
          lastName: '',
          email: '',
          address: '',
          phone: '',
          avatarPath: '',
        },
  )
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [userAllReady, setUserAllReady] = useState(props.client ? true : false)
  const userFullName = client.firstName
    ? `${client.firstName} ${client.lastName}`
    : client.email
  const address = client.address ? client.address.split(',') : ''

  async function getUser(params: any) {
    let correctParams = {}

    Object.keys(params).forEach((key) => {
      if (params[key]) {
        correctParams = { ...correctParams, [key]: params[key] }
      }
    })

    try {
      const user = await getUserByParams(correctParams)

      setClient(user)
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
        {client.email && (
          <>
            <img
              className="px-5 mb-2 float-left"
              src={currentImagesPath(client.avatarPath)}
              alt={userFullName}
            />
            <div className="text-base font-semibold text-lg px-4">
              {userFullName}
            </div>
            <div className="text-base font-normal text-text-ultralight px-4">
              {client.email}
            </div>
          </>
        )}
      </div>
      <br />
      <hr className="border-gray-border w-11/12 mx-auto" />
      <div className="container columns-1 p-5">
        {client.address && (
          <>
            <div className="text-base font-semibold text-lg">{address[1]}</div>
            <div className="text-base font-normal text-text-ultralight">
              {address[0]}, {address[2]}
            </div>
          </>
        )}
        {props.setCustomer && (
          <>
            <br />
            <UserInputModalForm
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
          </>
        )}
      </div>
    </div>
  )
}
