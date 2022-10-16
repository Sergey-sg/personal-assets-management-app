import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUserProfile } from '../userProfile/userProfile.slice'

export interface IInvoice {
  id: number
  billedTo: IUserProfile
  items: object[]
  discount: number
  paid: boolean
  dueDate: string
  invoiceDate: string
  invoiceDetails: string
  total: number
}

const initialState: { invoices: IInvoice[] } = { invoices: [] }

export const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    initialInvoices: (state, action) => ({
      invoices: action.payload,
    }),
    updateInvoiceSuccess: (state, action: PayloadAction<IInvoice>) => ({
      invoices: [...state.invoices, action.payload],
    }),
    addNewPageOfInvoices: (state, action: PayloadAction<IInvoice[]>) => ({
      invoices: [...state.invoices, ...action.payload],
    }),
    // updateInvoiceFail: () => {},
    removeInvoiceSuccess: (state, action) => {
      state.invoices = state.invoices.filter(
        (invoice) => invoice.id !== action.payload,
      )
    },
  },
})

export const {
  updateInvoiceSuccess,
  removeInvoiceSuccess,
  initialInvoices,
  addNewPageOfInvoices,
} = invoiceSlice.actions

export default invoiceSlice.reducer
