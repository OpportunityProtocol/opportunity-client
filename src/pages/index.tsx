import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'

import theme from '../../material_theme'
import Opportunity from '../Opportunity'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Opportunity</title>
        <meta name="description" content="Permissionless labor markets" />
        <link rel="icon" href="/favicon.ico" />
        <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <Opportunity />
      </ThemeProvider>
    </div>
  )
}

export default Home
