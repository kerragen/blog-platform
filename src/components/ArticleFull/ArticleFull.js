import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Spin } from 'antd'

import Article from '../Article/Article'
import { getArticle, setArticle } from '../../store/articlesSlice'
import ErrorArticle from '../Errors/ErrorArticle'

import classes from './ArticleFull.module.scss'

const ArticleFull = () => {
  const dispatch = useDispatch()
  const { slug } = useParams()

  const article = useSelector((state) => state.articles.article)
  const articlesLoading = useSelector((state) => state.articles.articlesLoading)
  const articlesError = useSelector((state) => state.articles.articlesError)

  const token = localStorage.getItem('token')

  useEffect(() => {
    dispatch(getArticle(slug, token))
    return () => {
      dispatch(setArticle())
    }
  }, [dispatch, slug, token])
  return (
    <div className={classes.articleFull}>
      {articlesLoading && <Spin className={classes.articlesSpin} size="large" />}
      {!articlesLoading && article && (
        <Article
          author={article.author}
          title={article.title}
          tagList={article.tagList}
          body={article.body}
          created={article.createdAt}
          description={article.description}
          favorited={article.favorited}
          favoritesCount={article.favoritesCount}
          slug={article.slug}
          updatedAt={article.updatedAt}
          full={true}
        />
      )}
      {articlesError && <ErrorArticle />}
    </div>
  )
}

export default ArticleFull
