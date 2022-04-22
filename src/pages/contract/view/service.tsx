import React, { useEffect, useState } from 'react';
import {
  Container,
  CardContent,
  Typography,
  Alert,
  AlertTitle,
  Stack,
  Toolbar,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
} from '@mui/material';
import { useStyles } from '../../../modules/contract/ContractStyles';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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

interface IDeliverable {
  type: string;
  brief: string;
  deliverables: Array<string>;
  price: number;
  estimatedTimeCompletion: string;
}

const tempDeliverables: Array<IDeliverable> = [
  {
    type: 'Standard',
    brief: 'Up to 5 pages, color branding, contact form, social media integration, stock images',
    deliverables: [
      'Functional Website',
      '5 Pages',
      'Design Customization',
      'Content Upload',
      'Responsive Design',
    ],
    price: 59.99,
    estimatedTimeCompletion: '20 days',
  },
  {
    type: 'Premium',
    brief: 'Basic + 3 more pages, SEO, SPEED and 2 weeks support after completion of project',
    deliverables: [
      'Functional Website',
      '5 Pages',
      'Design Customization',
      'Content Upload',
      'Responsive Design',
    ],
    price: 89.99,
    estimatedTimeCompletion: '40 days',
  },
  {
    type: 'Business',
    brief:
      '10 pages + e-commerce with 10 products and you can add unlimited more + 1 month free support',
    deliverables: [
      'Functional Website',
      '5 Pages',
      'Design Customization',
      'Content Upload',
      'Responsive Design',
    ],
    price: 119.99,
    estimatedTimeCompletion: '60 days',
  },
];
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
const ViewContract: React.FunctionComponent<any> = () => {
  const classes = useStyles();
  const [reviews, setReviews] = useState<any>([]);
  const [contractOwnership, setContractOwnership] = useState<string>('Claimed');
  const [deliverables, setDeliverables] = useState<Array<IDeliverable>>(tempDeliverables);
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
      <Container
        maxWidth="lg"
        component={Paper}
        elevation={0}
        variant="outlined"
        className={classes.mainContainer}
      >
        <CardContent component={Stack} spacing={3}>
          <Typography fontSize={25} fontWeight="bold">
            I will create a professional website for you
          </Typography>

          <Divider />

          <Box>
            <Box>
              <Typography variant="h6">Description</Typography>
              <Typography paragraph fontSize={14}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec urna ut sem
                tempus sollicitudin vitae quis odio. Morbi ut velit rhoncus, mattis tellus sed,
                faucibus urna. Donec condimentum posuere massa, quis consequat sem laoreet sit amet.
                In fermentum turpis in hendrerit auctor. Phasellus vitae aliquet urna. Nunc congue
                placerat arcu in iaculis. Praesent pulvinar odio quis mauris tristique pellentesque.
                In ac lacinia purus. Donec eget nisl mollis, convallis nulla id, pulvinar dui. Fusce
                rutrum enim vitae dolor commodo cursus. Vestibulum blandit cursus felis sed
                malesuada. Donec nec felis eget magna molestie laoreet ac eu magna. Etiam blandit
                placerat sapien, ut efficitur tellus convallis id. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Phasellus posuere enim tristique, faucibus ipsum eget,
                interdum nisi.
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Box>
            <Typography variant="h6">Process and Timeline</Typography>
            <Typography paragraph fontSize={14}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec urna ut sem tempus
              sollicitudin vitae quis odio. Morbi ut velit rhoncus, mattis tellus sed, faucibus
              urna. Donec condimentum posuere massa, quis consequat sem laoreet sit amet. In
              fermentum turpis in hendrerit auctor. Phasellus vitae aliquet urna. Nunc congue
              placerat arcu in iaculis. Praesent pulvinar odio quis mauris tristique pellentesque.
              In ac lacinia purus. Donec eget nisl mollis, convallis nulla id, pulvinar dui. Fusce
              rutrum enim vitae dolor commodo cursus. Vestibulum blandit cursus felis sed malesuada.
              Donec nec felis eget magna molestie laoreet ac eu magna. Etiam blandit placerat
              sapien, ut efficitur tellus convallis id. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Phasellus posuere enim tristique, faucibus ipsum eget, interdum nisi.
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Box>
              <Typography variant="h6">Deliverables and Pricing</Typography>
              <Typography color="#424242">
                Blank has specified the client must pay 50% up front
              </Typography>
            </Box>

            <Box>
              <TableContainer style={{ width: '100%' }}>
                <Table
                  component="table"
                  style={{ borderCollapse: 'separate', borderSpacing: '0px 10px' }}
                  width="100%"
                >
                  <TableBody style={{ width: '100%' }}>
                    <TableRow component="tr">
                      <TableCell
                        style={{ borderBottomWidth: 0, borderBottom: 'none' }}
                        component="th"
                        scope="row"
                        align="left"
                      >
                        Name
                      </TableCell>
                      <TableCell
                        style={{ borderBottomWidth: 0, borderBottom: 'none' }}
                        component="th"
                        scope="row"
                        align="left"
                      >
                        Group/Kind
                      </TableCell>
                      <TableCell
                        style={{ borderBottomWidth: 0, borderBottom: 'none' }}
                        component="th"
                        scope="row"
                        align="left"
                      >
                        Namespace
                      </TableCell>
                      <TableCell
                        style={{ borderBottomWidth: 0, borderBottom: 'none' }}
                        component="th"
                        scope="row"
                        align="left"
                      >
                        Status
                      </TableCell>
                      <TableCell
                        style={{ borderBottomWidth: 0, borderBottom: 'none' }}
                        component="th"
                        scope="row"
                        align="right"
                      >
                        {' '}
                      </TableCell>
                    </TableRow>

                    {deliverables.map((deliverable, idx, arr) => (
                      <TableRow component="tr" key={idx} className={classes.tableRow}>
                        <TableCell
                          style={{
                            borderTopLeftRadius: 4,
                            borderBottomLeftRadius: 4,
                            borderBottomWidth: 0,
                            borderBottom: 'none',
                          }}
                          component="th"
                          scope="row"
                          align="left"
                        >
                          <Typography fontWeight="medium">{deliverable.type}</Typography>
                        </TableCell>

                        <TableCell
                          style={{ width: 480, borderBottomWidth: 0, borderBottom: 'none' }}
                          component="th"
                          scope="row"
                          align="left"
                        >
                          <Typography color="#757575">{deliverable.brief}</Typography>
                        </TableCell>

                        <TableCell
                          style={{ borderBottomWidth: 0, borderBottom: 'none' }}
                          component="th"
                          scope="row"
                          align="left"
                        >
                          <List>
                            {deliverable.deliverables.map((item) => {
                              return (
                                <ListItem className={classes.deliverableItem}>
                                  <ListItemText primary={item} />
                                </ListItem>
                              );
                            })}
                          </List>
                        </TableCell>

                        <TableCell
                          style={{ borderBottomWidth: 0, borderBottom: 'none' }}
                          component="th"
                          scope="row"
                          align="left"
                        >
                          <Stack direction="row" alignItems="center" spacing={0.3}>
                            <img src="/assets/images/dai.svg" style={{ width: 15, height: 20 }} />
                            <Typography>{deliverable.price}</Typography>
                          </Stack>
                        </TableCell>

                        <TableCell
                          style={{
                            borderTopRightRadius: 4,
                            borderBottomRightRadius: 4,
                            borderBottomWidth: 0,
                            borderBottom: 'none',
                          }}
                          component="th"
                          scope="row"
                          align="right"
                        >
                          <Button
                            disableElevation
                            disableRipple
                            size="small"
                            color="secondary"
                            variant="contained"
                          >
                            Purchase
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
          <Divider />
          <Box>
            <Typography variant="h6">Termination Clause</Typography>
            <Typography paragraph fontSize={14}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec urna ut sem tempus
              sollicitudin vitae quis odio. Morbi ut velit rhoncus, mattis tellus sed, faucibus
              urna. Donec condimentum posuere massa, quis consequat sem laoreet sit amet. In
              fermentum turpis in hendrerit auctor. Phasellus vitae aliquet urna. Nunc congue
              placerat arcu in iaculis. Praesent pulvinar odio quis mauris tristique pellentesque.
              In ac lacinia purus. Donec eget nisl mollis, convallis nulla id, pulvinar dui. Fusce
              rutrum enim vitae dolor commodo cursus. Vestibulum blandit cursus felis sed malesuada.
              Donec nec felis eget magna molestie laoreet ac eu magna. Etiam blandit placerat
              sapien, ut efficitur tellus convallis id. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Phasellus posuere enim tristique, faucibus ipsum eget, interdum nisi.
            </Typography>
          </Box>
        </CardContent>
      </Container>
    </>
  );
};

export default ViewContract;
