import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'

import theme from '../../material_theme'
import Opportunity from '../Opportunity'
import Markets from './explore';
import Footer from '../common/components/Footer/Footer'
import Explore from './explore';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Explore />
    </div>
  )
}

export default Home
