import React from 'react';
import cx from 'clsx';
import {
  Card,
  Avatar,
  CardContent,
  CardMedia,
  Button,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { useStyles } from './ServiceCardStyle';
import DAIIcon from '../../../../node_modules/cryptocurrency-icons/svg/color/dai.svg';
import { CardActions } from '@material-ui/core';
import { useRouter } from 'next/router';

interface IServiceCardProps {
  name: string;
  headerSrc: string;
  avatarSrc: string;
}

const ServiceCard = ({ name, avatarSrc = '', headerSrc = '' }: IServiceCardProps) => {
  const cardStyles = useStyles();
  const router = useRouter()
  
  return (
    <Card variant="outlined" className={cx(cardStyles.root)}>
      <CardMedia sx={{ height: 200 }} image={headerSrc} />
      <CardContent>
        <Box display='flex' alignItems='flex-start' justifyContent='space-between'>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar src={avatarSrc} style={{ width: 30, height: 30 }} />

          <Typography variant="subtitle2">{name}</Typography>
        </Stack>

        <Stack direction="column" alignItems="flex-start">
          <Typography fontWeight="regular" fontSize={13} color="rgb(94, 94, 94)">
            Price
          </Typography>
          
          <Stack direction='row' alignItems='center' spacing={0.5}>
          <img src='/assets/images/dai.svg' style={{ width: 15, height: 20 }} />
          <Typography fontSize={15}>{Math.random().toPrecision(2)} </Typography>
         
          </Stack>
          </Stack>
        </Box>


        <Typography
          paragraph
          fontWeight='medium'
          fontSize={14}
          color="#616161"
          style={{
            paddingTop: '10px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical',
          }}
        >
          I will manage your social media account on any platform. I have over 10 years of exp
        </Typography>

        <Typography variant="caption">Collected by 20 people in your network</Typography>
      </CardContent>
      <CardActions>
        <Button fullWidth color="secondary" variant="outlined" onClick={() => router.push('/contract')}>
          See service
        </Button>
      </CardActions>
    </Card>
  );
};

export default ServiceCard;
