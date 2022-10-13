import { AxiosError, AxiosRequestConfig } from 'axios'
import api from 'axios/axios'
import { AppDispatch } from 'redux/store'
import { errorOccurred, resetError } from '../error/error.slice'
import { startLoading, stopLoading } from '../loader/loader.slice'
import { resetSuccess, successAction } from '../success/success.slice'
import {
  IInvoice,
  updateInvoiceSuccess,
  initialInvoices,
  removeInvoiceSuccess,
} from './invoice.slice'

const getAllInvoices = () => {
  return api.get('/invoices')
}

const createInvoice = async (invoice: any) => {
  return await api.post('/invoices', invoice)
}

const removeInvoice = (invoiceId: number) => {
  return api.delete(`/invoices/${invoiceId}`)
}

export const getUserByParams = async (params: any) => {
  return await api
    .post('/invoices/customer', params)
    .then((response) => response.data)
}

export const fetchCreateInvoice = (invoice: any) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(resetError())
      dispatch(resetSuccess())
      dispatch(startLoading())

      const response = await createInvoice(invoice)

      console.log(response.data)

      dispatch(updateInvoiceSuccess(response.data))
      dispatch(successAction({ message: 'Invoice created successfully' }))
    } catch (e) {
      const axiosErr = e as AxiosError
      const status = axiosErr.response?.status
      const message = axiosErr.message

      console.log(e)

      dispatch(errorOccurred({ statusCode: status, message: message }))
      // dispatch(updateInvoiceFail())
    } finally {
      dispatch(stopLoading())
    }
  }
}

export const fetchAllInvoices = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(resetError())
      dispatch(startLoading())
      const response = await getAllInvoices()

      dispatch(initialInvoices(response.data))
    } catch (e) {
      const axiosErr = e as AxiosError
      const status = axiosErr.response?.status
      const message = axiosErr.message

      dispatch(errorOccurred({ statusCode: status, message: message }))
    } finally {
      dispatch(stopLoading())
    }
  }
}

export const fetchRemoveInvoice = (invoiceId: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(resetError())
      dispatch(startLoading())
      await removeInvoice(invoiceId)

      dispatch(removeInvoiceSuccess(invoiceId))
    } catch (e) {
      const axiosErr = e as AxiosError
      const status = axiosErr.response?.status
      const message = axiosErr.message

      dispatch(errorOccurred({ statusCode: status, message: message }))
    } finally {
      dispatch(stopLoading())
    }
  }
}
