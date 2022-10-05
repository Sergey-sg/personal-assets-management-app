import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api, { apiCreden } from '../../axios/axios'
export const fetchLogin = createAsyncThunk(
  'users/fetchById',
  async (params: any) => {
    const { data } = await api.post('/auth/login', params)

    return data
  },
)
export const Registration = createAsyncThunk(
  'users/fetchRegistration',
  async (params: any): Promise<any> => {
    const { data } = await api.post('auth/register', params)
    // localStorage.setItem('token', data.tokens.access_token)

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
  const { data } = await apiCreden.post(
    'http://localhost:3001/api/auth/refresh',
  )

  return data
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
//
//
//
interface typeInfo {
  user: object
  status: string
  isAuth: boolean
}
const initialState: typeInfo = {
  user: {},
  status: 'SUCCESS',
  isAuth: false,
}
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLogin.pending, (state) => {
      state.status = 'LOADING'
    })
    builder.addCase(fetchLogin.fulfilled, (state, action) => {
      state.status = 'SUCCESS'
      state.isAuth = true
      state.user = action.payload
      localStorage.setItem('token', action.payload.tokens.access_token)
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
      state.user = action.payload
      localStorage.setItem('token', action.payload.tokens.access_token)
      state.isAuth = true
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
  },
})

export const {} = authSlice.actions

export default authSlice.reducer
