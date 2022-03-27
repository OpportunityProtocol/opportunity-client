import React from 'react'

import {
    Box,
    Card,
    Divider,
    ListItemText,
    Grid,
    ListItem,
    List,
    Pagination,
    ListItemIcon,
    Typography,
    IconButton,
    InputBase,
    Paper,
    CardContent,
    CardHeader
} from "@mui/material"

import { useStyles } from './ContractStyles';
import { Attachment, ContentCopy } from '@mui/icons-material'
import JobDisplay from '../../modules/market/components/JobDisplay';
import BountySubmission from '../../modules/market/components/BountySubmission/BountySubmission';
import { FileUploader } from "react-drag-drop-files";
const fileTypes = ["PDF", "PNG", "DOC"];

/**
 * For now this is the all out page for viewing contracts
 * All users who message anyone or submit a proposal will happen here.  The only way you won't be able to access is if the job i claimed.. because you won't be able to click job card anywat
 * @returns 
 */
const Contract : React.FunctionComponent<any> = () => {
    const classes = useStyles()
    
    return (
        <Box component={Grid} direction='row' spacing={2} alignItems='flex-start' container className={classes.boxContainer}>
            <Grid  direction='column' container item xs={8}>
            <Grid mb={2} item flex={1}>
                <JobDisplay hasButton={false} />             
            </Grid>
            <Grid item flex={3} sx={{   }}>
           {/* Traditional Markets Display */}
            <Card variant='outlined' sx={{ my: 1,  borderRadius: 2, height: '100%', flexGrow: 1, flex: 1}}>
                <Grid container direction='column' justifyContent='space-between' sx={{  height: '100%'}}>
                    <Grid item xs={9} flexGrow={1} flex={1} >
                        <CardContent sx={{ height: '100%',  }}>
                        <div className={classes.chatArea}>
                       
                        </div>
                        </CardContent>
                    </Grid>
                
                    <Grid item xs={3} sx={{ borderTop: '1px solid #eee',  }}>
                        <CardContent className={classes.inputContainer}>
                          <IconButton>
                                <Attachment />
                            </IconButton>
                            <Paper variant='outlined' sx={{flex: 1}}>
                                <InputBase placeholder='Hello World' className={classes.inputBase} />
                            </Paper>
                        </CardContent>
                    </Grid>
                </Grid>
            </Card>
            </Grid>
            </Grid>

            <Grid spacing={2} container item xs={4}>
            <Grid item sx={{ width: '100%' }}>
                {/* Will always see this no matter what */}
                <Card variant='outlined'>
                    <CardHeader title='Contract Details' />
                    <Divider />
                    <CardContent>
                        <List>
                            <ListItem>
                                <ListItemText 
                                primary='Status' 
                                secondary='Uninitialized'
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
                                primary='Ownership'
                                secondary='Unclaimed'
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
                                primary='Budget'  /* Amount Deposited upon claimed */
                                secondary='$00'
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
                                primary='Completion definition' 
                                secondary={
                                    <React.Fragment>
                                        <ul>
                                            <li> Definition of done task number one </li>
                                            <li>This is another example of a task that requires for the job to be complete</li>
                                            <li>Finish doing task number three by that time</li>
                                        </ul>
                                    </React.Fragment>
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
                        </List>
                    </CardContent>
                </Card>
                </Grid>

                <Grid item sx={{ width: '100%' }}>
                <Card variant='outlined'>
                    {/* Will always see this no matter what */}
                    <CardHeader title='Metadata' />
                    <Divider />
                    <CardContent>
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
        </Box>
    )
}


export default Contract