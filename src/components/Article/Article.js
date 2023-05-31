import { Link, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { useContext, useState } from 'react'
import { Button, Popconfirm } from 'antd'

import { MessageContext } from '../Layout/Layout'
import BlogData from '../../services/blog-data'
import { PATH_HOME_PAGE, PATH_SIGN_IN, PATH_ARTICLES, PATH_EDIT_ARTICLE } from '../../path/path'

import classes from './Article.module.scss'
import Like from './Like'

const Article = ({ title, author, tagList, body, description, favorited, favoritesCount, slug, updatedAt, full }) => {
  const [likes, setLikes] = useState(favoritesCount)
  const [liked, setLiked] = useState(favorited)
  const [avatarError, setAvatarError] = useState(false)
  const handleAvatarError = () => {
    setAvatarError(true)
  }

  const blogData = new BlogData()
  const navigate = useNavigate()
  const { pushMessage } = useContext(MessageContext)

  const username = useSelector((state) => state.user.username)
  const token = useSelector((state) => state.user.token)

  const tags = [...new Set(tagList)].slice(0, 9).map((tag) => {
    if (tag.trim() === '') {
      return null
    }
    if (tag.length > 20) {
      return null
    }
    return (
      <li key={tag} className={full ? classes.article__tagFull : classes.article__tag}>
        {tag}
      </li>
    )
  })

  const deleteArticle = async () => {
    const res = await blogData.deleteArticle(token, slug)
    if (res.ok) {
      navigate(PATH_HOME_PAGE, { replace: true })
      pushMessage('success', 'Article was deleted')
    } else {
      pushMessage('error', 'Fail to delete article')
    }
  }

  const toggleFavorite = async () => {
    if (liked) {
      const res = await blogData.unfavoriteArticle(token, slug)
      if (res.ok) {
        setLiked(res.result.article.favorited)
        setLikes(res.result.article.favoritesCount)
      } else {
        pushMessage('error', 'Failed to like')
      }
      console.log(res)
    } else if (!liked) {
      const res = await blogData.favoriteArticle(token, slug)
      if (res.ok) {
        setLiked(res.result.article.favorited)
        setLikes(res.result.article.favoritesCount)
      } else {
        pushMessage('error', 'Failed to like')
      }
      console.log(res)
    }
  }

  const onFavoriteClick = () => {
    if (token) {
      toggleFavorite()
    } else {
      navigate(PATH_SIGN_IN)
      pushMessage('info', 'You must be logged in for this action')
    }
  }

  const DeleteButton = () => {
    return (
      <Popconfirm title="Are you sure to delete this article?" okText="Yes" cancelText="No" onConfirm={deleteArticle}>
        <Button className={classes.article__delete} danger>
          Delete
        </Button>
      </Popconfirm>
    )
  }
  return (
    <div className={full ? classes.articleFull : classes.article}>
      <div className={classes.article__header}>
        <div>
          {full ? (
            <span className={classes.article__title}>{title}</span>
          ) : (
            <Link className={classes.article__title} to={`${PATH_ARTICLES}/${slug}`}>
              {title}
            </Link>
          )}
          <span className={classes.article__likes}>
            <button onClick={onFavoriteClick} className={classes.article__like}>
              <Like liked={liked} />
            </button>
            {likes}
          </span>
          <ul className={classes.article__tags}>{tags}</ul>
        </div>
        <div>
          <div className={classes.article__info}>
            <span>
              <p className={classes.article__user}>{author.username}</p>
              <p className={classes.article__date}>{format(new Date(updatedAt), 'MMMM dd, yyyy')}</p>
            </span>
            <div className={classes.article__avatar}>
              {avatarError ? (
                <img
                  className={classes.article__img}
                  src="https://static.productionready.io/images/smiley-cyrus.jpg"
                  alt="Аватар"
                ></img>
              ) : (
                <img className={classes.article__img} onError={handleAvatarError} src={author.image} alt="Аватар"></img>
              )}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', columnGap: '12px', alignItems: 'center', marginTop: '4px' }}>
        <p className={full ? classes.article__dark : classes.article__text}>{description}</p>
        {full && username === author.username && <DeleteButton />}
        {full && username === author.username && (
          <Link
            className={classes.article__edit}
            to={`${PATH_ARTICLES}/${slug}${PATH_EDIT_ARTICLE}`}
            state={{ body, description, tagList, title, slug }}
          >
            Edit
          </Link>
        )}
      </div>

      {full && <ReactMarkdown className={classes.article__body}>{body}</ReactMarkdown>}
    </div>
  )
}

export default Article
