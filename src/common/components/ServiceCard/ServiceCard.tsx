import React from 'react';
import cx from 'clsx';
import { Card, CardContent, CardMedia, Divider, Stack, Typography } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { useStyles } from './ServiceCardStyle';

import DAIIcon from '../../../../node_modules/cryptocurrency-icons/svg/color/dai.svg';
const ServiceCard = () => {
  const cardStyles = useStyles();
  return (
    <Card className={cx(cardStyles.root)}>
      <CardMedia
        sx={{ height: 200 }}
        image={'https://picsum.photos/200'}
      />
      <CardContent>
        <Typography variant="subtitle2" fontSize={18}>
          I will manage your social media account
        </Typography>

        <Typography
          paragraph
          fontSize={15}
          color="rgb(94, 94, 94)"
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2 /* number of lines to show */,
            WebkitBoxOrient: 'vertical',
          }}
        >
          I will manage your social media account on any platform. I have over 10 years of exp
        </Typography>
      </CardContent>
      <Divider />
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography fontWeight="regular" fontSize={13} color="rgb(94, 94, 94)">
            Price:
          </Typography>
          <Typography fontSize={15}>${Math.random().toPrecision(2)}</Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography fontSize={13} color="rgb(94, 94, 94)">
            Supply:
          </Typography>
          <Typography fontSize={15}>{Math.floor(Math.random() * 5000)}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
