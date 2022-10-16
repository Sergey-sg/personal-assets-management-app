import { configureStore } from '@reduxjs/toolkit'
import {
  authSlice,
  errorSlice,
  loaderSlice,
  successSlice,
  userProfileSlice,
} from './slice'
import invoiceSlice from './slice/invoiceServices/invoice.slice'
import paginationSlice from './slice/pagination/pagination.slice'

export const store = configureStore({
  reducer: {
    authSlice,
    userProfile: userProfileSlice,
    invoices: invoiceSlice,
    pagination: paginationSlice,
    success: successSlice,
    error: errorSlice,
    loader: loaderSlice,
  },
})
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
