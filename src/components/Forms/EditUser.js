import { useForm } from "react-hook-form"
import { useState, useContext } from "react"
import classes from './ArticleForm.module.scss'
import { Button } from "antd"
import { MessageContext } from '../Layout/Layout'
import BlogUser from "../../services/blog-user"
import { getCurrentUser } from "../../store/userSlice"
import { useDispatch, useSelector } from "react-redux"


const EditUser = () => {
    const blogUser = new BlogUser()

    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()
    const email = useSelector(state => state.user.email)
    const username = useSelector(state => state.user.username)
    const token = useSelector(state => state.user.token)

    const { pushMessage } = useContext(MessageContext)



    const {
        register,
        formState: {
            errors,
        },
        handleSubmit,
        setError
    } = useForm({
        mode: "onBlur"
    })

    const onSubmit = async (data) => {
        setLoading(true)
        const filterKeys = Object.keys(data).filter((key) => data[key] !== '')
        const filterObj = filterKeys.reduce((result, key) => {
            result[key] = data[key]
            return result
        }, {})
        if (!Object.keys(filterObj).length) {
            setLoading(false)
            return pushMessage('warning', 'You did not change anything')
        } else {
            const res = await blogUser.updateCurrentUser(token, { user: { ...filterObj } })
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
                return setLoading(false)
            }
            if (res.ok) {
                dispatch(getCurrentUser(token))
                pushMessage('success', 'Profile has changed')
                return setLoading(false)
            }
        }
        
    }


    return (
        <div className={classes.form}>
            <form className={classes.form__main} onSubmit={handleSubmit(onSubmit)}>
                <fieldset className={classes.form__content}>
                    <h1 className={classes.form__title}>Edit Profile</h1>
                    <label className={classes.form__item}>
                        Username
                        <input defaultValue={username} placeholder="Username" className={classes.form__inputOther} {...register('username', {
                            minLength: {
                                value: 3,
                                message: 'Your username must be more than 3 characters',
                            },
                            maxLength: {
                                value: 20,
                                message: 'Your username should not be more than 20 characters'
                            },
                            validate: (v) => {
                                if(v.trim().length === 0) {
                                    return 'Username must not be empty'
                                }
                            },
                            pattern: {
                                value: /^[a-zA-Z0-9]+$/,
                                message: 'The username must consist of English letters and numbers without spaces',
                            },
                        })}></input>
                        {errors?.username && <p className={classes.form__error}> {errors?.username?.message}</p>}
                    </label>
                    <label className={classes.form__item}>
                        Email address
                        <input defaultValue={email} placeholder="Email address" className={classes.form__inputOther} {...register('email', {
                            pattern: {
                              value: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu,
                              message: 'Email is incorrect',
                            },
                            setValueAs: (v) => v.toLowerCase(),
                            validate: (v) => {
                                if (v.trim().length === 0) {
                                    return 'Email must not be empty'
                                }
                            }
                        })}></input>
                        {errors?.email && <p className={classes.form__error}> {errors?.email?.message}</p>}
                    </label>
                    <label className={classes.form__item}>
                        New password
                        <input placeholder="Password" type="password"  className={classes.form__inputOther} {...register('password', {
                            minLength: {
                                value: 6,
                                message: 'Your password must be more than 6 characters long',
                            },
                            maxLength: {
                                value: 40,
                                message: 'Your password must be less than 40 characters'
                            }
                        })}></input>
                        {errors?.password && <p className={classes.form__error}> {errors?.password?.message}</p>}
                    </label>
                    <label className={classes.form__item}>
                        Avatar image (url)
                        <input placeholder="Avatar image" className={classes.form__inputOther} {...register('image', {
                            pattern: {
                                value: /https?:\/\/(.+?)\/(([a-zA-Z0-9_ \-%.]*)\.(jpg|png|jpeg|gif))/,
                                message: 'URL is incorrect',
                            },
                        })}></input>
                        {errors?.image && <p className={classes.form__error}> {errors?.image?.message}</p>}
                    </label>
                    <Button className={classes.form__button} loading={loading} htmlType='submit' type='primary'>Save</Button>
                </fieldset>
            </form>
        </div>
    )

}

export default EditUser