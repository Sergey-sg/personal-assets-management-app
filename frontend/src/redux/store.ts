import { configureStore } from '@reduxjs/toolkit'
import {
  authSlice,
  conversationsSlice,
  errorSlice,
  exchangeSlice,
  loaderSlice,
  messagesSlice,
  successSlice,
  userProfileSlice,
  walletsSlice,
  incomeSlice,
  costsSlice,
} from './slice'
import refreshPasswordSlice from './slice/refreshPasswordSlice'
import todoSlice from './slice/todo/todo.slice'
import walletLimitSlice from './slice/walletLimitSlice'

export const store = configureStore({
  reducer: {
    authSlice,
    userProfile: userProfileSlice,
    success: successSlice,
    error: errorSlice,
    loader: loaderSlice,
    exchange: exchangeSlice,
    wallets: walletsSlice,
    incomes: incomeSlice,
    costs: costsSlice,
    refreshPasswordSlice,
    messages: messagesSlice,
    conversations: conversationsSlice,
    todo: todoSlice,
    walletLimit: walletLimitSlice,
  },
})
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
