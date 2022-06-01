import React, { FunctionComponent, MouseEventHandler } from 'react'

import {
    Paper,
    Box,
    Popover,
    InputBase,
    Grid,
    Badge,
    Avatar,
    Button,
    AppBar,
    Toolbar,
    Typography,
    Divider
  } from '@mui/material';
  
import { styled } from '@mui/material/styles';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }));

  interface IConnectedAvatar {
    onClick: MouseEventHandler<HTMLDivElement>,
    onMouseOver: MouseEventHandler<HTMLDivElement>
  }

  
  const ConnectedAvatar : FunctionComponent<IConnectedAvatar> = ({ onClick, onMouseOver, onMouseLeave }) => {
    return (
      <StyledBadge
        onClick={onClick}
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
      >
        <Avatar onMouseOver={onMouseOver} onMouseOut={onMouseLeave} sx={{ cursor: 'pointer' }} alt="Remy Sharp" src="/assets/stock/profile_three.jpeg" />
      </StyledBadge>
    );
  };

  export default ConnectedAvatar