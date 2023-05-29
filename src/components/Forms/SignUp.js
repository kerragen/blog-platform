import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import { Checkbox, Button } from 'antd'

import BlogUser from '../../services/blog-user'
import { MessageContext } from '../Layout/Layout'

import classes from './ArticleForm.module.scss'

const SignUp = () => {
  const blogUser = new BlogUser()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const { pushMessage } = useContext(MessageContext)

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    watch,
    setValue,
    clearErrors,
  } = useForm({
    mode: 'onBlur',
  })

  const onCheckboxChange = (e) => {
    const checked = e.target.checked
    setValue('agreement', checked ? true : false)
  }

  const onSubmit = async (data) => {
    setLoading(true)
    clearErrors()
    const userData = {
      user: {
        username: data.username,
        email: data.email,
        password: data.password,
      },
    }
    const res = await blogUser.regUser(userData)
    console.log(res)
    setLoading(false)

    if (!res.ok) {
      if (res.result.errors?.username) {
        setError('username', {
          type: 'taken',
          message: 'Username is already taken',
        })
      }
      if (res.result.errors?.email) {
        setError('email', {
          type: 'taken',
          message: 'Email is already taken',
        })
      }
    }

    if (res.ok) {
      navigate('/sign-in', { replace: true })
      pushMessage('success', 'You are registered')
    }
  }

  return (
    <div className={classes.form}>
      <form className={classes.form__main} onSubmit={handleSubmit(onSubmit)}>
        <fieldset className={classes.form__content}>
          <h1 className={classes.form__title}>Create new account</h1>
          <label className={classes.form__item}>
            Username
            <input
              placeholder="Username"
              className={classes.form__inputOther}
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Your username must be more than 3 characters',
                },
                maxLength: {
                  value: 20,
                  message: 'Your username should not be more than 20 characters',
                },
              })}
            ></input>
            {errors?.username && <p className={classes.form__error}> {errors?.username?.message}</p>}
          </label>

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

          <label className={classes.form__item}>
            Repeat password
            <input
              placeholder="Password"
              type="password"
              className={classes.form__inputOther}
              {...register('repeat_password', {
                required: 'Repeat password is required',
                validate: (v) => {
                  if (watch('password') !== v) {
                    return '"Value doesn\'t match password"'
                  }
                },
              })}
            ></input>
            {errors?.repeat_password && <p className={classes.form__error}> {errors?.repeat_password?.message}</p>}
          </label>

          <Checkbox
            {...register('agreement', { required: 'Agreement is required' })}
            onChange={onCheckboxChange}
            className={classes.form__checkbox}
          >
            I agree to the processing of my personal information
          </Checkbox>
          {errors?.agreement && <p className={classes.form__error}> {errors?.agreement?.message}</p>}
          <Button className={classes.form__button} loading={loading} htmlType="submit" type="primary">
            Create
          </Button>
          <p className={classes.form__tip}>
            Already have an account?{' '}
            <Link to="/sign-in" className={classes.form__link}>
              Sign In.
            </Link>
          </p>
        </fieldset>
      </form>
    </div>
  )
}

export default SignUp
