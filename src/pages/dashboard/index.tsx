import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { useStyles } from './DashboardStyles'
import { alpha } from "@mui/system";
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

import {
    Box,
    Typography,
    Paper,
    IconButton,
    Pagination,
    Card,
    Chip,
    Grid,
    Divider,
    Button,
    Tabs,
    Tab,
    Stack,
    InputBase,
} from '@mui/material'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowDropUp, Article, AttachMoney, PriceCheck } from '@mui/icons-material';
import MarketDisplay from '../../modules/market/components/MarketDisplay';
import UiTableView from '../../common/components/UITableView/UITableView';
  import { HeadCell, Data } from '../../common/interface'


  const myContractsHeadCells: HeadCell[] = [
    {
      id: 'title',
      numeric: false,
      disablePadding: true,
      label: 'Title',
    },
    {
      id: 'description',
      numeric: false,
      disablePadding: false,
      label: 'Description',
    },
    {
      id: 'link',
      numeric: false,
      disablePadding: false,
      label: 'Metadata Link',
    },
    {
      id: 'assignee',
      numeric: false,
      disablePadding: false,
      label: 'Assignee',
    },
    {
        id: 'deadline',
        numeric: true,
        disablePadding: false,
        label: 'Deadline',
      },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
      },
  ];
  
  const myJobsHeadCells: HeadCell[] = [
    {
      id: 'title',
      numeric: false,
      disablePadding: true,
      label: 'Title',
    },
    {
      id: 'description',
      numeric: false,
      disablePadding: false,
      label: 'Description',
    },
    {
      id: 'link',
      numeric: false,
      disablePadding: false,
      label: 'Metadata Link',
    },
    {
      id: 'employer',
      numeric: false,
      disablePadding: false,
      label: 'Employer',
    },
    {
        id: 'deadline',
        numeric: true,
        disablePadding: false,
        label: 'Deadline',
      },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
      },
  ];

  const myContractsRows: Array<object> = [{
    title: 'hi',
    description: 'dfsdfs',
    link: 'sdfsdf',
    employer: 'dsfsdfsd',
    deadline: 'sdfsdfsdf',
    status: 'COMPLETE'
  }]
  const myJobsRows: Array<object>  = []

const Dashboard: React.FunctionComponent = () => {
  const [contractPage, setContractPage] = useState<number>(0)
  const [contractRowsPerPage, setContractRowsPerPage] = useState<number>(5)
  const [jobsPage, setJobsPage] = useState<number>(0)
  const [jobsRowsPerPage, setJobsRowsPerPage] = useState<number>(5)

  const handleContractsChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setContractPage(newPage);
  };

  const handleContractsChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setContractRowsPerPage(parseInt(event.target.value, 10));
    setContractPage(0);
  };

  const handleJobsChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setJobsPage(newPage);
  };

  const handleJobsChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setJobsRowsPerPage(parseInt(event.target.value, 10));
    setJobsPage(0);
  };

    const classes = useStyles()

    return (
        <Box className={classes.root}>
          
    <Box component={Paper} square elevation={0} variant='outlined' sx={{ bgcolor: '#fff', width: '100%',  height: 'auto', padding: 2}}>
    <Typography fontWeight='bold' pb={1}>
                            Frequently Visited Markets
                        </Typography>
        {/*<Grid container>
            <Grid item xs={3}>
                <MarketDisplay market={'Writing & Translation'} isShowingStats={false} />
            </Grid>
</Grid>*/}
<Typography variant='caption' color='rgb(54, 119, 74)'>
    You haven't participated in any markets lately
</Typography>
    </Box>

<Box sx={{padding: '1% 1%'}}>

    <Box component={Typography} fontWeight='bold' variant='h6'>
      Dashboard Overview
    </Box>
    <Box component={Grid} container spacing={2} direction='row' alignItems='flex-start' flexWrap='nowrap' sx={{width: '100%', height: '100%'}}>

                        <Grid container item xs={6} direction='column' flexDirection='column'>
                            <Grid container item  direction='row' alignItems='center' sx={{ width: '100%',  my: 2 }}>
                            <Card xs={3} component={Grid} variant='outlined' item  sx={{ bgcolor: 'rgb(147, 228, 178)', mr: 2, p: 2, display: 'flex', flexDirection: 'column', height: 135,  }}>
                      <Box>
                        <Stack direction='row' alignItems='center'>
                        <AttachMoney fontSize='small' sx={{ color: '#fff' }} />
                        <Typography fontWeight='bold' color='#fff' fontSize={12}>
                            Your Total Profit
                        </Typography>
                        </Stack>

                        </Box>

                        <Typography py={1} fontWeight='bold' color='#fff' fontSize={30}>
                        ${Math.floor(Math.random() * 10000).toFixed(2)}
                        </Typography>

                        <Typography fontSize={12} fontWeight='medium' color='#fff'>
                                <Stack alignItems='center' spacing={2} direction='row'>
                                    <>
                                    12% (month)
                                    </>
                                    <>
                                    <ArrowDropUp color='secondary' fontSize='small' />
                                    </>
                                </Stack>
                              
                            </Typography>
                        </Card>

                        <Card xs={3}  component={Grid} variant='outlined' item  sx={{ p: 2,mr: 2, display: 'flex', flexDirection: 'column', height: 'auto', height: 135,  }}>
                      <Box>
                   
                        <Stack direction='row' alignItems='center'>
                        <PriceCheck fontSize='small' sx={{ color: alpha('#42c976', 0.65) }} />
                        <Typography fontWeight='bold' color={alpha('#42c976', 0.65)} fontSize={12}>
                        Total Value Settled
                        </Typography>
                        </Stack>
                        </Box>

                        <Typography py={1} fontWeight='bold' color='#212121' fontSize={30}>
                        ${Math.floor(Math.random() * 200000).toFixed(2)}
                        </Typography>

                        <Typography fontSize={12} fontWeight='medium'>
                                <Stack alignItems='center' spacing={2} direction='row'>
                                    <>
                                    12% (month)
                                    </>
                                    <>
                                    <ArrowDropUp color='secondary' fontSize='small' />
                                    </>
                                </Stack>
                              
                            </Typography>
                        </Card>

                        <Card xs={3} component={Grid} variant='outlined' item  sx={{  p: 2,mr: 2, display: 'flex', flexDirection: 'column', height: 135, }}>
                      <Box>
                        <Stack direction='row' alignItems='center'>
                        <Article fontSize='small' sx={{ color: alpha('#42c976', 0.65) }} />
                        <Typography fontWeight='bold' color={alpha('#42c976', 0.65)} fontSize={12}>
                        Total Contracts Available
                        </Typography>
                        </Stack>
                        </Box>

                        <Typography py={1} fontWeight='bold' color='#212121' fontSize={30}>
                            {Math.floor(Math.random() * 4000)}
                        </Typography>
                        </Card>
                            </Grid>

                            <Grid item sx={{flex: 1, height: 420}}>
                        
                    <UiTableView 
                         hasHead={true}
                    title='My Contracts' 
                    page={0} 
                    rows={myContractsRows} 
                    rowsPerPage={contractRowsPerPage} 
                    handleChangePage={handleContractsChangePage} 
                    handleChangeRowsPerPage={handleContractsChangeRowsPerPage}
                    headCells={myContractsHeadCells} 
                    emptyTableCaption='You have not posted any contracts.  Post your first now.'
                    />
                    </Grid>
                        </Grid>



                        <Grid container item xs={6}  direction='column' flexDirection='column'>
                                <Grid item sx={{ my: 2}}>
                                <Card component={Grid} variant='outlined' item  sx={{  p: 2, display: 'flex', flexDirection: 'column', height: 135, width: 350 }}>
                      <Box>
                          <Stack direction='row' alignItems='center' justifyContent='space-between'>
                          <Typography fontWeight='bold' color={alpha('#42c976', 0.65)} fontSize={12}>
                            Highest Grossing Market
                        </Typography>

                          <Button variant='text' size='small' color='secondary' sx={{ width: 150}} endIcon={<KeyboardArrowRight />}>
                            Open Market
                        </Button>
                          </Stack>


                        </Box>

                        <Typography py={1} fontWeight='bold' color='#212121' fontSize={30}>
                            Accounting
                        </Typography>
                        </Card>
                                </Grid>

                                <Grid item>
        <UiTableView 
        hasHead={true}
        title='My Jobs' 
        page={0} 
        rows={myJobsRows} 
        rowsPerPage={jobsRowsPerPage} 
        handleChangePage={handleJobsChangePage} 
        handleChangeRowsPerPage={handleJobsChangeRowsPerPage}
        headCells={myJobsHeadCells}
        emptyTableCaption='You have not started any jobs.  Explore markets and start your first contract.'
         />
                    </Grid>
                            </Grid>
        

                

                </Box>
                </Box>
        </Box>
    )
}

export default Dashboard


/*
const myWorkHeadCells: HeadCell[] = [
  {
    id: 'a',
    numeric: false,
    disablePadding: false,
    label: 'Product Name',
    render: (item) => (
      <Box component={Grid} container direction='row' alignItems='center'>
        <Card style={{width: 120, height: 80}}>
        <img src={item.one.imgUri} style={{width: '100%', height: '100%'}} />
        </Card>
        
          <Box sx={{ px: 2 }}>
            <Typography fontWeight='bold' fontSize={15}>
                {item.one.product_name}
            </Typography>
            <Typography fontWeight='bold' fontSize={12} color='#ddd'> {item.two}  </Typography>
          </Box>
      </Box>
    )
  },
  {
    id: 'b',
    numeric: false,
    disablePadding: false,
    label: 'Market',
    render: (item) => <Typography fontWeight='bold' fontSize={13}> {item.two}  </Typography>
  },
  {
    id: 'c',
    numeric: false,
    disablePadding: false,
    label: 'Price',
    render: (item) => <Typography fontWeight='bold' fontSize={13}> {item.three}  </Typography>
  },
  {
    id: 'd',
    numeric: false,
    disablePadding: false,
    label: 'Metadata',
    render: (item) => <Typography fontWeight='bold' fontSize={13}> {item.four}</Typography>
  },
  {
    id: 'e',
    numeric: false,
    disablePadding: false,
    label: 'Num mirrored',
    render: (item) => <Typography fontWeight='bold' fontSize={13}> {item.five}</Typography>
  },
  {
    id: 'e',
    numeric: false,
    disablePadding: false,
    label: 'Status',
    render: (item) => <Typography fontWeight='bold' fontSize={13}> {item.six}</Typography>
  },
];

const myWorkRows: Array<object> = new Array(20).fill(
  {
    key: 0,
    one: {
      imgUri: 'https://picsum.photos/seed/picsum/200/300',
      product_name: 'Website Mockup',
    },
    two: 'Writing & Translation',
    three: '$20.56',
    four: '/ipfs/QmYA2fn8cMbVWo4v95RwcwJVyQsNtnEwHerfWR8UNtEwoE',
    five: 25,
    six: 'Complete'
  },
)
*/