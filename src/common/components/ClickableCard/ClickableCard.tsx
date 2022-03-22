import * as React from 'react'
import styled from "@emotion/styled"
import {
    Card
} from '@mui/material'

const ClickableCard = styled(Card)(({ theme }) => ({
    '&:hover': {
        cursor: 'pointer',
        boxShadow:
          '0px 5px 5px -3px rgba(240, 239, 241, 0.8), 0px 8px 10px 1px rgba(240, 239, 241, 0.5),0px 3px 14px 2px rgba(240, 239, 241, 0.2)',
      },
    '& .MuiCard-root': {
      border: '1px solid #ddd',
    },
  }));

  export default ClickableCard