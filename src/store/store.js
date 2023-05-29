import { configureStore } from '@reduxjs/toolkit'

import articlesReducer from './articlesSlice'
import userReducer from './userSlice'

export default configureStore({
  reducer: {
    articles: articlesReducer,
    user: userReducer,
  },
})
