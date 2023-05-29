import { Link, useNavigate } from "react-router-dom"
import classes from './Header.module.scss'
import { logOut } from "../../store/userSlice"
import { useDispatch, useSelector } from "react-redux"
import { MessageContext } from "../Layout/Layout"
import { useContext } from "react"


const Header = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const image = useSelector(state => state.user.image)
    const username = useSelector(state => state.user.username)
    const isAuth = useSelector(state => state.user.isAuth)
    
    const { pushMessage } = useContext(MessageContext)

    const onLogout = () => {
        localStorage.removeItem('token')
        dispatch(logOut())
        navigate('/', {replace: true})
        pushMessage('success', 'Logged out')
    }

    return (
        <header className={classes.header}>
            <Link className={classes.header__title} to='articles'>Realworld Blog</Link>
            {isAuth === false && <Link className={classes.header__signin} to='/sign-in'>Sign In</Link>}
            {isAuth === false && <Link className={classes.header__signup} to='/sign-up'>Sign Up</Link>}
            {isAuth && <Link className={classes.header__create} to='/new-article'>Create article</Link>}
            {isAuth && 
            <Link className={classes.header__link} to='/profile'>
                <div className={classes.header__user}>
                    <p className={classes.header__username}>{username}</p>
                    <img className={classes.header__avatar} src={image} alt="avatar"></img>
                </div>
            </Link>
            }

            {isAuth && <button onClick={onLogout} className={classes.header__logout}>Log out</button>}

        </header>
    )
}

export default Header