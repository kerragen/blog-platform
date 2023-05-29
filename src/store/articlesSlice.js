import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import BlogData from '../services/blog-data'

const blogData = new BlogData()

export const getArticles = createAsyncThunk('articles/getArticles', async function ({ page, token }) {
  const res = await blogData.getArticleList(page, token)
  if (!res.ok) {
    throw new Error()
  }
  return res.result
})

export const getArticle = createAsyncThunk('articles/getArticle', async function (slug, token) {
  const res = await blogData.getArticle(slug, token)
  if (!res.ok) {
    throw new Error()
  }
  return res.result
})

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    articles: [],
    article: null,
    articlesLoading: false,
    articlesCount: 0,
    articlesError: false,
  },
  reducers: {
    setArticleList(state) {
      state.articles = []
    },
    setArticle(state) {
      state.article = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getArticles.pending, (state) => {
        state.articlesLoading = true
        state.articlesError = false
      })
      .addCase(getArticles.fulfilled, (state, action) => {
        state.articles = [...action.payload.articles]
        state.articlesCount = action.payload.articlesCount
        state.articlesLoading = false
      })
      .addCase(getArticles.rejected, (state) => {
        state.articlesError = true
        state.articlesLoading = false
      })
      .addCase(getArticle.pending, (state) => {
        state.articlesLoading = true
        state.articlesError = false
      })
      .addCase(getArticle.fulfilled, (state, action) => {
        state.article = action.payload.article
        state.articlesLoading = false
      })
      .addCase(getArticle.rejected, (state) => {
        state.articlesError = true
        state.articlesLoading = false
      })
  },
})

export const { setArticleList, setArticle } = articlesSlice.actions

export default articlesSlice.reducer
