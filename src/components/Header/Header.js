import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useContext } from 'react'

import { logOut } from '../../store/userSlice'
import { MessageContext } from '../Layout/Layout'
import {
  PATH_ARTICLES,
  PATH_HOME_PAGE,
  PATH_NEW_ARTICLE,
  PATH_PROFILE,
  PATH_SIGN_IN,
  PATH_SIGN_UP,
} from '../../path/path'

import classes from './Header.module.scss'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const image = useSelector((state) => state.user.image)
  const username = useSelector((state) => state.user.username)
  const isAuth = useSelector((state) => state.user.isAuth)

  const { pushMessage } = useContext(MessageContext)

  const onLogout = () => {
    localStorage.removeItem('token')
    dispatch(logOut())
    navigate(PATH_HOME_PAGE, { replace: true })
    pushMessage('success', 'Logged out')
  }

  return (
    <header className={classes.header}>
      <Link className={classes.header__title} to={PATH_ARTICLES}>
        Realworld Blog
      </Link>
      {isAuth === false && (
        <Link className={classes.header__signin} to={PATH_SIGN_IN}>
          Sign In
        </Link>
      )}
      {isAuth === false && (
        <Link className={classes.header__signup} to={PATH_SIGN_UP}>
          Sign Up
        </Link>
      )}
      {isAuth && (
        <Link className={classes.header__create} to={PATH_NEW_ARTICLE}>
          Create article
        </Link>
      )}
      {isAuth && (
        <Link className={classes.header__link} to={PATH_PROFILE}>
          <div className={classes.header__user}>
            <p className={classes.header__username}>{username}</p>
            <img className={classes.header__avatar} src={image} alt="avatar"></img>
          </div>
        </Link>
      )}

      {isAuth && (
        <button onClick={onLogout} className={classes.header__logout}>
          Log out
        </button>
      )}
    </header>
  )
}

export default Header
