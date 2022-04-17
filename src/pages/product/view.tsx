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
    Paper,
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

const ViewProduct: React.FunctionComponent<any> = () => {
    const classes = useStyles()

    return (
        <Box  sx={{ width: '100%', padding: '3% 3%', bgcolor: '#fbfbfd'}}>
            <Box component={Paper} elevation={20} sx={{ padding: '2% 5%', bgcolor: '#fff', border: '1px solid #eee',  boxShadow:
          '0px 5px 5px -3px rgba(240, 239, 241, 0.8), 0px 8px 10px 1px rgba(240, 239, 241, 0.5),0px 3px 14px 2px rgba(240, 239, 241, 0.2)', }}>
                <Box sx={{ width: '100% '}}>

<>  
<Box sx={{py: 2}}>
<Typography fontWeight='bold' fontSize={25}>
                        Web Development Mockup Kit
                    </Typography>
                    <Link href=''>
                         <Typography className={classes.link} fontSize={12} component='span'  variant='button' color='secondary'> 
                             /ipfs/QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4 
                         </Typography>
                     </Link>
</Box>


                    <Typography paragraph py={2} width={600} fontSize={15} fontWeight='medium' color='#5e5e5e'>
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
                    </Grid>
                </Box>

            <Box sx={{py: 2}}>
                <Grid container spacing={2} direction='row' alignItems='center' justifyContent='space-between'>
                <Grid item>
                <Button sx={{ color: '#fff' }} variant='contained' color='secondary' disableElevation>
                    Purchase
                </Button>
</Grid>

                </Grid>
            </Box>
            </Box>
        </Box>
    )
}

export default ViewProduct