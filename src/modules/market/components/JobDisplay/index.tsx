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
  CardActionArea
} from '@mui/material'
 
import Blockies from 'react-blockies'
import CheckIcon from '@mui/icons-material/Check';
import { FavoriteBorder } from "@mui/icons-material";
import { useRouter } from "next/router";
import Link from 'next/Link'

interface IJobDisplayProps {
  avatar?: string,
  hasButton: boolean,
  hasSaveIcon: boolean
}

const TAGS = ['Python', 'Web Development', 'Flash']
 
const JobDisplay: React.FunctionComponent<IJobDisplayProps> = ({ avatar, hasButton=true, hasSaveIcon=true }) => {
   const classes = useStyles()
   const router = useRouter()
 
   return (
     <Card key={Math.random()} elevation={0} sx={{ borderRadius: 2 }}>
     <CardActionArea sx={{bgcolor: 'rgb(245, 245, 245)', p: 1 }}>
        <Grid container direction='row' alignItems='center' justifyContent='space-between'>
          <Grid item />

          <Grid item>
          <Blockies
                  seed={Math.random().toString()}
                  size={10}
                  scale={3}
                  className={classes.blockie}
                />
          </Grid>

        </Grid>
       </CardActionArea>
       <Divider />
       <CardContent>
           <Grid container direction='row' flexWrap='nowrap' alignItems='flex-start' justifyContent='space-between'>
           <Grid item>
           <Typography component='div' pb={3}>
         <Box fontWeight='bold' fontSize={18}>
             Customer Service Representative 
         </Box>
         <Link href=''>
            <Typography className={classes.link} fontSize={12} component='span'  variant='button' color='secondary'> 
              /ipfs/QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4 
            </Typography>
          </Link>
         <Typography color='#aaa' fontSize={12} fontWeight='regular'>
             Fixed Rate Payment - Budget: $23.39 - Short Term
         </Typography>
         </Typography>
           </Grid>
               
               <Grid item>
               <IconButton>
            <FavoriteBorder fontSize='small' />
        </IconButton>
               </Grid>

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
                 <Chip variant='filled' sx={{fontSize: 11,  borderRadius: 3, border: '1px solid #eee', fontWeight: '#eee'}} label={tag} size='small' />
               </Grid>
             )
           })
         }
           </Grid>
         </Box>
       </CardContent>
       <CardActions sx={{display: 'flex', alignItems: 'center'}}>
             <Button onClick={() => router.push('/contract/view')} color='secondary' variant='text' disableElevation sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: 12, p: 1}}>
                 View Details
             </Button>
         </CardActions>
         {/*
            TODO: If claimed the display will show general contract 
            information here and button will change to open contract details
         */}
     </Card>
   )          
 }

 export default JobDisplay;
 