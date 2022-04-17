import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'

import theme from '../../material_theme'
import Opportunity from '../Opportunity'
import Markets from './markets';
import Footer from '../common/components/Footer/Footer'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Markets />
    </div>
  )
}

export default Home
