import React from 'react';
import cx from 'clsx';
import {
    Card,
    CardContent, 
    CardMedia,
    Divider,
    Stack,
    Typography
} from '@mui/material'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { useStyles } from './ServiceCardStyle'

const ServiceCard = () => {
  const cardStyles = useStyles();
  return (
    <Card className={cx(cardStyles.root)}>
      <CardMedia sx={{ height: 200}}
        // component={'img'} // add this line to use <img />
       // classes={wideCardMediaStyles}
        image={
          'https://picsum.photos/200'
        }
      />
      <CardContent>
          <Typography variant='subtitle2' fontSize={18}>
          I will manage your social media account
          </Typography>

          <Typography paragraph fontSize={13}>
          I will manage your social media account
          </Typography>

      </CardContent>
      <Divider />
      <CardContent>

      </CardContent>
    </Card>
  );
}

export default ServiceCard