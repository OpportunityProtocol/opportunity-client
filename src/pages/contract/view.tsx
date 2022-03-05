import React from 'react'
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

const steps = ['Claimed', 'Reviewing Work', 'Resolved' /*'Disputed' */];

const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 10,
      left: 'calc(-50% + 16px)',
      right: 'calc(50% + 16px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#eee',
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#43A047',
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
      borderTopWidth: 3,
      borderRadius: 1,
    },
  }));
  
  const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(
    ({ theme, ownerState }) => ({
      color: '#eaeaf0',
      display: 'flex',
      height: 22,
      alignItems: 'center',
      ...(ownerState.active && {
        color: '#784af4',
      }),
      '& .QontoStepIcon-completedIcon': {
        color: '#43A047',
        zIndex: 1,
        fontSize: 18,
      },
      '& .QontoStepIcon-circle': {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: '#eee',
      },
    }),
  );

  function QontoStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;
  
    return (
      <QontoStepIconRoot ownerState={{ active }} className={className}>
        {completed ? (
          <Check className="QontoStepIcon-completedIcon" />
        ) : (
          <div className="QontoStepIcon-circle" />
        )}
      </QontoStepIconRoot>
    );
  }

function CustomizedSteppers({ activeStep }) {
    return (
        <Stepper sx={{ my: 5 }} alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
    );
  }

  const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
      marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
      borderRadius: 0,
      position: 'relative',
      backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
      border: '1px solid #ced4da',
      fontSize: 16,
      width: 400,
      padding: '10px 12px',
      transition: theme.transitions.create([
        'border-color',
        'background-color',
        'box-shadow',
      ]),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
        borderColor: theme.palette.primary.main,
      },
    },
  }));


const ViewContract: React.FunctionComponent<any> = () => {
    const classes = useStyles()

    return (
        <Box sx={{ width: '100%', paddingTop: 2}}>
            <Container maxWidth='md' sx={{ bgcolor: '#fff', border: '1px solid #eee' }}>
                <Box sx={{ width: '100% '}}>
                <CustomizedSteppers activeStep={3} />

<>
                    <Typography fontWeight='bold'>
                        Customer Service Representative
                    </Typography>
                    <Link href=''>
                         <Typography className={classes.link} fontSize={12} component='span'  variant='button' color='secondary'> 
                             /ipfs/QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4 
                         </Typography>
                     </Link>

                    <Typography paragraph py={2} fontSize={14} color='#5e5e5e'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sed hendrerit sem. Donec nec mi sit amet nisl accumsan fringilla quis eget lectus. Quisque pellentesque tortor tortor, at convallis metus ornare ac. Aenean quis pellentesque nisl. Ut suscipit a nisi sed porttitor. Donec cursus velit diam, non accumsan urna aliquet hendrerit.
                    </Typography>
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
                <Work fontSize='small' sx={{color: '#42c976', mr: 1}} />
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
                <EmojiEvents fontSize='small' sx={{color: '#42c976', mr: 1}} />
                <Typography fontSize={13} color='#5e5e5e' py={2}>
                <Typography component='span' fontWeight='bold' fontSize={13}>{moment(new Date().toDateString()).format('LL').toString()}</Typography> {" "}  You have been ruled the winner of this dispute.
                </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center'}}>
                <Work fontSize='small' sx={{color: '#42c976', mr: 1}} />
                <Typography fontSize={13} color='#5e5e5e' py={2}>
                <Typography component='span' fontWeight='bold' fontSize={13}>{moment(new Date().toDateString()).format('LL').toString()}</Typography> {" "}  0x88463F785e256C04eC584559627806d909BaC0FE began working this contract 10 hours ago.
                </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center'}}>
                <Check fontSize='small' sx={{color: '#42c976', mr: 1}} />
                <Typography fontSize={13} color='#5e5e5e' py={2}>
                <Typography component='span' fontWeight='bold' fontSize={13}>{moment(new Date().toDateString()).format('LL').toString()}</Typography> {" "}  You resolved this contract 2 hours ago.
                </Typography>
                </Box>
            </Box>
            <Divider />
            <Box sx={{py: 2}}>
                <Grid container spacing={2} direction='row' alignItems='center' justifyContent='space-between'>
                <Grid item>
                <Button variant='contained' color='secondary' disableElevation>
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
            </Container>
        </Box>
    )
}

export default ViewContract