import React, { useState } from 'react'
import clsx from 'clsx'

import {
    Box,
    Card,
    Checkbox,
    FormControlLabel,
    Button,
    FormGroup,
    Container,
    Divider,
    Grid,
    TextField,
    InputBase,
    Typography,
    Stepper,
    Step,
    StepLabel
} from "@mui/material"

import { styled } from '@mui/material/styles';

import Check from '@mui/icons-material/Check';

import BoltIcon from '@mui/icons-material/Bolt';
import DateRangeIcon from '@mui/icons-material/DateRange';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';

import { useStyles } from './ContractStyles'
import { alpha } from '@mui/material';

import Link from 'next/link'
import ClickableCard from '../../common/components/ClickableCard/ClickableCard';

const steps = ['Complete the basic information', 'Pay fees'];

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

function CustomizedSteppers() {
    return (
        <Stepper sx={{ my: 5 }} alternativeLabel activeStep={1} connector={<QontoConnector />}>
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

const Create = () => {
    const classes = useStyles()
    const [step, setStep] = useState(0)
    
    return (
        <Container maxWidth='md' sx={{padding: '1% 4%',  width: '100%' }}>
            <CustomizedSteppers />
            <Box my={2} className={classes.columnCenter}>
            <Typography fontWeight='bold' fontSize={25} py={1}>
                Post a Contract
            </Typography>
            <Card variant='outlined' sx={{ p: 2, backgroundColor: '#fafafa', width: '100%' }}>
                <Typography fontSize={14} py={1}>
                - Incase of disputes this information will be sent as evidence to Kleros courts to be arbitrated by unbiased third parties.  <Link href='/'><Typography variant='button' style={{color: '#1E88E5'}}>Learn more.</Typography></Link>
                </Typography>

                <Typography fontSize={14} py={1}>
                - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus sodales sollicitudin. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur id purus id sapien efficitur aliquam.
                </Typography>

                <Typography fontSize={14} py={1}>
                - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus sodales sollicitudin. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur id purus id sapien efficitur aliquam.
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography fontSize={14} py={1}>
                - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus sodales sollicitudin. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur id purus id sapien efficitur aliquam.
                </Typography>

                <Typography fontSize={14} py={1}>
                - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus sodales sollicitudin. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur id purus id sapien efficitur aliquam.
                </Typography>
            </Card>
            </Box>
            {step === 0 ? <CreateBasicInformation /> : <CreateValueAndFees />}
            <Divider sx={{ width: '100%' }} />
            <Grid sx={{ my: 2 }} container direction='row' alignItems='center' justifyContent='flex-end'>
              {
                step === 1 ?
                <Button sx={{ width: 120, color: '#43A047', p: 1 }} variant='outlined' onClick={() => setStep(0)}>
                  <Typography>Back</Typography>
                </Button>
                :
                null

              }
              <Grid item>
                <Button sx={{ width: 120, color: '#43A047', p: 1 }} variant='outlined' onClick={() => setStep(1)}>
                  {step === 0 ? <Typography>Next</Typography> : <Typography>Create</Typography>}
                </Button>
              </Grid>
            </Grid>
        </Container>
    )
}

const CreateBasicInformation = () => {
    const classes = useStyles()
    const [contractDuration, setContractDuration] = useState('Quick Job')

    return (
        <Box sx={{ pb: 3 }}>
            <Box sx={{ width: '100%'}}>
                <Box py={1}>
                <Typography className={classes.sectionHeader}>
                Contract Duration
            </Typography>
            <Typography variant='body2' className={classes.sectionSubheader}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tincidunt ipsum ut maximus malesuada.
            </Typography>
                </Box>

            <Grid sx={{ width: '100%' }} container spacing={3} direction='row' alignItems='center'>
            <Grid item>
                    <ClickableCard variant='outlined' className={clsx(classes.marketTypeCard, contractDuration === 'Quick Job' ? classes.selectedCard : null)}>
                        <BoltIcon />
                        <Box py={2} className={classes.columnCenter}>
                        <Typography>
                            Quick Job
                        </Typography>
                        <Typography variant='body2'>
                            Time Range: 30min - 1 Hour
                        </Typography>
                        </Box>
                    </ClickableCard>
                </Grid>

                <Grid item>
                    <ClickableCard variant='outlined' className={clsx(classes.marketTypeCard, contractDuration === 'Short Term' ? classes.selectedCard : null)}>
                        <DateRangeIcon />
                        <Box py={2} className={classes.columnCenter}>
                        <Typography>
                            Short Term Work
                        </Typography>
                        <Typography variant='body2'>
                            A few days - 1 Month
                        </Typography>
                        </Box>
                    </ClickableCard>
                </Grid>

                <Grid item>
                <ClickableCard variant='outlined' className={clsx(classes.marketTypeCard, contractDuration === 'Long Term' ? classes.selectedCard : null)}>
                    <HourglassTopIcon />
                    <Box py={2} className={classes.columnCenter}>
                    <Typography>
                        Long Term Work
                    </Typography>
                    <Typography variant='body2'>
                            A Month or Longer
                        </Typography>
                        </Box>
                    </ClickableCard>
                </Grid>
            </Grid>
            </Box>

            <Divider sx={{ my: 5}} />

            <Box>
                <Box pb={1}>
                    <Typography className={classes.sectionHeader}>
                        Basic Information
                    </Typography>
                    <Typography variant='body2' className={classes.sectionSubheader}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tincidunt ipsum ut maximus malesuada.
                    </Typography>
                </Box>

                <Grid sx={{ py: 2 }} container direction='row' alignItems='center' spacing={10}>
                    <Grid item>
                        <Typography className={classes.subSectionHeader}>
                            Title
                        </Typography>
                        <Typography variant='caption'>
                            This will be the display for your contract
                        </Typography>
                    </Grid>

                    <Grid item>
                        <BootstrapInput size='small' />
                    </Grid>
                </Grid>

                <Grid sx={{ py: 2 }} container direction='row' alignItems='flex-start' spacing={10}>
                    <Grid item>
                        <Typography className={classes.subSectionHeader}>
                            Description
                        </Typography>
                        <Typography variant='caption'>
                            This will be the display for your contract
                        </Typography>
                    </Grid>

                    <Grid item>
                    <BootstrapInput size='small' multiline rows={6} />
                    </Grid>
                </Grid>
            </Box>

            <Divider sx={{ my: 5}} />


<Box>
    <Box pb={1}>
        <Typography className={classes.sectionHeader}>
            Definition of Done
        </Typography>
        <Typography variant='body2' className={classes.sectionSubheader}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tincidunt ipsum ut maximus malesuada.
        </Typography>
    </Box>

    <BootstrapInput size='small' multiline rows={6} />
</Box>

<Divider sx={{ my: 5}} />

            <Box>
                <Box pb={1}>
                    <Typography className={classes.sectionHeader}>
                        Contract Payout Type
                    </Typography>
                    <Typography variant='body2' className={classes.sectionSubheader}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tincidunt ipsum ut maximus malesuada.
                    </Typography>
                </Box>

                <FormGroup>
                    <FormControlLabel 
                    control={<Checkbox defaultChecked />} 
                    label="Do you want to payout your contract in milestones?"
                    componentsProps={{
                        typography: {
                            fontSize: 15
                        }
                    }}
                     />
                </FormGroup>
            </Box>

        </Box>
    )
}

const CreateValueAndFees = () => {
    const classes = useStyles()

    return (
      <Box sx={{ pb: 3, width: '100%' }}>
        <Box my={2} className={classes.columnCenter}>
            <Card variant='outlined' sx={{ p: 2, width: '100%' }}>
                <Typography variant='body2'>
                  Protocol Fee: 0
                </Typography>
                <Typography variant='body2'>
                  Estimated Gas Fee: 0
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography fontWeight='bold' fontSize={15}>
                  Total: 0
                </Typography>
            </Card>
            </Box>
      </Box>
    )
}

export default Create