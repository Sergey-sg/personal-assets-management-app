import api, { apiCreden } from './../../axios/axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { stat } from 'fs'
import { Console } from 'console'

export const fetchLogin = createAsyncThunk(
  'users/fetchById',
  async (params: any) => {
    const { data, status } = await api.post('/auth/login', params)

    sessionStorage.setItem('emailVerify', params.email)
    sessionStorage.setItem('password', params.password)

    return { data, status }
  },
)

export const Registration = createAsyncThunk(
  'users/fetchRegistration',
  async (params: any): Promise<any> => {
    const { data } = await api.post('auth/register', params)

    return data
  },
)

export const Logout = createAsyncThunk('users/fetchLogout', async () => {
  const { data } = await api.post('/auth/logout')

  window.localStorage.removeItem('token')

  return data
})

export const GetAllUsers = createAsyncThunk('users/fetchAll', async () => {
  const { data } = await api.get('users')

  return data
})

export const checkAuth = createAsyncThunk('users/check', async () => {
  const { data, status } = await apiCreden.post(
    'http://localhost:3001/api/auth/refresh',
  )

  return { data, status }
})

export const authWithGoogle = createAsyncThunk(
  'users/google',
  async (credentialResponse: object) => {
    const { data } = await apiCreden.post(
      'http://localhost:3001/api/auth/google/auth',
      {
        token: credentialResponse,
      },
    )

    return data
  },
)

export const checkEmailAndSendCode = createAsyncThunk(
  'users/checkEmailAndSendCode',
  async (params: any): Promise<any> => {
    const { data, status } = await apiCreden.post('auth/forgotPassword', params)

    return { data, status, params }
  },
)
export const checkEmailAndSendCodeAgain = createAsyncThunk(
  'users/checkEmailAndSendCodeAgain',
  async (): Promise<any> => {
    const email = sessionStorage.getItem('emailVerify')
      ? sessionStorage.getItem('emailVerify')
      : sessionStorage.getItem('email')
    const { data, status } = await apiCreden.post('auth/forgotPassword', {
      email: email,
    })

    return { data, status }
  },
)

export const verifyCode = createAsyncThunk(
  'users/verifyCode',
  async (params: any): Promise<any> => {
    const email = sessionStorage.getItem('email')
      ? sessionStorage.getItem('email')
      : sessionStorage.getItem('emailVerify')
    const { code } = params
    const codeString = code.toString()
    const { data, status } = await apiCreden.post('auth/verifyCode', {
      email,
      code: codeString,
    })

    return { statusCode: status }
  },
)

export const refreshPassword = createAsyncThunk(
  'users/refreshPassword',
  async (params: any): Promise<number> => {
    const email =
      sessionStorage.getItem('email') && sessionStorage.getItem('email')

    const { status } = await apiCreden.patch('auth/refreshPassword', {
      email,
      password: params,
    })

    return status
  },
)

export const verifyCodeAuth = createAsyncThunk(
  'users/verifyCodeAuth',
  async (params: any): Promise<any> => {
    const email =
      sessionStorage.getItem('emailVerify') &&
      sessionStorage.getItem('emailVerify')
    const password = sessionStorage.getItem('password')
    const { code } = params
    const codeString = code.toString()
    const { data, status } = await api.post('auth/login/verify', {
      email: email,
      password: password,
      code: codeString,
    })

    return { data, status }
  },
)
