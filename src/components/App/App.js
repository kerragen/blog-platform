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
        <Route path="/" element={<Layout />}>
          <Route index element={<ArticleList />} />
          <Route path="articles" element={<ArticleList />} />
          <Route path="articles/:slug" element={<ArticleFull />} />
          <Route
            path="sign-in"
            element={
              <ReqAuth auth={true}>
                <SignIn />
              </ReqAuth>
            }
          />
          <Route
            path="sign-up"
            element={
              <ReqAuth auth={true}>
                <SignUp />
              </ReqAuth>
            }
          />
          <Route
            path="profile"
            element={
              <ReqAuth auth={false}>
                <EditUser />
              </ReqAuth>
            }
          />
          <Route
            path="new-article"
            element={
              <ReqAuth auth={false}>
                <ArticleForm edit={false} />
              </ReqAuth>
            }
          />
          <Route
            path="articles/:slug/edit"
            element={
              <ReqAuth auth={false}>
                <ArticleForm edit={true} />
              </ReqAuth>
            }
          />
          <Route path="*" element={<Error404 />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
