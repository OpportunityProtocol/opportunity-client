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
    <link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
/>
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
