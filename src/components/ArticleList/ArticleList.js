import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Pagination, Spin } from 'antd'

import Article from '../Article/Article'
import { getArticles, setArticleList } from '../../store/articlesSlice'
import ErrorArticle from '../Errors/ErrorArticle'

import classes from './ArticleList.module.scss'

const ArticleList = () => {
  const [page, setPage] = useState(1)
  const dispatch = useDispatch()
  const articles = useSelector((state) => state.articles.articles)
  const articlesCount = useSelector((state) => state.articles.articlesCount)
  const articlesLoading = useSelector((state) => state.articles.articlesLoading)
  const articlesError = useSelector((state) => state.articles.articlesError)
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (page !== 1) {
      dispatch(getArticles({ page: (page - 1) * 5, token: token }))
    } else {
      dispatch(getArticles({ page: page - 1, token: token }))
    }
    return () => {
      dispatch(setArticleList())
    }
  }, [dispatch, page, token])

  const els = articles.map((article) => {
    return (
      <li key={article.slug}>
        <Article
          author={article.author}
          title={article.title}
          tagList={article.tagList}
          body={article.body}
          created={article.createdAt}
          updatedAt={article.updatedAt}
          description={article.description}
          favorited={article.favorited}
          favoritesCount={article.favoritesCount}
          slug={article.slug}
          updated={article.updated}
          full={false}
        />
      </li>
    )
  })
  return (
    <div className={classes.articlesContainer}>
      <ul className={classes.articles}>
        {articlesLoading && <Spin className={classes.articlesSpin} size="large" />}
        {!articlesLoading && !articlesError && els}
        {articlesError && <ErrorArticle />}
      </ul>
      {!articlesLoading && !articlesError && articles.length !== 0 && (
        <Pagination
          current={page}
          onChange={(num) => setPage(num)}
          defaultPageSize={5}
          total={articlesCount - 5}
          showSizeChanger={false}
        />
      )}
    </div>
  )
}

export default ArticleList
