import React, { FunctionComponent } from 'react'

import {
    Container,
} from "@mui/material"

import { useStyles } from '../../modules/market/MarketStyles'
import JobDisplay from '../../modules/market/components/JobDisplay';

const MyJobs: FunctionComponent = () => {
    const classes = useStyles()
    return (
        <Container maxWidth='lg' className={classes.container}>
           <JobDisplay />
        </Container>
    )
}

export default MyJobs