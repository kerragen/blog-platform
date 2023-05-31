import { useFieldArray, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import { Button } from 'antd'
import { useSelector } from 'react-redux'

import { MessageContext } from '../Layout/Layout'
import BlogData from '../../services/blog-data'
import { PATH_ARTICLES } from '../../path/path'

import classes from './ArticleForm.module.scss'

const ArticleForm = ({ edit }) => {
  const blogData = new BlogData()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const token = useSelector((state) => state.user.token)
  const { pushMessage } = useContext(MessageContext)
  const location = useLocation()

  const tagList = edit ? location.state.tagList.map((e) => ({ value: e })) : []

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    clearErrors,
  } = useForm({
    mode: 'onBlur',
    defaultValues: edit ? { tags: [...tagList] } : {},
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
  })

  const onSubmit = async (data) => {
    setLoading(true)
    clearErrors()
    const tags = []
    for (let tag of data.tags) {
      tags.push(tag.value)
    }
    const articleData = {
      article: {
        title: data.title,
        description: data.description,
        body: data.body,
      },
    }

    if (tags.length) {
      articleData.article.tagList = tags
    }
    const res = edit
      ? await blogData.updateArticle(token, articleData, location.state.slug)
      : await blogData.createArticle(token, articleData)

    console.log(res)

    if (res.ok) {
      setLoading(false)
      navigate(`${PATH_ARTICLES}/${res.result.article.slug}`)
      pushMessage('success', edit ? 'Article updated' : 'Article created')
    } else {
      pushMessage('error', edit ? 'Article failed to update' : 'Article failed to create')
    }
  }

  return (
    <div className={classes.form}>
      <form className={classes.form__main} onSubmit={handleSubmit(onSubmit)}>
        <fieldset className={classes.form__content}>
          <h1 className={classes.form__title}>{edit ? 'Edit article' : 'Create new article'}</h1>
          <label className={classes.form__item}>
            Title
            <input
              defaultValue={edit ? location.state.title : ''}
              placeholder="Title"
              className={classes.form__input}
              {...register('title', {
                required: 'Title is required',
                maxLength: {
                  value: 100,
                  message: 'Max symbols',
                },
              })}
            ></input>
            {errors?.title && <p className={classes.form__error}> {errors?.title?.message}</p>}
          </label>
          <label className={classes.form__item}>
            Short description
            <input
              defaultValue={edit ? location.state.description : ''}
              placeholder="Description"
              className={classes.form__input}
              {...register('description', {
                required: 'Short description is required',
                maxLength: {
                  value: 100,
                  message: 'Max symbols',
                },
              })}
            ></input>
            {errors?.description && <p className={classes.form__error}> {errors?.description?.message}</p>}
          </label>
          <label className={classes.form__item}>
            Text
            <textarea
              defaultValue={edit ? location.state.body : ''}
              placeholder="Text"
              className={classes.form__text}
              {...register('body', {
                required: 'Text is required',
                maxLength: {
                  value: 6000,
                  message: 'Max symbols',
                },
              })}
            ></textarea>
            {errors?.body && <p className={classes.form__error}> {errors?.body?.message}</p>}
          </label>
          <label className={`${classes.form__item} ${classes.form__tags}`}>
            Tags
            {fields.map((field, index) => (
              <div key={field.id} className={classes.form__tag}>
                <input
                  placeholder="Tag"
                  className={classes.form__taginput}
                  {...register(`tags[${index}].value`, {
                    required: 'The tag must not be empty',
                    minLength: 1,
                    maxLength: 20,
                  })}
                ></input>
                <button type="button" className={classes.form__delete} onClick={() => remove(index)}>
                  Delete
                </button>
                <button type="button" className={classes.form__add} onClick={() => append({ name: '' })}>
                  Add tag
                </button>
                {errors?.tags && <p className={classes.form__error}> {errors?.tags?.message}</p>}
              </div>
            ))}
          </label>
          {fields.length === 0 && (
            <button type="button" className={classes.form__tagButton} onClick={() => append({ name: '' })}>
              Add tag
            </button>
          )}

          <Button className={classes.form__button} loading={loading} htmlType="submit" type="primary">
            Send
          </Button>
        </fieldset>
      </form>
    </div>
  )
}

export default ArticleForm
