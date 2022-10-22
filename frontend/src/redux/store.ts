import { configureStore } from '@reduxjs/toolkit'
import {
  authSlice,
  conversationsSlice,
  errorSlice,
  loaderSlice,
  messagesSlice,
  successSlice,
  userProfileSlice,
  walletsSlice,
  incomeSlice,
  costsSlice,
} from './slice'
import invoiceSlice from './slice/invoiceServices/invoice.slice'
import paginationSlice from './slice/pagination/pagination.slice'
import refreshPasswordSlice from './slice/refreshPasswordSlice'
import todoSlice from './slice/todo/todo.slice'

export const store = configureStore({
  reducer: {
    authSlice,
    userProfile: userProfileSlice,
    invoices: invoiceSlice,
    pagination: paginationSlice,
    success: successSlice,
    error: errorSlice,
    loader: loaderSlice,
    wallets: walletsSlice,
    incomes: incomeSlice,
    costs: costsSlice,
    refreshPasswordSlice,
    messages: messagesSlice,
    conversations: conversationsSlice,
    todo: todoSlice,
  },
})
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
