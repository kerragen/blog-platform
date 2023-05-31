import { useContext } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

import { MessageContext } from '../Layout/Layout'
import { PATH_HOME_PAGE, PATH_SIGN_IN } from '../../path/path'

const ReqAuth = ({ children, auth }) => {
  const isAuth = useSelector((state) => state.user.isAuth)
  const { pushMessage } = useContext(MessageContext)

  if (!auth) {
    if (!isAuth) {
      pushMessage('info', 'You must be logged')
      return <Navigate to={PATH_SIGN_IN} />
    }
    return children
  }

  if (auth) {
    if (isAuth) {
      pushMessage('info', 'Log out from your account to access this page')
      return <Navigate to={PATH_HOME_PAGE} />
    }
    return children
  }
}

export default ReqAuth
