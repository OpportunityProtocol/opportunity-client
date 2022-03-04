import React from 'react'
import {
    Card,
    Typography,
    Box,
    Button,
    Paper,
    CardContent,
    CardActions,
} from '@mui/material'
import Blockies from 'react-blockies'

import { useStyles } from './BountySubmissionStyles'
import Link from 'next/link'

const BountySubmission: React.FunctionComponent<any> = () => {
    const classes = useStyles()

    return (
        <Card variant='outlined' sx={{ my: 1 }}>
            <CardContent>
                <Box display='flex' alignItems='center'>
                <Blockies
                  seed="Max"
                  size={10}
                  scale={3}
                  className={classes.blockie}
                />

                <Typography px={1} fontWeight='medium' fontSize={15}>
                    Elijah Hampton
                </Typography>
                </Box>

                <Typography pt={2} fontSize={14} paragraph>
                    Elijah Hampton has submitted a piece of work to this bounty.  You can review the submission at:{" "}
                    <Link href=''>
                        <Typography className={classes.link} fontSize={12} component='span'  variant='button' color='secondary'> 
                            /ipfs/QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4 
                        </Typography>
                    </Link>
                </Typography>
            </CardContent>
            <CardActions>
                <Button sx={{margin: '0px !important', fontWeight: 'bold'}} color='secondary' size='small' variant='text'>
                    Accept Submission
                </Button>
                </CardActions>
        </Card>
    )
}

export default BountySubmission