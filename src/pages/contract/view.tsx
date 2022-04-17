import React, { useEffect, useState } from 'react';
import {
  Container,
  CardContent,
  Card,
  Typography,
  InputBase,
  Alert,
  AlertTitle,
  Grid,
  Stack,
  Avatar,
  ListItemIcon,
  Toolbar,
  IconButton,
  Divider,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';
import { useStyles } from '../../modules/contract/ContractStyles'
import Link from 'next/link';
import { alpha } from '@mui/material';
import moment from 'moment';
import { ContentCopy } from '@mui/icons-material';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(action: string, user: string, timestamp: number) {
  return { action, user, timestamp };
}

const rows = [
  createData('Contract Created', 'bella.hughes@example.com', new Date().toDateString()),
  createData('Worker Assigned', 'bella.hughes@example.com', new Date().toDateString()),
  createData('Work Accepted', 'simon.rasmussen@example.com', new Date().toDateString()),
];

const TableToolbar = () => {
  return (
    <Toolbar
    >
      <Typography variant="h6" id="contract-history-table-title" component="div">
        Contract History
      </Typography>
    </Toolbar>
  );
};

const contractDetailsPrimaryTypographyProps = {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgb(33, 33, 33, .85',
}

const contractDetailsSecondaryTypographyProps = {
    color: '#808080',
    fontSize: 12,
}

const ViewContract: React.FunctionComponent<any> = () => {
  const classes = useStyles();
  const [isSubmittingProposal, setIsSubmittingProposal] = useState<boolean>(false);
  const [proposalContainerHeight, setProposalContainerHeight] = useState<boolean>(false);
  const [reviews, setReviews] = useState([]);
  const [contractOwnership, setContractOwnership] = useState<string>('Claimed');
  const isReferral = true;
  const renderUsers = async () => {
    const a = await fetch('https://randomuser.me/api/?results=20', {});
    const users = await a.json();
    setReviews(users.results);
    console.log(users);
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
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          paddingTop='2%'
        >
          <Grid item xs={8}>
            <Box component={Card} variant="outlined" className={classes.marginBottom}>
              <CardContent>
                <Box>
                  <>
                    <Box>
                      {contractOwnership === 'Claimed' ? null : (
                        <Typography variant="button" color="secondary">
                          This contract has never been claimed - be the first
                        </Typography>
                      )}

                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="subtitle2" fontSize={20}>
                          Looking for a web developer for long term contract
                        </Typography>

                        <Avatar src="https://randomuser.me/api/portraits/women/66.jpg" />
                      </Stack>

                      <Typography py={1} paragraph fontSize={15} color="rgb(94, 94, 94)">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sed hendrerit
                        sem. Donec nec mi sit amet nisl accumsan fringilla quis eget lectus. Quisque
                        pellentesque tortor tortor, at convallis metus ornare ac. Aenean quis
                        pellentesque nisl. Ut suscipit a nisi sed porttitor. Donec cursus velit
                        diam, non accumsan urna aliquet hendrerit.
                      </Typography>
                      <Button
                        disabled={contractOwnership === 'Claimed'}
                        color="secondary"
                        variant="contained"
                        disableElevation
                        disableRipple
                      >
                        Submit Proposal
                      </Button>
                    </Box>
                  </>
                </Box>
              </CardContent>
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
                      <TableRow
                        key={row.action}>
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
                  reviews.slice(4, 9).map((review, idx) => {
                    return (
                      <Box component={Stack} spacing={2} direction="row" my={1}>
                        <Avatar src={review.picture.large} className={classes.avatar} />
                        <Stack>
                          <Typography fontSize={13} className={classes.overline}>
                            {review.name.first + ' ' + review.name.last}
                          </Typography>
                          <Typography fontSize={14} className={classes.name}>
                            {review.login.username}
                          </Typography>
                          <Typography paragraph fontSize={14} className={classes.name}>
                            No hassle and no extra work apart from the contract description. I will
                            definitiely be looking to work with him again!
                          </Typography>
                        </Stack>
                      </Box>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={3.8}>
            <Alert
              variant="standard"
              icon={false}
              component={Card}
              className={classes.marginBottom}
            >
              <Typography fontSize={20} fontWeight="bold">
                Contract Details
              </Typography>
              <Box>
                <ListItem>
                  <ListItemText
                    primary="Creator"
                    secondary="0x19bBa405Fd0e4Da0e23230d49eFC0CbFb3664A6c"
                    primaryTypographyProps={contractDetailsPrimaryTypographyProps}
                    secondaryTypographyProps={contractDetailsSecondaryTypographyProps}
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Payout Type"
                    secondary="One Time Payment"
                    primaryTypographyProps={contractDetailsPrimaryTypographyProps}
                    secondaryTypographyProps={contractDetailsSecondaryTypographyProps}
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Budget"
                    secondary="No budget"
                    primaryTypographyProps={contractDetailsPrimaryTypographyProps}
                    secondaryTypographyProps={contractDetailsSecondaryTypographyProps}
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Deadline"
                    secondary="May 27, 2022"
                    primaryTypographyProps={contractDetailsPrimaryTypographyProps}
                    secondaryTypographyProps={contractDetailsSecondaryTypographyProps}
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Currency"
                    secondary="DAI"
                    primaryTypographyProps={contractDetailsPrimaryTypographyProps}
                    secondaryTypographyProps={contractDetailsSecondaryTypographyProps}
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Completion Terms"
                    secondary={
                      <ul>
                        <Typography className={classes.li}>
                          {' '}
                          Definition of done task number one{' '}
                        </Typography>
                        <Typography className={classes.li}>
                          This is another example of a task that requires for the job to be complete
                        </Typography>
                        <Typography className={classes.li}>
                          Finish doing task number three by that time
                        </Typography>
                      </ul>
                    }
                    primaryTypographyProps={contractDetailsPrimaryTypographyProps}
                    secondaryTypographyProps={contractDetailsSecondaryTypographyProps}
                  />
                </ListItem>
              </Box>
            </Alert>

            <Card variant="outlined" className={classes.marginBottom}>
              <CardContent>
                <Typography fontSize={20} fontWeight="bold">
                  Metadata
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
