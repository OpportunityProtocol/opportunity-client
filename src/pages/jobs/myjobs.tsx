import React from 'react'

import {
    Container,
} from "@mui/material"

import { useStyles } from './JobStyles'
import JobDisplay from '../../modules/market/components/JobDisplay';

const MyJobs: React.FunctionComponent = () => {
    const classes = useStyles()
    
    return (
        <Container maxWidth='lg' className={classes.container}>
           <JobDisplay />
        </Container>
    )
}

export default MyJobs