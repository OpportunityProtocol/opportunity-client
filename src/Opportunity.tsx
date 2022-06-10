import React from 'react';

import {
  Box,
} from '@mui/material';

import  { useRouter } from 'next/router';

import {
  IOpportunityProps,
} from './OpportunityInterfaces';
import NavigationBar from './common/components/NavigationBar/NavigationBar';

const Opportunity: React.FunctionComponent<IOpportunityProps> = ({ children }) => {
  const router = useRouter();

  const APP_BACKGROUND = '#f8f8f8'

  const isPadded =
    router.pathname === '/jobs' ||
    router.pathname === '/profile' ||
    router.pathname === '/contract/view/contract' ||
    router.pathname === '/contract/view/service' ||
    router.pathname === '/' ||
    router.pathname === '/markets' ||
    router.pathname === '/contract' 


  return (
    <Box sx={{ display: 'flex', bgcolor: APP_BACKGROUND }}>
      <NavigationBar />
      <Box
        component="main"
        sx={{
          bgcolor: APP_BACKGROUND,
          flexGrow: 1,
          paddingTop: isPadded ? '60px' : '0px',
        }}>
        {children}
      </Box>
    </Box>
  );
};

export default Opportunity;
