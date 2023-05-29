import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import BlogData from "../services/blog-data";

const blogData = new BlogData()

export const getArticles = createAsyncThunk(
    'articles/getArticles',
    async function ({ page, token }) {
        try {
            const res = await blogData.getArticleList(page, token);
            return res.result;
        } catch (error) {
            console.error('Error fetching articles:', error);
            throw error;
        }
    }
);

export const getArticle = createAsyncThunk(
    'articles/getArticle',
    async function (slug, token) {
        try {
            const res = await blogData.getArticle(slug, token);
            return res.result;
        } catch (error) {
            console.error('Error fetching article:', error);
            throw error;
        }
    }
);

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
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getArticles.pending, (state) => {
                state.articlesLoading = true
            })
            .addCase(getArticles.fulfilled, (state, action) => {
                state.articles = [...action.payload.articles]
                state.articlesCount = action.payload.articlesCount
                state.articlesLoading = false
            })
            .addCase(getArticles.rejected, (state) => {
                state.articlesError = true
            })
            .addCase(getArticle.pending, (state) => {
                state.articlesLoading = true
            })
            .addCase(getArticle.fulfilled, (state, action) => {
                state.article = action.payload.article
                state.articlesLoading = false
            })
            .addCase(getArticle.rejected, (state) => {
                state.articlesError = true
            })
    }

})


export const { setArticleList, setArticle } = articlesSlice.actions

export default articlesSlice.reducer