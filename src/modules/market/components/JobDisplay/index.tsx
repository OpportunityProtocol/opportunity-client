/**
 * @title JobDisplay
 * @author Elijah Hampton
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useStyles } from './JobDisplayStyles';

import {
  Box,
  Avatar,
  Button,
  Chip,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
} from '@mui/material';

import { AccessTime } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { IJobDisplayProps } from '../../MarketInterface';
import { useGradientAvatarStyles } from '@mui-treasury/styles/avatar/gradient';

/*******  Temporary Placeholders Start *******/
const TAGS = ['Language', 'Translation', 'Spanish'];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomJobTitles = [
  'Spanish-English Interpreter Needed for Several Meetings',
  'Business Manager',
  'Software Engineer',
  'HR Administrator',
  'Web Developer',
  'Audio Engineer',
  'Graphic Designer'
]

const randomJobDescriptions = [
  'I am an English speaker and I am going to be holding several interviews with Spanish speakers in June and July. Each meeting will take place on Zoom. I am hoping to hire an interpreter who can translate the conversation both in English to Spanish and in Spanish to English using the Chat feature on Zoom or verbally. The total number of hours is unknown at this point (it depends on how many people agree to be interviewed). I am estimating this project will take no more than 6 hours total.',
  'The Business Manager is responsible for the day-to-day management of the business. This includes overseeing all aspects of the business, including sales and marketing, customer service, finance and accounting, operations, legal, and compliance. The Business Manager is responsible for ensuring that the company meets its revenue and profitability goals.',
'The Software Engineer is responsible for designing and developing software systems. This includes developing and maintaining the code that keeps a product running and ensuring that its scalable, modular, and maintainable.',
'The HR Administrator is responsible for providing administrative support in the human resources department. This includes answering phones, typing correspondence, scheduling meetings, and processing routine HR tasks.',
'The Web Developer will work closely with the Marketing and Communications team to maintain and update the companys website, social media channels, and other digital properties.',
'The Audio Engineer is responsible for the recording, mixing, and mastering of audio content. This includes working with artists to create a vision for the sound of their music, and then translating that vision into a final product. The Audio Engineer also works with producers to ensure that the final product is delivered on time and within budget.',
'The Graphic Designer is responsible for designing and creating graphics for the company. This includes logos, brochures, advertisements, and other marketing materials.']
/*******  Temporary Placeholders End *******/

const JobDisplay: React.FunctionComponent<IJobDisplayProps> = ({
  avatar = '',
  suggestion = false,
}) => {
  const classes = useStyles();
  const router = useRouter();
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

  const randomInt = 0//getRandomInt(0, randomJobTitles.length - 1)

  return (
    <Card
      square
      onClick={() => router.push('/contract/view/contract')}
      key={Math.random()}
      className={classes.card}
      variant="outlined"
    >
      <CardContent>
        <Grid pb={3} container alignItems="center" flexWrap="nowrap" direction="row">
          <Grid item pr={2}>
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
                        style={{ width: 55, height: 55 }}
                      />
                    </div>
          </Grid>

          <Grid container item flexGrow={1}>
            <Grid container item alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography fontWeight='600'>{randomJobTitles[randomInt]}</Typography>
              </Grid>

              <Grid item fontWeight="medium" fontSize={15} color='text.secondary'>
              {Math.floor(Math.random() * 5000).toFixed(2)} DAI
              </Grid>
            </Grid>

            <Grid container item alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography fontSize={13} fontWeight="bold" color={(theme) => theme.palette.primary.main}>
                  @janicecoleman007
                </Typography>
              </Grid>

              <Grid item>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <AccessTime fontSize="small" />
                  <Typography fontWeight="medium" color="text.secondary" fontSize={13}>
                    Short Term
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box
        component={Typography}
          paragraph
          color="rgb(94, 94, 94)"
          fontSize={13}
          fontWeight="medium"
          sx={{
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            textOverflow: 'ellipsis',
          }}
        >
          {randomJobDescriptions[randomInt]}
        </Box>

        <Grid
        py={2}
          container
          direction="row"
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start"
        >
          {TAGS.map((tag) => {
            return (
              <Grid item mr={1}>
                <Chip variant="filled" sx={{ fontSize: 12, padding: 1, backgroundColor: '#eee' }} label={tag} size="small" />
              </Grid>
            );
          })}
        </Grid>

        <Grid container item direction="row" alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography color="text.secondary" fontSize={14}>
              August 1, 2022 - 1:59 PM
            </Typography>
          </Grid>

          <Grid item>
            <Button variant="contained" size="large">
              View Details
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

JobDisplay.propTypes = {
  avatar: PropTypes.string,
  suggestion: PropTypes.bool.isRequired,
};

export default JobDisplay;
