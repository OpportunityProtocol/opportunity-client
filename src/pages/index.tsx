import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'

import theme from '../../material_theme'
import Opportunity from '../Opportunity'
import Markets from './markets';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>GigEarth</title>
        <meta name="description" content="Permissionless labor markets" />
        <link rel="icon" href="/favicon.ico" />
        <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet" />
      </Head>
      <Markets />
    </div>
  )
}

export default Home
