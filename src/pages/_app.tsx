import '../../styles/globals.css'
import React, { useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import Opportunity from '../Opportunity'
import theme from '../../material_theme'
import { ThemeProvider } from '@mui/material/styles';
import NavigationBreadcrumbs from '../common/components/Breadcrumbs/Breadcrumbs'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }


  return (
    <React.Fragment>
    <Head>
    <title>GigEarth</title>
    <meta name="description" content="Permissionless labor markets" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
<link href="https://fonts.googleapis.com/css2?family=Chilanka&family=Manrope:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
/>
    <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/icon?family=Material+Icons"
    />
    <link rel="stylesheet" href="https://use.typekit.net/bhd6hze.css" />
  </Head>
  <ThemeProvider theme={theme}>
  <Opportunity>
    <NavigationBreadcrumbs />
    <Component {...pageProps} />
  </Opportunity> 
</ThemeProvider>
</React.Fragment>
  )

}

export default MyApp
