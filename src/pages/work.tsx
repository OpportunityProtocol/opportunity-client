import { Grid } from "@mui/material";
import React, { useEffect, useState, FunctionComponent, Fragment  } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import JobDisplay from '../modules/market/components/JobDisplay';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import StarBorder from '@mui/icons-material/StarBorder';
import List from '@mui/material/List';

import {
    Container
} from '@mui/material'
import { useStyles } from '../modules/market/MarketStyles';
import { useRouter } from 'next/router';




interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
};

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
          <Box sx={{ p: 3, borderBottom: '1px solid #212121' }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
};

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };

  // list item component
  //


  //work component
function Work() {
    const [value, setValue] = React.useState(0);
  
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

    const [open, setOpen] = React.useState({});



    const handleClick = (id) => {
        setOpen((prevState) => ({ ...prevState, [id]: !prevState[id] }));
      };


  

 const marketName= 
    [
        {   "id": 1,
            "name": 'Writing & Translation'
        }, 
        {
            "id": 2,
            "name":  ' Design & Creative'
        }, 
        {
            "id": 3,
            "name":  'Development & IT'
        }, 
        {
            "id": 4,
            "name": 'Engineering & Architecture'
        }, 
        {
            "id": 5,
            "name":  'Accounting & Finance'
        }, 
        {
            "id": 6,
            "name": 'Sales & Marketing'
        }
    ]
  console.log(marketName)


    return(

        <Grid component={Container} maxWidth='xl' container direction="column" sx={{bgcolor: 'background.paper'}}>
            <Grid item >
                <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    <Box m={3} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper'  }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                            <Tab sx={{fontSize: '14px', borderBottom: '1px solid #212121'}} label="Service" {...a11yProps(0)} />
                            <Tab sx={{fontSize: '14px'}} label="Contract" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                        <TabPanel value={value} index={0} >
                            <Grid container justifyContent="space-between" spacing={2} sx={{ bgcolor: 'background.paper'}} >
                                <Grid item xs={3} sx={{  }}>

                              


                                <List
                                    sx={{ width: '95%', maxWidth: 360, bgcolor: 'background.paper',}}
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"
                                >
                            
                                    {marketName.map((item) =>( 

                                
                                
                                <Fragment key={item.id} >
                                


                                        <ListItemButton  style={{ backgroundColor: 'transparent' }}  onClick={() => handleClick(item.id)}>

                                          
                                   
                                        <ListItemText primary={item.name} sx={{fontSize: '14px'}}/>
                                       
                                        {open[item.id]? <RemoveIcon /> : <AddIcon />}
                                        </ListItemButton>
                                        <Collapse in={open[item.id]} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                        <ListItemButton sx={{ pl: 4 }} style={{ backgroundColor: 'transparent' }}>

                                        <ListItemText primary="Starred"  sx={{fontSize: '14px'}}/>
                                
                                        </ListItemButton>
                                        </List>
                                        </Collapse>


                                        
                                        </Fragment>

))}


                                        </List>

                                   
                                




                               
                                </Grid>
                                <Grid   container justifyContent="space-between" alignItems="center" item xs={9} spacing={1} sx={{ bgcolor: '#FAFAFA' /*'rgb(252, 253, 254)'*/, maxHeight: 860,  overflow: "auto"}} >

                                        <Grid item xs={6} p={1} >
                                        <JobDisplay  />

                                        </Grid>

                                        <Grid item xs={6} p={1}>
                                        <JobDisplay />
                                         </Grid>

                                         <Grid item xs={6} p={1}>
                                        <JobDisplay />
                                         </Grid>

                                         <Grid item xs={6} p={1}>
                                        <JobDisplay />
                                         </Grid>

                                         <Grid item xs={6} p={1}>
                                        <JobDisplay />
                                         </Grid>
                                         <Grid item xs={6} p={1} >
                                        <JobDisplay  />

                                        </Grid>

                                        <Grid item xs={6} p={1}>
                                        <JobDisplay />
                                         </Grid>

                                         <Grid item xs={6} p={1}>
                                        <JobDisplay />
                                         </Grid>

                                         <Grid item xs={6} p={1}>
                                        <JobDisplay />
                                         </Grid>

                                         <Grid item xs={6} p={1}>
                                        <JobDisplay />
                                         </Grid>

                                         <Grid item xs={6} p={1} >
                                        <JobDisplay  />

                                        </Grid>

                                        <Grid item xs={6} p={1}>
                                        <JobDisplay />
                                         </Grid>

                                         <Grid item xs={6} p={1}>
                                        <JobDisplay />
                                         </Grid>

                                         <Grid item xs={6} p={1}>
                                        <JobDisplay />
                                         </Grid>

                                         <Grid item xs={6} p={1}>
                                        <JobDisplay />
                                         </Grid>


                                    
                                    </Grid>
                                </Grid>
                        
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                             Item Two
                        </TabPanel>
                        
                </Box>
            </Grid>
        
        </Grid>

    
    );
}


export default Work;



/*

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

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
        <Box sx={{ p: 3 }}>
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

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </Box>
  );
}




import { Grid } from "@mui/material";
import React, { useEffect, useState, FunctionComponent } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import JobDisplay from '../modules/market/components/JobDisplay';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import List from '@mui/material/List';
import { useStyles } from '../modules/market/MarketStyles';
import { useRouter } from 'next/router';


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
};

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
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
};

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };

function Work() {
    const [value, setValue] = React.useState(0);
  
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

    const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const Explore: FunctionComponent = () => {
    const classes = useStyles();
    const [suggestedConnections, setSuggestedConnections] = useState<any[]>([]);
    const [markets, setMarkets] = useState<any[]>([]);
    const [desiredMarkets, setDesiredMarkets] = useState<string>('Filter desired markets');
    const [sortBy, setSortBy] = useState<string>('Sort by');
    const [participatedChecked, setParticipatedChecked] = useState<any>('');
    const router = useRouter();
    
  
    const fetchNetworkSuggestions = async () => {
      const a = await fetch('https://randomuser.me/api/?results=20');
      const b = await a.json();
      setSuggestedConnections(b.results);
    };
  
    const handleOnChangeParticipatedChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
      setParticipatedChecked(event.target.checked);
    };
  
    const handleOnChangeDesiredMarkets = () => {};
    const handleOnChangeSortBy = () => {};
  
    useEffect(() => {
      fetchNetworkSuggestions();
      let updatedMarkets = [];
      updatedMarkets.push('Writing and Translation');
      updatedMarkets.push('Development & IT');
      updatedMarkets.push('Accounting and Finance');
      updatedMarkets.push('Design and Creative');
      updatedMarkets.push('Engineering and Architecture');
      updatedMarkets.push('Sales and Marketing');
      setMarkets(updatedMarkets);
    }, []);
  


    return(
        <Grid container direction="column" >
            <Grid item >
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                            <Tab label="Item One" {...a11yProps(0)} />
                            <Tab label="Item Two" {...a11yProps(1)} />
                            <Tab label="Item Three" {...a11yProps(2)} />
                        </Tabs>
                    </Box>
                        <TabPanel value={value} index={0}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                <List
                                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"
                                >
                                <ListItemButton onClick={handleClick}>
                                    <ListItemIcon>
                                        <InboxIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Inbox" />
                                        {open ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={open} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 4 }}>
                                    <ListItemIcon>
                                        <StarBorder />
                                    </ListItemIcon>
                                    <ListItemText primary="Starred" />
                                </ListItemButton>
                                    </List>
                                    </Collapse>
                                </List>
                                </Grid>
                                <Grid item xs={8}>
                                    {suggestedConnections.slice(3, 6).map((human: any) => {
                                    return (
                                    <Grid item xs={6}>
                                        <JobDisplay avatar={human.picture.large} suggestion={true} />
                                    </Grid>
                                    );
                                })}
                                </Grid>
                            </Grid>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                             Item Two
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                             Item Three
                        </TabPanel>
                </Box>
            </Grid>
            
            <Grid container>
            <p>hello</p>
    
            </Grid>
            <Grid container>
            <p>hello</p>

    
            </Grid>

        
        
        
        
        
        
        
        
        </Grid>



    );
}}

export default Work;






  <ListItemButton  style={{ backgroundColor: 'transparent' }}  onClick={handleClick}>
                                   
                                    <ListItemText primary="Wrting and Translation" />
                                            {open ? <RemoveIcon /> : <AddIcon />}
                                    </ListItemButton>
                                    <Collapse in={open} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 4 }} style={{ backgroundColor: 'transparent' }}>
                                    
                                    <ListItemText primary="Starred" />
                                </ListItemButton>
                                    </List>
                                    </Collapse>


                                    

                                    <ListItemButton onClick={handleClick}>
                                    <ListItemIcon>
                                        <InboxIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Inbox" />
                                            {open ? <RemoveIcon /> : <AddIcon />}
                                    </ListItemButton>
                                    <Collapse in={open} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 4 }}>
                                    <ListItemIcon>
                                        <StarBorder />
                                    </ListItemIcon>
                                    <ListItemText primary="Starred" />
                                </ListItemButton>
                                    </List>
                                    </Collapse>
*/