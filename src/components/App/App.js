import { Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import ArticleList from '../ArticleList/ArticleList'
import Layout from '../Layout/Layout'
import SignUp from '../Forms/SignUp'
import SignIn from '../Forms/SignIn'
import ArticleFull from '../ArticleFull/ArticleFull'
import { getCurrentUser, loadHeader } from '../../store/userSlice'
import EditUser from '../Forms/EditUser'
import ArticleForm from '../Forms/ArticleForm'
import ReqAuth from '../HOC/ReqAuth'
import Error404 from '../Errors/Error404'
import './App.scss'
import {
  PATH_ANY,
  PATH_ARTICLE,
  PATH_ARTICLES,
  PATH_FULL_EDIT_ARTICLE,
  PATH_HOME_PAGE,
  PATH_NEW_ARTICLE,
  PATH_PROFILE,
  PATH_SIGN_IN,
  PATH_SIGN_UP,
} from '../../path/path'

const App = () => {
  const dispatch = useDispatch()
  const isAuth = useSelector((state) => state.user.isAuth)

  useEffect(() => {
    let token = localStorage.getItem('token')
    if (token) {
      dispatch(getCurrentUser(token))
    } else {
      dispatch(loadHeader())
    }
  }, [dispatch, isAuth])
  return (
    <>
      <Routes>
        <Route path={PATH_HOME_PAGE} element={<Layout />}>
          <Route index element={<ArticleList />} />
          <Route path={PATH_ARTICLES} element={<ArticleList />} />
          <Route path={PATH_ARTICLE} element={<ArticleFull />} />
          <Route
            path={PATH_SIGN_IN}
            element={
              <ReqAuth auth={true}>
                <SignIn />
              </ReqAuth>
            }
          />
          <Route
            path={PATH_SIGN_UP}
            element={
              <ReqAuth auth={true}>
                <SignUp />
              </ReqAuth>
            }
          />
          <Route
            path={PATH_PROFILE}
            element={
              <ReqAuth auth={false}>
                <EditUser />
              </ReqAuth>
            }
          />
          <Route
            path={PATH_NEW_ARTICLE}
            element={
              <ReqAuth auth={false}>
                <ArticleForm edit={false} />
              </ReqAuth>
            }
          />
          <Route
            path={PATH_FULL_EDIT_ARTICLE}
            element={
              <ReqAuth auth={false}>
                <ArticleForm edit={true} />
              </ReqAuth>
            }
          />
          <Route path={PATH_ANY} element={<Error404 />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
