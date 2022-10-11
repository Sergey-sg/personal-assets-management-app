import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUserProfile } from '../userProfile/userProfile.slice'

export interface IInvoice {
  id: number
  billedTo: IUserProfile | null
  items: object[]
  discount: number
  paid: boolean
  dueDate: string
  invoiceDate: string
  invoiceDetails: string
  total: number
}

const initialState: { invoices: IInvoice[]; outInvoices: IInvoice[] } = {
  invoices: [],
  outInvoices: [],
}

export const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    initialInvoices: (state, action) => ({
      invoices: action.payload,
      outInvoices: action.payload,
    }),
    updateInvoiceSuccess: (state, action: PayloadAction<IInvoice>) => ({
      invoices: [...state.invoices, action.payload],
      outInvoices: [...state.invoices, action.payload],
    }),
    // updateInvoiceFail: () => {},
    removeInvoiceSuccess: (state, action) => {
      state.invoices = state.invoices.filter(
        (invoice) => invoice.id !== action.payload,
      )
      state.outInvoices = state.outInvoices.filter(
        (invoice) => invoice.id !== action.payload,
      )
    },
    searchInvoicesByUserNameAndId: (state, action) => {
      if (!action.payload) {
        state.outInvoices = state.invoices
      } else {
        state.outInvoices = state.outInvoices.filter(
          (invoice: IInvoice) =>
            `${invoice.billedTo?.firstName} ${invoice.billedTo?.lastName}`
              .toLowerCase()
              .includes(action.payload.toLowerCase()) ||
            invoice.id.toString().includes(action.payload),
        )
      }
    },
    sortByDateInStore: (state, action) => {
      state.outInvoices.sort((a, b) => {
        if (new Date(a.invoiceDate) > new Date(b.invoiceDate)) {
          return action.payload ? -1 : 1
        }
        if (new Date(a.invoiceDate) < new Date(b.invoiceDate)) {
          return action.payload ? 1 : -1
        }

        return 0
      })
    },
    filterBy: (state, action) => {
      if (
        !action.payload.maxDate &&
        !action.payload.minDate &&
        !action.payload.minPrice &&
        !action.payload.maxPrice &&
        !action.payload.status
      ) {
        state.outInvoices = state.invoices
      } else {
        let invoiceList = state.outInvoices.slice()

        if (action.payload.status) {
          invoiceList = invoiceList.filter((invoice: IInvoice) => {
            const nowDate = new Date()
            const dueDate = new Date(invoice.dueDate)
            const statusInvoice = invoice.paid
              ? 'Paid'
              : nowDate < dueDate
              ? 'Pending'
              : 'Unpaid'

            return action.payload.status === statusInvoice
          })
        }
        if (action.payload.minDate) {
          invoiceList = invoiceList.filter(
            (invoice) =>
              new Date(invoice.invoiceDate) >= new Date(action.payload.minDate),
          )
        }
        if (action.payload.maxDate) {
          invoiceList = invoiceList.filter(
            (invoice) =>
              new Date(invoice.invoiceDate) <= new Date(action.payload.maxDate),
          )
        }
        if (action.payload.minPrice) {
          invoiceList = invoiceList.filter(
            (invoice) =>
              invoice.total / 100 >= parseFloat(action.payload.minPrice),
          )
        }
        if (action.payload.maxPrice) {
          invoiceList = invoiceList.filter(
            (invoice) =>
              invoice.total / 100 <= parseFloat(action.payload.maxPrice),
          )
        }

        state.outInvoices = invoiceList
      }
    },
  },
})

export const {
  updateInvoiceSuccess,
  removeInvoiceSuccess,
  searchInvoicesByUserNameAndId,
  initialInvoices,
  sortByDateInStore,
  filterBy,
} = invoiceSlice.actions

export default invoiceSlice.reducer
