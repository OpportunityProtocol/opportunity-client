/**
* JobDisplay
*/

import React, { useState, useRef, useEffect } from "react";
import { useStyles } from './JobDisplayStyles'
 
import {
  Divider,
  Paper,
  Button,
  Box,
  Avatar,
  Chip,
  IconButton,
  Card,
  TextField,
  CardContent,
  CardActions,
  Typography,
  Grid,
  CardActionArea,
  Stack,
  CardMedia
} from '@mui/material'
 
import Blockies from 'react-blockies'
import CheckIcon from '@mui/icons-material/Check';
import { FavoriteBorder } from "@mui/icons-material";
import { useRouter } from "next/router";
import Link from 'next/Link'

interface IJobDisplayProps {
  avatar?: string,
  hasButton: boolean,
  hasSaveIcon: boolean,
}

/* Temporary Placeholders */
const TAGS = ['Python', 'Web Development', 'Flash']
 
const JobDisplay: React.FunctionComponent<IJobDisplayProps> = ({ avatar, hasButton=true, hasSaveIcon=true }) => {
   const classes = useStyles()
   const router = useRouter()

   const isService = Math.random() > .5
 
   return (
     <Card onClick={() => router.push('/contract/view')} key={Math.random()} className={classes.card} elevation={0} sx={{ borderRadius: 2 }}>
       {isService ? <CardMedia image='https://picsum.photos/seed/picsum/200/300' sx={{height: 160}} /> : 
       <Box sx={{position: 'relative', height: 160, width: '100%', bgcolor: '#65d386'}}>

      </Box>}
       <CardContent>
           <Grid container direction='row' flexWrap='nowrap' alignItems='flex-start' justifyContent='space-between'>
           <Grid item>
           <Typography component='div' pb={3}>
         <Box fontWeight='bold' fontSize={20} color='rgba(33, 33, 33, .85)'>
             {isService ? 'I will take professional photos for you' : 'Customer Service Representative'}
         </Box>
         <Typography color='#aaa' fontSize={12} fontWeight='regular'>
             Fixed Rate Payment - Budget: $23.39 - Short Term
         </Typography>
         </Typography>
           </Grid>
               
               <Grid item />

           </Grid>

         <Typography paragraph color='#808080' fontSize={15} fontWeight='semibold'>
             Lizards are a widespread group of squamate reptiles, with over 6,000
             species, ranging across all continents except Antarctica roup of squamate reptiles, with over 6,000 Lizards are a widespread
         </Typography>
 
         <Box my={1}>
           <Grid container direction='row' flexDirection='row' alignItems='center' justifyContent='flex-start'>
           {
           TAGS.map(tag => {
             return (
               <Grid item mr={1}>
                 <Chip variant='filled' sx={{fontSize: 11, backgroundColor: '#eee',  borderRadius: 1, border: 'none', fontWeight: '#eee'}} label={tag} size='small' />
               </Grid>
             )
           })
         }
           </Grid>
         </Box>
       </CardContent>
       <Box sx={{bgcolor: '#fff', p: 1 }}>
        <Grid container direction='row' alignItems='center' justifyContent='space-between'>
        <Grid item>
               <IconButton>
            <FavoriteBorder />

        </IconButton>
               </Grid>

          <Grid item>
            <Stack direction='row' alignItems='center'>
              <Typography sx={{px: 2, fontWeight: 'bold', fontSize: 14}}>
                @happytowork
              </Typography>
            <Blockies
                  seed={Math.random().toString()}
                  size={10}
                  scale={3}
                  className={classes.blockie}
                />
            </Stack>

          </Grid>

        </Grid>
       </Box>

         {/*
            TODO: If claimed the display will show general contract 
            information here and button will change to open contract details
         */}
     </Card>
   )          
 }

 export default JobDisplay;
 