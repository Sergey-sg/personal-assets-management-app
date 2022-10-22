import { AxiosError, AxiosRequestConfig } from 'axios'
import api from 'axios/axios'
import { AppDispatch } from 'redux/store'
import { errorOccurred, resetError } from '../error/error.slice'
import { startLoading, stopLoading } from '../loader/loader.slice'
import { setPagination } from '../pagination/pagination.slice'
import { resetSuccess, successAction } from '../success/success.slice'
import {
  updateInvoiceSuccess,
  initialInvoices,
  removeInvoiceSuccess,
  addNewPageOfInvoices,
  setOneInvoice,
} from './invoice.slice'

const getAllInvoices = (filters: any) => {
  const queryParams = Object.keys(filters)
    .map((key: string) =>
      filters[key as keyof typeof filters]
        ? `${key}=${filters[key as keyof typeof filters]}`
        : '',
    )
    .filter((param) => (param ? true : false))

  return api.get(`/invoices?${queryParams.join('&')}`)
}

const createInvoice = async (invoice: any) => {
  return await api.post('/invoices', invoice)
}

const removeInvoice = (invoiceId: number) => {
  return api.delete(`/invoices/${invoiceId}`)
}

const getInvoiceById = (invoiceId: string, forUpdate: boolean) => {
  const queryParam = forUpdate ? '?forUpdate=true' : ''

  return api.get(`/invoices/${invoiceId}${queryParam}`)
}

const updateInvoice = (invoiceId: string, invoice: any) => {
  return api.put(`/invoices/${invoiceId}`, invoice)
}

export const getUserByParams = async (params: any) => {
  return await api
    .post('/invoices/customer', params)
    .then((response) => response.data)
}

export const fetchUpdateInvoice = (invoiceId: string, invoice: any) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(resetError())
      dispatch(resetSuccess())
      dispatch(startLoading())

      const response = await updateInvoice(invoiceId, invoice)

      dispatch(updateInvoiceSuccess(response.data))
      dispatch(successAction({ message: 'Invoice updated successfully' }))
    } catch (e) {
      console.log(e)
      const axiosErr = e as AxiosError
      const status = axiosErr.response?.status
      const message = axiosErr.message

      dispatch(errorOccurred({ statusCode: status, message: message }))
    } finally {
      dispatch(stopLoading())
    }
  }
}

export const fetchCreateInvoice = (invoice: any) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(resetError())
      dispatch(resetSuccess())
      dispatch(startLoading())

      const response = await createInvoice(invoice)

      dispatch(updateInvoiceSuccess(response.data))
      dispatch(successAction({ message: 'Invoice created successfully' }))
    } catch (e: any) {
      console.log(e.response.data.message)
      const axiosErr = e as AxiosError
      const status = axiosErr.response?.status
      const message = axiosErr.message

      dispatch(errorOccurred({ statusCode: status, message: message }))
    } finally {
      dispatch(stopLoading())
    }
  }
}

export const fetchAllInvoices = (filters: any) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(resetError())
      dispatch(startLoading())
      const response = await getAllInvoices(filters)

      dispatch(initialInvoices(response.data.data))
      dispatch(setPagination(response.data.meta))
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

export const fetchLoadNextPageInvoices = (filters: any) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(resetError())
      dispatch(startLoading())
      const response = await getAllInvoices(filters)

      dispatch(addNewPageOfInvoices(response.data.data))
      dispatch(setPagination(response.data.meta))
      dispatch(successAction({ message: 'invoice loaded' }))
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

export const fetchGetInvoiceById = (invoiceId: string, forUpdate: boolean) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(resetError())
      dispatch(startLoading())

      const response = await getInvoiceById(invoiceId, forUpdate)

      dispatch(setOneInvoice(response.data))
      dispatch(successAction({ message: 'Invoice loaded successfully' }))
    } catch (e: any) {
      const axiosErr = e as AxiosError
      const status = axiosErr.response?.status
      const notFoundMessage = 'Invoice does not found for user'
      const message =
        e.response?.data.message === notFoundMessage
          ? notFoundMessage
          : axiosErr.message

      dispatch(errorOccurred({ statusCode: status, message: message }))
    } finally {
      dispatch(stopLoading())
    }
  }
}
