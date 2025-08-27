import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Navigation.module.css'
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
export default function Navigation({id="", title="",login="",username=""}) {
  // console.log(id, title, login, username);
  return (
    <nav className={styles.nav}>
        <div className={styles.logo}>
            <p className={styles.title}>{title||"Company name"}</p>
        </div>
        <ul className={styles.navList}>
            <li>
            <Link to="/" className={styles.listItem}><HomeIcon/>Home</Link>
            </li>
            <li>
            <Link to={login?`/profile/${id}`:"/login"} className={styles.listItem}>  {login?`${username}`:"Login"} <AccountCircleIcon/></Link>
            </li>
        </ul>
    </nav>
  )
}
