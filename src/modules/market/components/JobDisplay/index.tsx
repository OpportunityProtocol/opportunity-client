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

 const TAGS = ['Python', 'Web Development', 'Flash']
 
 function JobDisplay({ avatar }) {
   const classes = useStyles()
   const [relationshipMetadata, setRelationshipMetadata] = useState({
     relationshipTitle: 'Fake Title',
     relationshipTags: ['python'],
     relationshipDescription: 'Fake Description',
     relationshipStatementOfWork: 'Fake SOW',
     relationshipDefinitionsOfDone: ['Do it']
   })
 
   return (
     <Card key={Math.random()} elevation={0} sx={{ borderRadius: 2 }}>
     <CardActionArea sx={{bgcolor: 'rgb(245, 245, 245)', p: 1 }}>
        <Grid container direction='row' alignItems='center' justifyContent='space-between'>
          <Grid item>
          <div className={classes.row}>
            <CheckIcon fontSize='small' color='secondary' />
            <Typography color='secondary' variant='caption' sx={{ px: 1 }}>
                Verified on Proof of Humanity
            </Typography>
        </div>
          </Grid>

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

         <Typography paragraph color='#aaa' fontSize={13} fontWeight='medium'>
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
             <Button color='secondary' variant='text' disableElevation sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: 12, p: 1}}>
                 View Details
             </Button>
         </CardActions>
     </Card>
   )          
 }

 export default JobDisplay;
 