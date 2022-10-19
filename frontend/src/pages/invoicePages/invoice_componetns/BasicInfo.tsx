import { AppRoute } from 'common/enums/app-route.enum'
import { useAppSelector } from 'hooks/useAppDispatch'
import React from 'react'
import {
  convertDate,
  getCorrectDateFormat,
} from '../secondaryFunctions/secondaryFunctions'

export function BasicInfo(props: any) {
  const currentUser = useAppSelector((state) => state.userProfile)

  function setValidInvoiceDateAndDueDate(date: {
    invoiceDate: string
    dueDate: string
  }) {
    const dateNow = new Date()
    const outDate = {
      invoiceDate: props.date.invoiceDate,
      dueDate: props.date.dueDate,
    }

    if (date.dueDate) {
      const dueDate = new Date(date.dueDate)

      if (dueDate >= dateNow) {
        if (
          props.date.invoiceDate &&
          dueDate >= new Date(props.date.invoiceDate)
        ) {
          outDate.dueDate = date.dueDate
        } else if (props.date.invoiceDate) {
          outDate.dueDate = props.date.invoiceDate
        } else {
          outDate.dueDate = getCorrectDateFormat(date.dueDate)
        }
      } else {
        if (props.date.invoiceDate) {
          outDate.dueDate = props.date.invoiceDate
        } else {
          outDate.dueDate = getCorrectDateFormat(dateNow.toString())
        }
      }
    }
    if (date.invoiceDate) {
      const invoiceDate = new Date(date.invoiceDate)

      if (invoiceDate >= dateNow) {
        outDate.invoiceDate = date.invoiceDate
        if (outDate.dueDate && invoiceDate >= new Date(outDate.dueDate)) {
          outDate.dueDate = date.invoiceDate
        }
      } else {
        outDate.invoiceDate = getCorrectDateFormat(dateNow.toString())
      }
    }

    props.setDate(outDate)
  }

  return (
    <div className="container h-max bg-text-white border border-gray-medium rounded-xl">
      <div className="container text-base font-semibold p-5">Basic Info</div>
      <div className="columns-1 px-5">
        <div className="font-medium pb-4">
          <span className="text-text-light">Invoice Date</span>
          {props.invoice ? (
            <div className="w-full border border-gray-medium rounded-xl p-3.5">
              {convertDate(props.invoice.invoiceDate)}
            </div>
          ) : (
            <input
              name="invoice-date"
              className="w-full border border-gray-medium rounded-xl p-3.5"
              type={'date'}
              value={
                props.date.invoiceDate
                  ? getCorrectDateFormat(props.date.invoiceDate)
                  : props.date.invoiceDate
              }
              onChange={(e) =>
                setValidInvoiceDateAndDueDate({
                  invoiceDate: e.target.value,
                  dueDate: '',
                })
              }
            />
          )}
        </div>
        <div className="font-medium pb-4 mb-4">
          <span className="text-text-light">Due Date</span>
          {props.invoice ? (
            <div className="w-full border border-gray-medium rounded-xl p-3.5">
              {convertDate(props.invoice.dueDate)}
            </div>
          ) : (
            <input
              name="due-date"
              className="w-full border border-gray-medium rounded-xl p-3.5"
              type={'date'}
              value={
                props.date.dueDate
                  ? getCorrectDateFormat(props.date.dueDate)
                  : props.date.dueDate
              }
              onChange={(e) =>
                setValidInvoiceDateAndDueDate({
                  invoiceDate: '',
                  dueDate: e.target.value,
                })
              }
            />
          )}
        </div>
        {props.invoice ? (
          props.invoice.createdBy.email === currentUser.email && (
            <a
              href={`/${AppRoute.PORTAL}/${AppRoute.INVOICES}/${AppRoute.INVOICE_UPDATE}/${props.invoice.id}`}
            >
              <div className="bg-green-light rounded-xl w-full font-semibold text-base py-4 my-4 hover:bg-green-hover text-center">
                Update Invoice
              </div>
            </a>
          )
        ) : (
          <button
            onClick={() => props.sendInvoice()}
            className="bg-green-light rounded-xl w-full font-semibold text-base py-4 my-4 hover:bg-green-hover"
          >
            Send Invoice
          </button>
        )}
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
