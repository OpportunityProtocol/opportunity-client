import React from 'react';

import {
  alpha,
  Box,
} from '@mui/material';

import  { NextRouter, useRouter } from 'next/router';

import {
  IOpportunityProps,
} from './OpportunityInterfaces';
import NavigationBar from './common/components/NavigationBar/NavigationBar';
import MarketToolbar from './modules/market/components/MarketToolbar';
import Footer from './common/components/Footer';

const Opportunity: React.FC<IOpportunityProps> = ({ children }) => {
  const router: NextRouter = useRouter();

  const APP_BACKGROUND: string = '#fafafa'

  const isPadded: boolean =
    router.pathname === '/jobs' ||
    router.pathname === '/profile' ||
    router.pathname === '/contract/view/contract' ||
    router.pathname === '/contract/view/service' ||
    router.pathname === '/' ||
    router.pathname === '/markets' ||
    router.pathname === '/contract' ||
    router.pathname.includes('/view/contract') ||
    router.pathname.includes('/view/service')

  return (
  
      <Box
        component="main"
        sx={{
          bgcolor: APP_BACKGROUND,
          flexGrow: 1,
          paddingTop: isPadded ? '90px' : '0px',
        }}>
        {children}
        <Footer />
      </Box>

 
  );
};

export default Opportunity;
