import { ClassNames } from '@emotion/react'
import React, { useState } from 'react'
import {
    Box,
    Tab,
    Tabs,
    Grid,
    Divider,
    Button,
    Typography,
    Card,
    CardActionArea,
    CardMedia,
    AvatarGroup,
    Avatar,
    CardContent,
    Stack,
} from '@mui/material'

import { useStyles } from './NetworkStyles'
import { Folder, Language } from '@mui/icons-material';
import Blockies from 'react-blockies'
import { HeadCell, Data } from '../../common/interface'
import UiTableView from '../../common/components/UITableView/UITableView';
import { useRouter } from 'next/router';

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
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

const products = new Array(30).fill(1)

const Network: React.FunctionComponent = () => {
    const classes = useStyles()
    const [contractPage, setContractPage] = useState<number>(0)
    const [contractRowsPerPage, setContractRowsPerPage] = useState<number>(5)
    const [value, setValue] = React.useState(0);

    const router = useRouter()

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div className={classes.container}>
            <Box sx={{ padding: '1% 1%' }}>
                <Typography py={1} fontSize={22} fontWeight='bold'>
                Portfolio
            </Typography>
              <Stack direction='row' alignItems='center'>
              <Blockies
                  seed={Math.random().toString()}
                  size={8}
                  scale={3}
                  className={classes.blockie}
                />
                            <Typography px={1} fontSize={16}>
                @happytowork12
            </Typography>
              </Stack>
            </Box>
            <Divider />
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} textColor='secondary' indicatorColor="secondary" onChange={handleChange} aria-label="basic tabs example">
                        <Tab label='Portfolio' icon={<Folder fontSize='small' />} iconPosition="start" sx={{ fontWeight: 'bold' }} {...a11yProps(0)} />
                        <Tab label='Connections' icon={<Language fontSize='small' />} iconPosition="start" sx={{ fontWeight: 'bold' }} {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                  <Box sx={{ padding: '1% 3%'}}>
                  <Grid container direction='row' alignItems='center' spacing={3}>
                  {
                    products.map(product => {
                      return (
                        <Grid item xs={3}>
                          <Card classes={{ root: classes.productCard }} variant='outlined' sx={{ height: 300}} onClick={() => router.push('/product/view')}>
                            <CardActionArea>
                              <CardMedia sx={{height: 200}} component='img' image='https://picsum.photos/seed/picsum/200/300' />
                              <CardContent sx={{height: 100}}>
                                <Stack direction='row'  justifyContent='space-between' alignItems='flex-start'>
                                <Box>
                                <Typography fontSize={13} fontWeight='bold'>
                                  Website Mockup
                                </Typography>
                                <Typography fontWeight='bold' fontSize={13} color='rgb(54, 119, 74)'>
                                  Saleable
                                </Typography>
                                </Box>


                                <Box>
                                <Typography fontSize={13}>
                                  Price
                                </Typography>
                                <Typography fontSize={13} fontWeight='bold'>
                                  $5.340
                                </Typography>
                                </Box>
                                </Stack>
                                <Stack pt={1} direction='row' alignItems='center'>
                                  <Typography fontWeight='bold' fontSize={13}>
                                  Accepted Currencies: 
                                  </Typography>
                                  <span>
                                  <AvatarGroup max={3} sx={{ display: 'flex', alignItems: 'center', margin: '0px !important', justifyContent: 'flex-start'}}>
            <Avatar sx={{ width: 20, height: 20 }} alt="Remy Sharp" src="/assets/images/dai.png" />
            <Avatar sx={{ width: 15, height: 15 }} alt="Remy Sharp" src="/assets/images/terra.png" />
                    </AvatarGroup>
                                  </span>
                                </Stack>
                              </CardContent>
                            </CardActionArea>
                          </Card>
                        </Grid>
                      )
                    })
                  }
                  </Grid>
                  </Box>
                </TabPanel>
                <TabPanel value={value} index={1}>
                <Box sx={{ padding: '1% 3%'}}>
                  <Grid container direction='row' alignItems='center' spacing={3}>
                  {
                    products.map(product => {
                      return (
                        <Grid item xs={3}>
                          <Card classes={{ root: classes.connectionCard }} variant='outlined' sx={{ height: 300}}>
                            <CardActionArea sx={{height: '100%'}} >
                              <CardContent sx={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',flexDirection: 'column'}}>
                              <Avatar sx={{ width: 60, height: 60 }} alt="Remy Sharp" src="/assets/images/dai.png" />
                              <Typography>
                                @handletowork
                              </Typography>
                              <Typography>
                                12 Mutual Connections
                              </Typography>
                              <Button variant='outlined'>
                                View Portfolio
                              </Button>
                              </CardContent>
                            </CardActionArea>
                          </Card>
                        </Grid>
                      )
                    })
                  }
                  </Grid>
                  </Box>
                </TabPanel>
            </Box>
        </div>
    )
}

export default Network