import { configureStore } from '@reduxjs/toolkit'
import {
  authSlice,
  errorSlice,
  loaderSlice,
  successSlice,
  userProfileSlice,
} from './slice'

export const store = configureStore({
  reducer: {
    authSlice,
    userProfile: userProfileSlice,
    success: successSlice,
    error: errorSlice,
    loader: loaderSlice,
  },
})
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
