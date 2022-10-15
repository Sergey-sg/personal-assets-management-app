import React from 'react'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatch'
import { fetchRemoveInvoice } from 'redux/slice/invoiceServices/invoiceActions'
import { CONSTANTS } from 'shared/constants'
import DropDownActions from './DropDownActions'
import { InvoiceStatus } from './statics'

export function currentImagesPath(path: string) {
  const currentPath = path.includes('MyFinance')
    ? `${CONSTANTS.CLOUDINARY_FILE_STORAGE}${path}`
    : path

  return currentPath
}

function convertDate(dateString: string) {
  const date = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    hour12: true,
  }).format(new Date(dateString))
  const dateOut = date.split(',')

  return (
    <>
      {dateOut[0]}
      <p className="text-xs text-text-ultralight font-normal">
        at {dateOut[1].toLocaleUpperCase()}
      </p>
    </>
  )
}

export const InvoicesList = () => {
  const dispatch = useAppDispatch()
  const invoices = useAppSelector((state) => state.invoices.invoices)

  function removeInvoice(invoiceId: number) {
    dispatch(fetchRemoveInvoice(invoiceId))
  }

  return (
    <>
      {invoices.length !== 0 ? (
        invoices.map((invoice: any) => (
          <div
            key={invoice.id}
            className="container grid grid-cols-12 gap-4 text-left text-sm mb-4 font-medium text-text"
          >
            <div className="col-span-3 mt-2">
              <img
                className="float-left pr-4"
                src={currentImagesPath(invoice.billedTo.avatarPath)}
                alt={invoice.billedTo.email}
              />
              {`${invoice.billedTo.firstName} ${invoice.billedTo.lastName}`}
              <p className="text-xs text-text-ultralight font-normal">
                Inv: MGL {invoice.id}
              </p>
            </div>
            <div className="col-span-2 mt-2">
              {convertDate(invoice.invoiceDate)}
            </div>
            <div className="col-span-2 text-text-ultralight mt-2">
              {invoice.orders}
            </div>
            <div className="col-span-2 font-bold mt-2">
              ${invoice.total / 100}
            </div>
            <InvoiceStatus paid={invoice.paid} dueDate={invoice.dueDate} />
            <DropDownActions
              removeInvoice={() => removeInvoice(invoice.id)}
              invoiceId={invoice.id}
              paid={invoice.paid}
              dueDate={invoice.dueDate}
              createdByEmail={invoice.createdBy.email}
            />
          </div>
        ))
      ) : (
        <div>There are no invoices here yet</div>
      )}
    </>
  )
}
