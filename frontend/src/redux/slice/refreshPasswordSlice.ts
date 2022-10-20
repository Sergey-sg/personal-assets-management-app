import { stat } from 'fs'
import { createSlice } from '@reduxjs/toolkit'
import {
  checkEmailAndSendCode,
  checkEmailAndSendCodeAgain,
  refreshPassword,
  verifyCode,
} from '../thunk/authThunk'

export interface CounterState {
  value: number
  status: string
  statusCode: number | null
  permission: boolean
  codeWillBySend: boolean
}

const initialState: CounterState = {
  status: 'SUCCESS',
  statusCode: 0,
  permission: false,
  codeWillBySend: false,
  value: 0,
}
const refreshPasswordSlice = createSlice({
  name: 'authRefresh',
  initialState,
  reducers: {
    getPermission(state) {
      state.permission = true
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkEmailAndSendCode.pending, (state) => {
      state.status = 'LOADING'
    })
    builder.addCase(checkEmailAndSendCode.fulfilled, (state, action) => {
      console.log(action.payload['status'])
      state.statusCode = action.payload['status']
      state.status = 'SUCCESS'
      state.codeWillBySend = true
      const { email } = action.payload['params']

      if (state.statusCode == 201) {
        sessionStorage.setItem('email', email)
      }
    })
    builder.addCase(checkEmailAndSendCode.rejected, (state) => {
      state.status = 'ERROR'
    })
    builder.addCase(verifyCode.pending, (state) => {
      state.status = 'LOADING'
    })
    builder.addCase(verifyCode.fulfilled, (state, action) => {
      const { statusCode } = action.payload

      if (statusCode === 200) {
        state.permission = true
        state.codeWillBySend = false
      }
      state.status = 'SUCCESS'
    })
    builder.addCase(verifyCode.rejected, (state) => {
      state.status = 'ERROR'
    })
    builder.addCase(refreshPassword.pending, (state) => {
      state.status = 'LOADING'
    })
    builder.addCase(refreshPassword.fulfilled, (state, action) => {
      const statusCode2 = action.payload

      console.log(action.payload)
      if (statusCode2 === 202) {
        state.statusCode = statusCode2
      }
      state.status = 'SUCCESS'
    })
    builder.addCase(refreshPassword.rejected, (state) => {
      state.status = 'ERROR'
    })
    builder.addCase(checkEmailAndSendCodeAgain.pending, (state) => {
      state.status = 'LOADING'
    })
    builder.addCase(checkEmailAndSendCodeAgain.fulfilled, (state, action) => {
      const { status } = action.payload

      if (status > 202) {
        state.statusCode = status
      }
      state.status = 'SUCCESS'
    })
    builder.addCase(checkEmailAndSendCodeAgain.rejected, (state) => {
      state.status = 'ERROR'
    })
  },
})

export const { getPermission } = refreshPasswordSlice.actions

export default refreshPasswordSlice.reducer
