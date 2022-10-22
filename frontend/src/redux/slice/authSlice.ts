import { createSlice } from '@reduxjs/toolkit'
import {
  authWithGoogle,
  checkAuth,
  fetchLogin,
  Logout,
  Registration,
  verifyCodeAuth,
} from '../thunk/authThunk'

interface typeInfo {
  user: object
  status: string
  isAuth: boolean
  isVerify: boolean
  sendAuthMessage: boolean
}
const initialState: typeInfo = {
  user: {},
  status: 'SUCCESS',
  isAuth: false,
  isVerify: false,
  sendAuthMessage: false,
}
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    toggleSendAuthMessage(state) {
      state.sendAuthMessage = true
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLogin.pending, (state) => {
      state.status = 'LOADING'
    })
    builder.addCase(fetchLogin.fulfilled, (state, action) => {
      state.status = 'SUCCESS'
      const statusCode = action.payload['status']

      if (statusCode === 201) {
        state.isVerify = true
      }
    })
    builder.addCase(fetchLogin.rejected, (state) => {
      state.status = 'ERROR'
    })

    builder.addCase(Registration.pending, (state) => {
      state.status = 'LOADING'
    })
    builder.addCase(Registration.fulfilled, (state, action) => {
      state.status = 'SUCCESS'
    })
    builder.addCase(Registration.rejected, (state) => {
      state.status = 'ERROR'
    })

    builder.addCase(Logout.pending, (state) => {
      state.status = 'LOADING'
    })
    builder.addCase(Logout.fulfilled, (state) => {
      state.status = 'SUCCESS'
      state.isAuth = false
      state.user = {}
    })
    builder.addCase(Logout.rejected, (state) => {
      state.status = 'ERROR'
    })

    builder.addCase(checkAuth.pending, (state) => {
      state.status = 'LOADING'
    })
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.status = 'SUCCESS'

      if (action.payload['status'] === 200) {
        state.user = action.payload['data'].user
        localStorage.setItem(
          'token',
          action.payload['data'].tokens.access_token,
        )
        state.isAuth = true
      }
      if (action.payload['status'] > 201) {
        state.user = {}
        localStorage.removeItem('token')
        state.isAuth = false
      }
    })
    builder.addCase(checkAuth.rejected, (state) => {
      state.status = 'ERROR'
      state.isAuth = false
    })

    builder.addCase(authWithGoogle.pending, (state) => {
      state.status = 'LOADING'
    })
    builder.addCase(authWithGoogle.fulfilled, (state, action) => {
      state.status = 'SUCCESS'
      state.user = action.payload
      localStorage.setItem('token', action.payload.tokens.access_token)
      state.isAuth = true
    })
    builder.addCase(authWithGoogle.rejected, (state) => {
      state.status = 'ERROR'
      state.isAuth = false
    })
    builder.addCase(verifyCodeAuth.pending, (state) => {
      state.status = 'LOADING'
    })
    builder.addCase(verifyCodeAuth.fulfilled, (state, action) => {
      state.status = 'SUCCESS'
      const statusCode = action.payload['status']

      console.log(statusCode)

      if (statusCode !== 201) {
        state.sendAuthMessage = true
      }
      const userData = action.payload['data']

      state.user = userData.user

      localStorage.setItem('token', userData.tokens.access_token)
      sessionStorage.clear()
      state.isAuth = true
      state.isVerify = false
    })
    builder.addCase(verifyCodeAuth.rejected, (state, action) => {
      state.sendAuthMessage = true
      state.status = 'ERROR'
      state.isAuth = false
    })
  },
})

export const { toggleSendAuthMessage } = authSlice.actions

export default authSlice.reducer
