import { useForm } from 'react-hook-form'
import { useContext, useState } from 'react'
import { Button } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import BlogUser from '../../services/blog-user'
import { getCurrentUser } from '../../store/userSlice'
import { MessageContext } from '../Layout/Layout'
import { PATH_HOME_PAGE, PATH_SIGN_UP } from '../../path/path'

import classes from './ArticleForm.module.scss'

const SignIn = () => {
  const blogUser = new BlogUser()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { pushMessage } = useContext(MessageContext)

  const [loading, setLoading] = useState(false)
  const {
    register,
    formState: { errors },
    handleSubmit,
    clearErrors,
    setError,
  } = useForm({
    mode: 'onBlur',
  })

  const onSubmit = async (data) => {
    setLoading(true)
    clearErrors()
    const userData = {
      user: {
        email: data.email,
        password: data.password,
      },
    }
    const res = await blogUser.loginUser(userData)

    if (!res.ok) {
      setLoading(false)
      if (res.result.errors?.['email or password']) {
        setError('password', {
          type: 'invalid',
          message: 'Email or password is invalid',
        })
      }
    }
    if (res.ok) {
      localStorage.setItem('token', res.result.user.token)
      setLoading(false)
      dispatch(getCurrentUser(localStorage.getItem('token'))).then(navigate(PATH_HOME_PAGE, { replace: true }))
      pushMessage('success', 'You are logged in')
    }
  }

  return (
    <div className={classes.form}>
      <form className={classes.form__main} onSubmit={handleSubmit(onSubmit)}>
        <fieldset className={classes.form__content}>
          <h1 className={classes.form__title}>Sign In</h1>
          <label className={classes.form__item}>
            Email address
            <input
              placeholder="Email address"
              className={classes.form__inputOther}
              {...register('email', {
                required: 'Email is required',
                pattern: /^\S+@\S+$/i,
              })}
            ></input>
            {errors?.email && <p className={classes.form__error}> {errors?.email?.message}</p>}
          </label>
          <label className={classes.form__item}>
            Password
            <input
              placeholder="Password"
              type="password"
              className={classes.form__inputOther}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Your password must be more than 6 characters long',
                },
                maxLength: {
                  value: 40,
                  message: 'Your password must be less than 40 characters',
                },
              })}
            ></input>
            {errors?.password && <p className={classes.form__error}> {errors?.password?.message}</p>}
          </label>
          <Button className={classes.form__button} loading={loading} htmlType="submit" type="primary">
            Login
          </Button>
          <p className={classes.form__tip}>
            Don&#39;t have an account?{' '}
            <Link to={PATH_SIGN_UP} className={classes.form__link}>
              Sign Up.
            </Link>
          </p>
        </fieldset>
      </form>
    </div>
  )
}

export default SignIn
