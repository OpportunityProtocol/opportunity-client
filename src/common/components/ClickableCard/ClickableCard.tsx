import * as React from 'react'
import styled from "@emotion/styled"
import {
    Card
} from '@mui/material'

const ClickableCard = styled(Card)(({ theme }) => ({
    '&:hover': {
        cursor: 'pointer',
        boxShadow: '0px 6px 6px -3px #ccc, 0px 10px 14px 1px #ccc, 0px 4px 18px 3px #ccc',
      },
    '& .MuiCard-root': {
      border: '1px solid #eee',
    },
  }));

  export default ClickableCard