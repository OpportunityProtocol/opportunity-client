import React from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 304,

    width: '100%'
  },
  content: {},
  priceChip: {
    marginTop: 1,
    fontWeight: 'medium',
    padding: 0.8
  }
}));

export { useStyles }