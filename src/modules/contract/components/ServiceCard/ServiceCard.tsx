import React, { useEffect, useState } from 'react';
import cx from 'clsx';
import {
  Card,
  Avatar,
  CardContent,
  CardMedia,
  Button,
  Box,
  CardActions,
  Divider,
  Stack,
  Typography,
  Chip,
} from '@mui/material';
import { useStyles } from './ServiceCardStyle';
import DAIIcon from '../../../../node_modules/cryptocurrency-icons/svg/color/dai.svg';
import { useRouter } from 'next/router';
import { useGradientAvatarStyles } from '@mui-treasury/styles/avatar/gradient';

interface IServiceCardProps {
  name: string;
  headerSrc: string;
  avatarSrc: string;
}

const ServiceCard = ({ name, avatarSrc = '', headerSrc = '' }: IServiceCardProps) => {
  const cardStyles = useStyles();
  const router = useRouter()
  const classes = useStyles()
  const [user, setUser] = useState([])

  const renderUsers = async () => {
    const a = await fetch('https://randomuser.me/api/?results=1', {});
    const users = await a.json();
    setUser(users.results)
  };

  useEffect(() => {
    renderUsers()
  }, [])

  const styles: ClassNameMap<GradientAvatarClassKey> = useGradientAvatarStyles({
    size: 50,
    gap: 3,
    thickness: 3,
    gapColor: '#f4f7fa',
    color: 'linear-gradient(to bottom right, #feac5e, #c779d0, #4bc0c8)',
  });

  return (
    <Card variant="outlined" className={cx(cardStyles.root)}>
      <CardMedia sx={{ height: 200 }} component='img' src="https://picsum.photos/200" />
      <CardContent>
        <Box display='flex' alignItems='flex-start' justifyContent='space-between'>
        <Stack direction="row" alignItems="center" spacing={1}>
        <div
                      style={{
                        margin: '5px 0px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                      className={styles.root}
                    >
                      <Avatar
                      src={user[0]?.picture?.thumbnail}
                        style={{ width: 30, height: 30 }}
                      />
                    </div>

          <Typography variant="subtitle2">{name}</Typography>
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

        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography fontWeight="medium" fontSize={13} color="rgb(94, 94, 94)">
            Price: 
          </Typography>
          
          <Stack direction='row' alignItems='center' spacing={0.5}>
          <img src='/assets/images/dai.svg' style={{ width: 15, height: 20 }} />
          <Typography fontSize={13}>{Math.random().toPrecision(2)} </Typography>
         
          </Stack>
          </Stack>
      </CardContent>
      <CardActions>
        <Button fullWidth variant="outlined" onClick={() => router.push('/contract/view/service')}>
          See service
        </Button>
      </CardActions>
    </Card>
  );
};

export default ServiceCard;
