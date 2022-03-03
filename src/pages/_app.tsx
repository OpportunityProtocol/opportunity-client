import '../../styles/globals.css'
import type { AppProps } from 'next/app'
import Opportunity from '../Opportunity'
import theme from '../../material_theme'
import { ThemeProvider } from '@mui/material/styles';
import MarketToolbar from '../modules/market/components/MarketToolbar';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Opportunity>
        <Component {...pageProps} />
      </Opportunity> 
  </ThemeProvider>
  )
}

export default MyApp
