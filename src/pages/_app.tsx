import '../../styles/globals.css'
import React, { useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import Opportunity from '../Opportunity'
import theme from '../../material_theme'
import { ThemeProvider } from '@mui/material/styles';
import MarketToolbar from '../modules/market/components/MarketToolbar';
import Footer from '../common/components/Footer/Footer';
import NavigationBreadcrumbs from '../common/components/Breadcrumbs/Breadcrumbs'

function MyApp({ Component, pageProps }: AppProps) {
  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }


  return (
  <ThemeProvider theme={theme}>
  <Opportunity>
    <NavigationBreadcrumbs />
    <Component {...pageProps} />
  </Opportunity> 
</ThemeProvider>
  )

}

export default MyApp
