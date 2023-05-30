import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import BlogUser from '../services/blog-user'

const blogUser = new BlogUser()

export const getCurrentUser = createAsyncThunk('user/getCurrentUser', async function (token) {
  try {
    const res = await blogUser.getCurrentUser(token)
    if (!res.ok) {
      throw new Error()
    }
    return res
  } catch (error) {
    throw new Error(error.message)
  }
})

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuth: null,
    token: '',
    email: '',
    username: '',
    image: '',
  },
  reducers: {
    logOut(state) {
      state.isAuth = false
      state.username = ''
      state.image = ''
      state.token = ''
    },
    loadHeader(state) {
      state.isAuth = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.username = action.payload.result.user.username
      state.image = action.payload.result.user?.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'
      state.email = action.payload.result.user.email
      state.token = action.payload.result.user.token
      state.isAuth = true
    })
  },
})

export const { logOut, loadHeader } = userSlice.actions

export default userSlice.reducer
