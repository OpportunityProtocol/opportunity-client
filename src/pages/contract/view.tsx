import React, { useState } from 'react'
import {
    Container,
    CardContent,
    Card,
    Typography,
    InputBase,
    Alert,
    AlertTitle,
    Grid,
    Tooltip,
    CardHeader,
    ListItemIcon,
    IconButton,
    Divider,
    Box,
    Stack,
    List,
    ListItem,
    ListItemText,
    Stepper,
    Step,
    StepLabel,
    CardActions,
    Button
} from '@mui/material'
import { StepIconProps } from '@mui/material/StepIcon';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Blockies from 'react-blockies'
import { styled } from '@mui/material/styles';
import { useStyles } from './ContractStyles'
import Link from 'next/link'
import { alpha } from '@mui/material';
import moment from 'moment'
import {
    Check,
    Work,
    Logout,
    LocalFireDepartment,
    EmojiEvents,
    ContentCopy
} from '@mui/icons-material'

const ViewContract: React.FunctionComponent<any> = () => {
    const classes = useStyles()
    const [isSubmittingProposal, setIsSubmittingProposal] = useState<boolean>(false)
    const [proposalContainerHeight, setProposalContainerHeight] = useState<boolean>(false)

    return (
        <>
            <Container maxWidth='xl' sx={{ mt: 3}}>
                <Alert severity="info">
                <AlertTitle>Payout Info</AlertTitle>
                    You are viewing this contract as a part of a referral.  Your referrer will receive <strong>5%</strong> of the total payout upon completion.
                </Alert>
            </Container>
        <Container maxWidth='xl' sx={{   }}>
            <Grid container direction='row' justifyContent='space-between' alignItems='flex-start' sx={{ padding: '3% 0%', }}>
                <Grid item xs={8}>
                <Box component={Card} variant='outlined'>
                    <CardContent>
                <Box sx={{ width: '100% '}}>
               {/* <Typography fontWeight='bold' color='rgba(33, 33, 33, .85)'>
                  Status: Unclaimed
    </Typography> */}

<>  
<Box>
<Typography variant='subtitle1' fontWeight='bold' fontSize={20}>
Looking for a web developer for long term contract
                    </Typography>


                    <Typography py={1} paragraph fontSize={15} fontWeight='medium' color='rgb(94, 94, 94)'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sed hendrerit sem. Donec nec mi sit amet nisl accumsan fringilla quis eget lectus. Quisque pellentesque tortor tortor, at convallis metus ornare ac. Aenean quis pellentesque nisl. Ut suscipit a nisi sed porttitor. Donec cursus velit diam, non accumsan urna aliquet hendrerit.
                    </Typography>
</Box>


                    </>

                </Box>
                </CardContent>
<Divider />
<CardContent>

            <Typography fontSize={16} fontWeight='bold'>
                History
            </Typography>
            <Box sx={{ py: 1}}>
                
                <Typography variant='caption' fontSize={15} color='rgb(94, 94, 94)'>
                    This contract has not been claimed - claim it now.
                </Typography>

                <Grid sx={{my: 2}} container spacing={2} direction='row' alignItems='center' justifyContent='space-between'>
                <Grid item>
                <Button sx={{ color: '#fff' }} variant='contained' color='secondary' disableElevation>
                    Submit Proposal
                </Button>
</Grid>

                    <Grid item />
                    </Grid>


            
            </Box> 
            </CardContent>
            </Box>

            <Card variant='outlined' sx={{ my: 4}}>
                <CardContent>
                <Typography fontWeight='bold' fontSize={20} color='rgba(33, 33, 33, .85)'>
                    Reviews for this user
                    </Typography>
                    <Typography variant='caption'>
                        No reviews has been written for this employer
                    </Typography>
                </CardContent>
            </Card>
                </Grid>

                <Grid item xs={3.7}>
                <Card variant='outlined' sx={{ backgroundCcolor: '#fff',  width: '100%', height: 'auto'}}>
              <CardContent>
                  <Typography fontSize={20} fontWeight='bold'>
                      Contract Details
                  </Typography>
              <Box sx={{py: 1}}>
                   
                            <ListItem>
                                <ListItemText 
                                primary='Creator'
                                secondary='0x19bBa405Fd0e4Da0e23230d49eFC0CbFb3664A6c'
                                primaryTypographyProps={{
                                    fontSize: 14, 
                                    fontWeight: 'bold',
                                    color: 'rgb(33, 33, 33, .85'
                                }}
                                secondaryTypographyProps={{
                                    color: '#808080',
                                    fontSize: 12
                                }}
                                 />
                            </ListItem>

                            <ListItem>
                                <ListItemText 
                                primary='Payout Type'
                                secondary='One Time Payment'
                                primaryTypographyProps={{
                                    fontSize: 14, 
                                    fontWeight: 'bold',
                                    color: 'rgb(33, 33, 33, .85'
                                }}
                                secondaryTypographyProps={{
                                    color: '#808080',
                                    fontSize: 12
                                }}
                                 />
                            </ListItem>
              

                            <ListItem>
                                <ListItemText 
                                primary='Budgetr'
                                secondary='No budget'
                                primaryTypographyProps={{
                                    fontSize: 14, 
                                    fontWeight: 'bold',
                                    color: 'rgb(33, 33, 33, .85'
                                }}
                                secondaryTypographyProps={{
                                    color: '#808080',
                                    fontSize: 12
                                }}
                                 />
                            </ListItem>

                            <ListItem>
                                <ListItemText 
                                primary='Deadline'
                                secondary='May 27, 2022'
                                primaryTypographyProps={{
                                    fontSize: 14, 
                                    fontWeight: 'bold',
                                    color: 'rgb(33, 33, 33, .85'
                                }}
                                secondaryTypographyProps={{
                                    color: '#808080',
                                    fontSize: 12
                                }}
                                 />
                            </ListItem>

                            <ListItem>
                                <ListItemText 
                                primary='Currency'
                                secondary='DAI'
                                primaryTypographyProps={{
                                    fontSize: 14, 
                                    fontWeight: 'bold',
                                    color: 'rgb(33, 33, 33, .85'
                                }}
                                secondaryTypographyProps={{
                                    color: '#808080',
                                    fontSize: 12
                                }}
                                 />
                            </ListItem>

                     
                            <ListItem>
                                <ListItemText 
                                primary='Completion Terms'
                                secondary={
                                    <ul>
                                    <li> Definition of done task number one </li>
                                    <li>This is another example of a task that requires for the job to be complete</li>
                                    <li>Finish doing task number three by that time</li>
                                </ul>
                                }
                                primaryTypographyProps={{
                                    fontSize: 14, 
                                    fontWeight: 'bold',
                                    color: 'rgb(33, 33, 33, .85'
                                }}
                                secondaryTypographyProps={{
                                    color: '#808080',
                                    fontSize: 12
                                }}
                                 />
                            </ListItem>



                    </Box>
              </CardContent>
            </Card>

            <Card variant='outlined' sx={{ my: 4}}>
                    <CardContent>
                    <Typography fontSize={20} fontWeight='bold'>
                      Metadata
                  </Typography>
                        <List>

                            <ListItem>
                                <ListItemText 
                                primary='Market Name'
                                secondary='Gitcoin Bounties'
                                primaryTypographyProps={{
                                    fontSize: 14, 
                                    fontWeight: 'bold',
                                    color: 'rgb(33, 33, 33, .85'
                                }}
                                secondaryTypographyProps={{
                                    color: '#808080',
                                    fontSize: 12
                                }}
                                 />
                            </ListItem>


                            <ListItem>
                                <ListItemText 
                                primary='Metadata' 
                                secondary='QmTtDqWzo179ujTXU7pf2PodLNjpcpQQCXhkiQXi6wZvKd'
                                primaryTypographyProps={{
                                    fontSize: 14, 
                                    fontWeight: 'bold',
                                    color: 'rgb(33, 33, 33, .85'
                                }}
                                secondaryTypographyProps={{
                                    color: '#808080',
                                    fontSize: 12,
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden'
                                }}
                                 />
                                <ListItemIcon>
                                    <IconButton>
                                    <ContentCopy fontSize='small' />
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
    )
}

export default ViewContract