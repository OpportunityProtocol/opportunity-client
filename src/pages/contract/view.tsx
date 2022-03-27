import React, { useState } from 'react'
import {
    Container,
    Card,
    Typography,
    InputBase,
    Grid,
    Tooltip,
    Divider,
    Box,
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
        <Box sx={{ width: '100%', padding: '3% 3%', bgcolor: '#fff'}}>
            <Box sx={{ padding: '2% 5%', bgcolor: '#fff'}}>
                <Box sx={{ width: '100% '}}>
                <Typography fontWeight='bold' color='rgba(33, 33, 33, .85)'>
                  Status: Unclaimed
                </Typography>

<>  
<Box sx={{py: 2}}>
<Typography fontWeight='bold' fontSize={25}>
                        Web Development
                    </Typography>

                    <Typography paragraph width={600} fontSize={15} fontWeight='medium' color='#5e5e5e'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sed hendrerit sem. Donec nec mi sit amet nisl accumsan fringilla quis eget lectus. Quisque pellentesque tortor tortor, at convallis metus ornare ac. Aenean quis pellentesque nisl. Ut suscipit a nisi sed porttitor. Donec cursus velit diam, non accumsan urna aliquet hendrerit.
                    </Typography>
</Box>


                    </>

                    <Grid container direction='row' justifyContent='space-between' alignItems='center'>
                        <Grid item>
                            <Typography fontWeight='bold' fontSize={14}>
                                Creator
                            </Typography>
                            <Tooltip title='0x88463F785e256C04eC584559627806d909BaC0FE'>
                            <Typography fontSize={13} color='#5e5e5e'>
                            0x88463F785e256C04eC584559627806d909BaC0FE <span><ContentCopy fontSize='small' /></span>
                            </Typography>
                            </Tooltip>
                        </Grid>

                        <Grid item>
                            <Typography fontWeight='bold' fontSize={14}>
                                Budget
                            </Typography>
                            <Tooltip title='0x88463F785e256C04eC584559627806d909BaC0FE'>
                            <Typography fontSize={13} color='#5e5e5e'>
                                500 DAI ($500)
                            </Typography>
                            </Tooltip>
                        </Grid>

                        <Grid item>
                            <Typography fontWeight='bold' fontSize={14}>
                                Deadline
                            </Typography>
                            <Typography fontSize={13} color='#5e5e5e'>
                            No deadline
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography fontWeight='bold' fontSize={14}>
                                Skill Level
                            </Typography>
                            <Typography fontSize={13} color='#5e5e5e'>
                                Intermmediate
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
<Divider sx={{my: 5}} />
            <Typography fontSize={16} fontWeight='bold'>
                History
            </Typography>
            <Box sx={{ py: 1}}>
                {/* 
                <Typography variant='caption'>
                    This contract has no history.{" "}
                    <Typography className={classes.link} fontSize={12} component='span'  variant='button' color='secondary'>
                        Claim it now
                    </Typography> 
                </Typography>
                */}
                
                <Box sx={{ display: 'flex', alignItems: 'center'}}>
                <Work fontSize='small' sx={{color: '#65d386', mr: 1}} />
                <Typography fontSize={13} color='#5e5e5e' py={2}>
                    <Typography component='span' fontWeight='bold' fontSize={13}>{moment(new Date().toDateString()).format('LL').toString()}</Typography> {" "}  0x88463F785e256C04eC584559627806d909BaC0FE began working this contract 10 hours ago.
                </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center'}}>
                <Logout fontSize='small' sx={{mr: 1}} />
                <Typography fontSize={13} color='#5e5e5e' py={2}>
                <Typography component='span' fontWeight='bold' fontSize={13}>{moment(new Date().toDateString()).format('LL').toString()}</Typography> {" "}  0x88463F785e256C04eC584559627806d909BaC0FE released this contract a few moments ago.
                </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center'}}>
                <LocalFireDepartment fontSize='small' sx={{color: 'red', mr: 1}} />
                <Typography fontSize={13} color='#5e5e5e' py={2}>
                <Typography component='span' fontWeight='bold' fontSize={13}>{moment(new Date().toDateString()).format('LL').toString()}</Typography> {" "}  0x88463F785e256C04eC584559627806d909BaC0FE began a dispute.
                </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center'}}>
                <EmojiEvents fontSize='small' sx={{color: '#65d386', mr: 1}} />
                <Typography fontSize={13} color='#5e5e5e' py={2}>
                <Typography component='span' fontWeight='bold' fontSize={13}>{moment(new Date().toDateString()).format('LL').toString()}</Typography> {" "}  You have been ruled the winner of this dispute.
                </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center'}}>
                <Work fontSize='small' sx={{color: '#65d386', mr: 1}} />
                <Typography fontSize={13} color='#5e5e5e' py={2}>
                <Typography component='span' fontWeight='bold' fontSize={13}>{moment(new Date().toDateString()).format('LL').toString()}</Typography> {" "}  0x88463F785e256C04eC584559627806d909BaC0FE began working this contract 10 hours ago.
                </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center'}}>
                <Check fontSize='small' sx={{color: '#65d386', mr: 1}} />
                <Typography fontSize={13} color='#5e5e5e' py={2}>
                <Typography component='span' fontWeight='bold' fontSize={13}>{moment(new Date().toDateString()).format('LL').toString()}</Typography> {" "}  You resolved this contract 2 hours ago.
                </Typography>
                </Box>
            </Box>
            <Divider />
            <Box sx={{py: 2}}>
                <Grid container spacing={2} direction='row' alignItems='center' justifyContent='space-between'>
                <Grid item>
                <Button sx={{ color: '#fff' }} variant='contained' color='secondary' disableElevation>
                    Submit Proposal
                </Button>
</Grid>

                    <Grid item>
                    <Button sx={{mx: 1}} variant='outlined' color='secondary' disableElevation>
                        Release Funds
                </Button>

                <Button sx={{mx: 1}} variant='outlined' color='secondary' disableElevation>
                        Begin Dispute
                </Button>
                    </Grid>
                </Grid>
            </Box>
            </Box>
        </Box>
    )
}

export default ViewContract