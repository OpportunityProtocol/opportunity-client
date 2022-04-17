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
    Avatar,
    CardContent,
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
import { Add, ArrowDropUp, Article, AttachMoney, Info, PriceCheck, Search } from '@mui/icons-material';
import MarketDisplay from '../../modules/market/components/MarketDisplay';
import UiTableView from '../../common/components/UITableView/UITableView';
  import { HeadCell, Data } from '../../common/interface'

  import Blockies from 'react-blockies'
import JobDisplay from '../../modules/market/components/JobDisplay';
import SmallConnectionCard from '../../modules/user/components/SmallConnectionCard/SmallConnectionCard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ bgcolor: '#fbfbfd' }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
      value: index,
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

  const COLUMN_HEIGHT = 'calc(100vh - 70px)'

const Dashboard: React.FunctionComponent = () => {
  const [contractPage, setContractPage] = useState<number>(0)
  const [contractRowsPerPage, setContractRowsPerPage] = useState<number>(5)
  const [jobsPage, setJobsPage] = useState<number>(0)
  const [jobsRowsPerPage, setJobsRowsPerPage] = useState<number>(5)
  const [connections, setConnections] = useState([1,2,3])
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Grid container direction='row' alignItems='flex-start'>

            <Grid item xs={9} sx={{ overflowY: 'scroll', p: 5, height: COLUMN_HEIGHT, backgroundColor: '#fbfbfd'}}>
              <Stack spacing={1} width='100%' direction='row' alignItems='center' justifyContent='flex-end'>
                    <Button disableElevation variant='outlined' color='secondary'>
                      Create Contract
                    </Button>

                    <Button disableElevation variant='outlined' color='secondary'>
                      Add Service
                    </Button>
                    </Stack>

                    <Tabs
    variant='standard'
        value={value}
        indicatorColor='secondary'
        textColor='secondary'
        onChange={handleChange}
        sx={{ bgcolor: '#fbfbfd', my: 2 }}
      >
        <Tab sx={{fontSize: 15 }} label={`Connections (${Math.floor(Math.random() * 30)})`} {...a11yProps(0)} />
        <Tab sx={{fontSize: 15}} label={`My Contracts (${Math.floor(Math.random() * 30)})`} {...a11yProps(1)} />
        <Tab sx={{fontSize: 15}} label={`My Jobs (${Math.floor(Math.random() * 30)})`} {...a11yProps(1)} />
        <Tab sx={{fontSize: 15}} label={`My Services (${Math.floor(Math.random() * 30)})`} {...a11yProps(2)} />
      </Tabs>

      <TabPanel value={0} index={0} sx={{ bgcolor: '#fff' }}>
      <Box sx={{  }} component={Grid}  container direction='row' alignItems='center' spacing={3}>
                    {
                      new Array(10).fill(1).map(connection => {
                        return (
                          <Grid item xs={3}>
                            <Card variant='outlined' classes={{ root: classes.card }}>
                            <CardContent>
                          <Stack direction='row' spacing={2} alignItems='flex-start'>
                          <Avatar sx={{ width: 40, height: 40 }} src='/assets/stock/profile_main.jpeg' />
                          <Box>
                          <Box sx={{ fontSize: 15, fontWeight: 'bold'}} color='rgba(33, 33, 33, .85)'>
                            Joe Ross
                          </Box> 
                          <Box>
                          <Typography  
                          sx={{
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
            }} fontSize={12} color='#a1a1a1'>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer porta, nulla in tempor fringilla, ex ligula venenatis justo, eu consequat urna lacus facilisis justo. 
                          </Typography>
                          </Box>
                          </Box>
                          </Stack>
                          </CardContent>
                          </Card>
                        </Grid>
                        )
                      })
                    }
                </Box>
      </TabPanel>

      <TabPanel value={1} index={1}>
        Item One
      </TabPanel>

      <TabPanel value={2} index={2}>
        Item One
      </TabPanel>





    
              </Grid>


              <Grid item xs={3} sx={{ borderLeft: '1px solid #eee', backgroundColor: '#fff', height: COLUMN_HEIGHT, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',}}>
                <Box p={5}>
                <Stack direction='column' alignItems='center'>
                  {Math.random() > 0.5 ? <Avatar sx={{ width: 110, height: 110 }} src='/assets/stock/profile_main.jpeg' /> 
                  :       
                  <Blockies
                      seed={Math.random().toString()}
                      size={40}
                      scale={3}
                      className={classes.blockie}
                    />}
                  <Typography sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column'}} component='div' fontWeight='bold' py={2}>
                  <Box sx={{ fontWeight: 'bold', fontSize: 25 }}>
                      Joe Rossy
                    </Box>
                    <Box sx={{ fontWeight: 'medium', color: 'grey' }}>
                    @happytowork
                    </Box>
                  </Typography>

                  <Stack direction='row' alignitems='center'>
                    <Button variant='contained' disabled>
                      Connect
                    </Button>
                  </Stack>
                </Stack>
                </Box>
                <Divider className={classes.divider} />
                <CardContent>
                <Typography variant='subtitle2' fontWeight='bold' color='rgba(33, 33, 33, .85)'>
                    About me
                  </Typography>
                  <Typography py={1}  sx={{ fontWeight: 'medium' }} paragraph fontSize={13}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ultricies volutpat ex ut malesuada. Maecenas semper tempus commodo. Etiam aliquet, ligula ut dignissim luctus, felis dui viverra metus, a iaculis libero risus vitae mauris. Aliquam sed tristique est. Donec vitae maximus ligula. Nam aliquet metus sit amet odio posuere, nec congue diam viverra. Integer non tortor dui. Integer pulvinar maximus aliquam.
                  </Typography>
                </CardContent>
                <Divider className={classes.divider} />
                <Box component={CardContent}>
                <Typography  variant='subtitle2' fontWeight='bold' color='rgba(33, 33, 33, .85)'>
                    Languages
                  </Typography>
                  <Stack py={1} direction='row' alignItems='center' spacing={1}>
                    <Chip variant='outlined' label='English' />
                    <Chip variant='outlined' label='Spanish' />
                  </Stack>
                </Box>
                <Divider className={classes.divider} />
                <Box component={CardContent}>
                <Typography variant='subtitle2' fontWeight='bold' color='rgba(33, 33, 33, .85)'>
                    Skillset
                  </Typography>
                  <Stack py={1}  direction='row' alignItems='center' spacing={1}>
                    <Chip variant='outlined' label='English' />
                    <Chip variant='outlined' label='Spanish' />
                  </Stack>
                </Box>
              </Grid>


            </Grid>
        </Box>
    )
}

export default Dashboard


/*

     <UiTableView 
                         hasHead={true}
                    title='Contracts, Services and Jobs' 
                    page={0} 
                    rows={myContractsRows} 
                    rowsPerPage={contractRowsPerPage} 
                    handleChangePage={handleContractsChangePage} 
                    handleChangeRowsPerPage={handleContractsChangeRowsPerPage}
                    headCells={myContractsHeadCells} 
                    emptyTableCaption='You have not posted any contracts.  Post your first now.'
                    />

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