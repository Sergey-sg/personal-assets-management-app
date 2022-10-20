import { configureStore } from '@reduxjs/toolkit'
import {
  authSlice,
  conversationsSlice,
  errorSlice,
  loaderSlice,
  messagesSlice,
  successSlice,
  userProfileSlice,
} from './slice'
import refreshPasswordSlice from './slice/refreshPasswordSlice'

export const store = configureStore({
  reducer: {
    authSlice,
    userProfile: userProfileSlice,
    success: successSlice,
    error: errorSlice,
    loader: loaderSlice,
    refreshPasswordSlice,
    messages: messagesSlice,
    conversations: conversationsSlice,
  },
})
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
