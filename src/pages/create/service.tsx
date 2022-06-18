import { Box, Grid, Tab, Tabs, InputAdornment } from '@mui/material'
import { NextPage } from 'next'
import React from 'react'


import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Check from '@mui/icons-material/Check';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { Button, Container, TextField, Typography } from '@mui/material';
import MarketDisplay from '../../modules/market/components/MarketDisplay';
import ImageIcon from '@mui/icons-material/Image'
import SearchBarV2 from '../../common/components/SearchBarV2/SearchBarV2';
import { Add } from '@material-ui/icons';

const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 10,
      left: 'calc(-50% + 16px)',
      right: 'calc(50% + 16px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.primary.main,
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.primary.main,
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
      borderTopWidth: 5,
      borderRadius: 8,
    },
  }));
  
  const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(
    ({ theme, ownerState }) => ({
      color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
      display: 'flex',
      height: 22,
      alignItems: 'center',
      ...(ownerState.active && {
        color: theme.palette.primary.main,
      }),
      '& .QontoStepIcon-completedIcon': {
        color: theme.palette.primary.main,
        zIndex: 1,
        fontSize: 18,
      },
      '& .QontoStepIcon-circle': {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
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
  

const CreateServicePage: NextPage<any, any> = (): JSX.Element => {
    const steps = ['Create a service', 'Deploy to the network']
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

    return (
        <Container component={Stack} spacing={5} maxWidth='lg' sx={{ bgcolor: '#fff', padding: '2% 4% !important', }}>
            <Stepper alternativeLabel activeStep={1} connector={<QontoConnector />}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel> 
          </Step>
        ))}
      </Stepper>

      <Box pt={3}>
        <Typography fontWeight='bold' fontSize={25}>
            Create a service
        </Typography>
        <Typography color='text.secondary'>
        Create a service to share across lens social networks. <Typography variant='button' color='primary'>Learn more</Typography>
        </Typography>
      </Box>

      <Box>
        <Stack direction='row' alignItems='center' justifyContent='space-between'>
        <Typography width={600} fontWeight='700' fontSize={18} color='text.primary'>
            Select a market
        </Typography>

        <SearchBarV2 />
        </Stack>

        <Grid container direction='row' alignItems='center' justifyContent='space-between'>
            <Grid item xs={2.8}>
            <MarketDisplay selected={true} selectable onSelect={() => {}} market='Writing and Translation' showDescription={false} showStats={false} />
            </Grid>

            <Grid item xs={2.8}>
            <MarketDisplay selectable onSelect={() => {}} market='Accounting and Finance' showDescription={false} showStats={false} />
            </Grid>

            <Grid item xs={2.8}>
            <MarketDisplay selectable onSelect={() => {}} market='Social Media' showDescription={false} showStats={false} />
            </Grid>

            <Grid item xs={2.8}>
            <MarketDisplay selectable onSelect={() => {}} market='Graphic Design' showDescription={false} showStats={false} />
            </Grid>
        </Grid>
      </Box>


    <Box >
    <Box mt={6}>
      <Typography fontWeight='700' fontSize={18}  color='text.primary'>
            Basic Information
        </Typography>
        <Typography  fontSize={15} color='text.secondary'>
        Create a service to share across lens social networks
        </Typography>
        </Box>

        <Stack spacing={2}>
        <TextField margin='normal' sx={{ width: 400,}} variant='outlined' label='Service Title' aria-label='Pick a title for your service' />

<TextField margin='normal' rows={6} multiline sx={{ width: 400,}} variant='outlined' label='Service Description' aria-label='Pick a title for your service' />

        </Stack>

        <Box my={1.5}>
            <Button variant='text' startIcon={<Add />}>
                Add Tags
            </Button>
        </Box>


      </Box>




      <Box>
      <Typography fontWeight='700' fontSize={18} py={1} color='text.primary'>
          Add a thumbnail
        </Typography>
        <Box sx={{ width: '100%', border: 'dashed 1px #B3B3B3', padding: 10 }}>
            <Stack alignItems='center'>
            <ImageIcon fontSize='large' sx={{ color: '#aaa', width: 80, height: 80 }} />
            <Box py={2} display='flex' flexDirection='column' alignItems='center'>
            <Typography py={1} fontSize={30} fontWeight='bold' >
            Drag and drop an image, or <Typography fontSize={30} fontWeight='bold' component='span' color='primary'>Browser</Typography>
            </Typography>
            <Typography fontSize={22} fontWeight='medium' color='text.secondary'>
            Max 6MB each (12mb for videos)
            </Typography>
            </Box>
           
            </Stack>
        </Box>
      </Box>

      <Box sx={{ width: '100%' }}>
      <Typography fontWeight='700' fontSize={18} py={1} color='text.primary'>
           Offers (Max 6)
        </Typography>
           <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Beginner" {...a11yProps(0)} />
          <Tab  label="Business" {...a11yProps(1)} />
          <Tab label="Enterprise" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <Box sx={{ width: '100%'}}>
      <TabPanel value={value} index={0} sx={{ width: '100%' }}>
        <TextField placeholder='19.99' label='Beginner Price' margin='normal' size='small'  InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>
        }} sx={{ width: 'auto' }} />
       <Grid justifyContent='space-between' container direction='row' sx={{ width: '100%' }} flexWrap='wrap'>
            <Grid item xs={5.8}>
                <TextField label='Offer One' margin='dense' variant='filled' fullWidth />
            </Grid>

            <Grid item xs={5.8}>
                <TextField label='Offer One' margin='dense' variant='filled' fullWidth />
            </Grid>

            <Grid item xs={5.8}>
                <TextField label='Offer One' margin='dense' variant='filled' fullWidth  />
            </Grid>

            <Grid item xs={5.8}>
                <TextField label='Offer One' margin='dense' variant='filled' fullWidth  />
            </Grid>

            <Grid item xs={5.8}>
                <TextField label='Offer One' margin='dense'variant='filled' fullWidth  />
            </Grid>

            <Grid item xs={5.8}>
                <TextField label='Offer One' margin='dense' variant='filled' fullWidth />
            </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <TextField placeholder='59.99' label='Business Price' margin='normal' size='small' InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>
        }} sx={{ width: 'auto' }} />
      <Grid justifyContent='space-between' container direction='row' sx={{ width: '100%' }} flexWrap='wrap'>
            <Grid item xs={5.8}>
                <TextField label='Offer One' margin='dense' variant='filled' fullWidth />
            </Grid>

            <Grid item xs={5.8}>
                <TextField label='Offer One' margin='dense' variant='filled' fullWidth />
            </Grid>

            <Grid item xs={5.8}>
                <TextField label='Offer One' margin='dense' variant='filled' fullWidth  />
            </Grid>

            <Grid item xs={5.8}>
                <TextField label='Offer One' margin='dense' variant='filled' fullWidth  />
            </Grid>

            <Grid item xs={5.8}>
                <TextField label='Offer One' margin='dense'variant='filled' fullWidth  />
            </Grid>

            <Grid item xs={5.8}>
                <TextField label='Offer One' margin='dense' variant='filled' fullWidth />
            </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={2}>
      <TextField placeholder='99.99' label='Enterprise Price' margin='normal' size='small' InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>
        }} sx={{ width: 'auto' }} />
      <Grid justifyContent='space-between' container direction='row' sx={{ width: '100%' }} flexWrap='wrap'>
            <Grid item xs={5.8}>
                <TextField label='Offer One' margin='dense' variant='filled' fullWidth />
            </Grid>

            <Grid item xs={5.8}>
                <TextField label='Offer One' margin='dense' variant='filled' fullWidth />
            </Grid>

            <Grid item xs={5.8}>
                <TextField label='Offer One' margin='dense' variant='filled' fullWidth  />
            </Grid>

            <Grid item xs={5.8}>
                <TextField label='Offer One' margin='dense' variant='filled' fullWidth  />
            </Grid>

            <Grid item xs={5.8}>
                <TextField label='Offer One' margin='dense'variant='filled' fullWidth  />
            </Grid>

            <Grid item xs={5.8}>
                <TextField label='Offer One' margin='dense' variant='filled' fullWidth />
            </Grid>
        </Grid>
      </TabPanel>
      </Box>
      </Box>

    <Stack direction='row' alignItems='center' justifyContent='space-between'>
    <Button variant='outlined' disabled>
        Back
      </Button>

    <Button variant='contained'>
        Next
      </Button>
    </Stack>


        </Container>
    )
}

export default CreateServicePage