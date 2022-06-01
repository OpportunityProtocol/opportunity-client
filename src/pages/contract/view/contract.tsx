import React, { useEffect, useState } from 'react';
import {
  Container,
  CardContent,
  Card,
  Typography,
  Alert,
  AlertTitle,
  Grid,
  Stack,
  Avatar,
  ListItemIcon,
  Toolbar,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';
import { useStyles } from '../../../modules/contract/ContractStyles';
import {
  ContentCopy,
  Email,
  EmailOutlined,
  Favorite,
  FavoriteBorderOutlined,
} from '@mui/icons-material';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import clsx from 'clsx';

import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { timelineButtons } from '../../../modules/market/MarketConstants';
import JobDisplay from '../../../modules/market/components/JobDisplay';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

function createData(action: string, user: string, timestamp: string) {
  return { action, user, timestamp };
}

const rows = [
  createData('Contract Created', 'bella.hughes@example.com', new Date().toDateString().toString()),
  createData('Worker Assigned', 'bella.hughes@example.com', new Date().toDateString().toString()),
  createData('Work Accepted', 'simon.rasmussen@example.com', new Date().toDateString().toString()),
];

const TableToolbar = () => {
  return (
    <Toolbar>
      <Typography variant="h6" id="contract-history-table-title" component="div">
        Contract History
      </Typography>
    </Toolbar>
  );
};

const contractDetailsPrimaryTypographyProps = {
  fontSize: 14,
  fontWeight: 'medium',
  color: 'rgb(33, 33, 33, .85',
};

const contractDetailsSecondaryTypographyProps = {
  color: '#808080',
  fontSize: 12,
};

const isService = false;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
const ViewContract: React.FunctionComponent<any> = () => {
  const classes = useStyles();
  const [reviews, setReviews] = useState<any>([]);
  const isReferral = true;
  const renderUsers = async () => {
    const a = await fetch('https://randomuser.me/api/?results=20', {});
    const users = await a.json();
    setReviews(users.results);
  };

  useEffect(() => {
    renderUsers();
  }, []);

  return (
    <>
      <Container maxWidth="lg">
        {isReferral ? (
          <Alert severity="info">
            <AlertTitle>Referral</AlertTitle>
            You are viewing this contract as a part of a referral. Your referrer will receive{' '}
            <strong>5%</strong> of the total payout upon completion.
          </Alert>
        ) : null}
      </Container>
      <Container
        maxWidth="lg"
        className={classes.mainContainer}
      >
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          paddingTop="2%"
        >
          <Grid item xs={8}>
            <Box className={classes.marginBottom}>
              <JobDisplay />
            </Box>

            <Paper variant="outlined" className={classes.marginBottom}>
              <TableToolbar />
              <TableContainer>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Action</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Timestamp</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.action}>
                        <TableCell component="th" scope="row">
                          {row.action}
                        </TableCell>
                        <TableCell>{row.user}</TableCell>
                        <TableCell>{row.timestamp}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            <Card variant="outlined" className={classes.marginBottom}>
              <CardContent>
                <Typography fontWeight="bold" fontSize={20} color="rgba(33, 33, 33, .85)">
                  Reviews for this user
                </Typography>
                {reviews.length === 0 ? (
                  <Typography variant="caption">
                    No reviews has been written for this employer
                  </Typography>
                ) : (
                  reviews.slice(4, 9).map(
                    (
                      review: {
                        picture: { large: string | undefined };
                        name: { first: string; last: string };
                        login: {
                          username:
                            | boolean
                            | React.ReactChild
                            | React.ReactFragment
                            | React.ReactPortal
                            | null
                            | undefined;
                        };
                      },
                      idx: React.Key | null | undefined
                    ) => {
                      return (
                        <Box key={idx} component={Stack} spacing={2} direction="row" my={1}>
                          <Avatar src={review?.picture.large} className={classes.avatar} />
                          <Stack>
                            <Typography fontWeight='bold' fontSize={13} className={classes.overline}>
                              {review?.name.first + ' ' + review.name.last}
                            </Typography>
                            <Typography fontSize={14} fontWeight="medium" className={classes.name}>
                              {review?.login.username}
                            </Typography>
                            <Typography paragraph fontSize={14} className={classes.name}>
                              No hassle and no extra work apart from the contract description. I
                              will definitiely be looking to work with him again!
                            </Typography>
                          </Stack>
                        </Box>
                      );
                    }
                  )
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={3.8}>
            {isService ? (
              <Card variant="outlined" className={clsx(classes.marginBottom, classes.graphCard)}>
                <CardContent>
                  <Typography fontSize={20} fontWeight="bold">
                    Price over time{' '}
                    <Typography component="span" color="green">
                      + $0.50
                    </Typography>
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart width={300} height={400} data={data}>
                      <Line
                        type="monotone"
                        dataKey="pv"
                        stroke="rgb(98, 202, 161)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <Stack direction="row" alignItems="center" justifyContent="space-evenly">
                    {timelineButtons.map((buttonTitle, idx) => {
                      return (
                        <Button
                          disableElevation
                          disableRipple
                          disableFocusRipple
                          disableTouchRipple
                          variant="text"
                          color="primary"
                          size="small"
                          classes={{ text: classes.graphButton }}
                          key={idx}
                        >
                          {buttonTitle}
                        </Button>
                      );
                    })}
                  </Stack>
                </CardContent>
              </Card>
            ) : null}

            <Button
              variant="contained"
              size="large"
              sx={{ mb: 2 }}
              fullWidth
              color="primary"
              disableElevation
              disableRipple
            >
              Submit proposal
            </Button>
            <Stack direction="row" alignItems="center" spacing={1} className={classes.marginBottom}>
              <Button
                variant="outlined"
                size="large"
                fullWidth
                endIcon={<FavoriteBorderOutlined fontSize="small" />}
              >
                Save Contract
              </Button>

              <Button variant="outlined" size="large" fullWidth endIcon={<EmailOutlined />}>
                Refer a friend
              </Button>
            </Stack>

            <Alert variant="standard" icon={false} className={classes.marginBottom}>
              <Typography fontSize={20} fontWeight="bold">
                Completion Details
              </Typography>
              <Box>
                <ListItem>
                  <ListItemText
                    primary="Definition of done task number one"
                    primaryTypographyProps={contractDetailsPrimaryTypographyProps}
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="This is another example of a task that requires for the job to be complete"
                    primaryTypographyProps={contractDetailsPrimaryTypographyProps}
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Finish doing task number three by that time"
                    primaryTypographyProps={contractDetailsPrimaryTypographyProps}
                  />
                </ListItem>
              </Box>
            </Alert>

            <Card variant="outlined" className={classes.marginBottom}>
              <CardContent>
                <Typography fontSize={20} fontWeight="bold">
                  Metadata
                </Typography>
                <Typography variant='button' color='#2196F3'>
                  View on IPFS
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Market Name"
                      secondary="Gitcoin Bounties"
                      primaryTypographyProps={contractDetailsPrimaryTypographyProps}
                      secondaryTypographyProps={contractDetailsSecondaryTypographyProps}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="Metadata"
                      secondary="QmTtDqWzo179ujTXU7pf2PodLNjpcpQQCXhkiQXi6wZvKd"
                      primaryTypographyProps={contractDetailsPrimaryTypographyProps}
                      secondaryTypographyProps={{
                        color: '#808080',
                        fontSize: 12,
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                      }}
                    />
                    <ListItemIcon>
                      <IconButton>
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </ListItemIcon>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ViewContract;
