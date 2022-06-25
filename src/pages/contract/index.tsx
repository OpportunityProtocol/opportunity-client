import React, { useEffect, useState } from 'react';

import {
  Box,
  Card,
  Divider,
  Container,
  ListItemText,
  Grid,
  ListItem,
  List,
  Tabs,
  Tab,
  Pagination,
  Button,
  ListItemIcon,
  Typography,
  Table,
  TableContainer,
  TableRow,
  TableBody,
  TableCell,
  IconButton,
  InputBase,
  Paper,
  CardContent,
  CardHeader,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';

import { useStyles } from '../../modules/contract/ContractStyles';
import { Attachment, ContentCopy, FilterList, MoreVert, Send } from '@mui/icons-material';
import JobDisplay from '../../modules/market/components/JobDisplay';
import BountySubmission from '../../modules/market/components/BountySubmission/BountySubmission';
import { FileUploader } from 'react-drag-drop-files';
import TabPanel from '../../common/components/TabPanel/TabPanel';

import SearchBarV2 from '../../common/components/SearchBarV2/SearchBarV2';
import ServiceCard from '../../modules/contract/components/ServiceCard/ServiceCard';
import { useSelector } from 'react-redux';
import { selectLens, selectUserAddress, selectVerificationStatus } from '../../modules/user/userReduxSlice';
const fileTypes = ['PDF', 'PNG', 'DOC'];

const resources = [1, 2, 3, 4, 5, 6, 4];

/**
 * For now this is the all out page for viewing contracts
 * All users who message anyone or submit a proposal will happen here.  The only way you won't be able to access is if the job i claimed.. because you won't be able to click job card anywat
 * @returns
 */
const Contracts: React.FunctionComponent<any> = () => {
  const classes = useStyles();
  const [conversationSelected, setConversationSelected] = useState<boolean>(true);
  const [relationships, setRelationships] = useState<any>([]);
  const [tabValue, setTabValue] = React.useState<number>(0);

  const userAddress = useSelector(selectUserAddress)
  const userLensProfileInformation = useSelector(selectLens)
  const userVerificationStatus = useSelector(selectVerificationStatus)

  const handleOnChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const renderUsers = async () => {
    const a = await fetch('https://randomuser.me/api/?results=20');
    const b = await a.json();
    setRelationships(b.results);
  };

  useEffect(() => {
    renderUsers();
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography pl={1} fontSize={25} fontWeight="medium">
        Contracts
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ width: '100%', mt: 1, mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleOnChangeTab}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab value={0} label="Published Services" disabled={!userVerificationStatus && !userLensProfileInformation.profileId || userLensProfileInformation.profileId === 0} />
            <Tab value={1} label="Services Purchased" />
            <Tab value={2} label="Published Contracts" />
            <Tab value={3} label="Contract Working" />
          </Tabs>
          <Divider />
        </Box>
        <TabPanel index={0} value={tabValue}>
          <Box>
            <Grid container direction="row" alignItems="center" spacing={2}>
              {relationships.slice(10, 15).map(
                (
                  relationship: {
                    name: { first: string; last: string };
                    picture: { large: string };
                  },
                  idx: any
                ) => (
                  <Grid item xs={3}>
                  
                    <ServiceCard
                      name={relationship.name.first + ' ' + relationship.name.last}
                      avatarSrc={relationship.picture.large}
                      headerSrc="https://picsum.photos/200"
                    />
                  </Grid>
                )
              )}
            </Grid>
          </Box>
        </TabPanel>
        <TabPanel index={1} value={tabValue}>
          <Box>
            <Grid container direction="row" alignItems="center" spacing={2}>
              {relationships
                .slice(10, 15)
                .map(
                  (
                    relationship: { picture: { large: string | undefined } },
                    idx: React.Key | null | undefined
                  ) => (
                    <Grid item xs={3}>
                                         <ServiceCard
                      name={relationship.name.first + ' ' + relationship.name.last}
                      avatarSrc={relationship.picture.large}
                      headerSrc="https://picsum.photos/200"
                    />
                    </Grid>
                  )
                )}
            </Grid>
          </Box>
        </TabPanel>
        <TabPanel index={2} value={tabValue}>
          <Box>
            <Grid container direction="row" alignItems="center" justifyContent="space-between">
              {relationships
                .slice(10, 15)
                .map(
                  (
                    relationship: { picture: { large: string | undefined } },
                    idx: React.Key | null | undefined
                  ) => (
                    <Grid item key={idx} xs={5.9} sx={{ m: 0.5 }}>
                      <React.Fragment>
                        <JobDisplay
                          avatar={relationship.picture.large}
                          suggestion={idx === 0 ? true : false}
                        />
                      </React.Fragment>
                    </Grid>
                  )
                )}
            </Grid>
          </Box>
        </TabPanel>
        <Divider />
      </Box>
    </Container>
  );
};

export default Contracts;
