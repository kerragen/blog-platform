import { useContext } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

import { MessageContext } from '../Layout/Layout'

const ReqAuth = ({ children, auth }) => {
  const isAuth = useSelector((state) => state.user.isAuth)
  const { pushMessage } = useContext(MessageContext)

  if (!auth) {
    if (!isAuth) {
      pushMessage('info', 'You must be logged')
      return <Navigate to="/sign-in" />
    }
    return children
  }

  if (auth) {
    if (isAuth) {
      pushMessage('info', 'Log out from your account to access this page')
      return <Navigate to="/" />
    }
    return children
  }
}

export default ReqAuth
