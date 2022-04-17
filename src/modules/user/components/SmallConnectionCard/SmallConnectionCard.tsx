import React from 'react'
import {
    Avatar,
    Box,
    Card,
    Typography,
} from '@mui/material'

import { useStyles } from './SmallConnectionCardStyles'
import Blockies from 'react-blockies'

interface ISmallConnectionCardProps {
    avatarUri: string
}

const SmallConnectionCard: React.FunctionComponent<ISmallConnectionCardProps> = ({ avatarUri }) => {
    const classes = useStyles()

    return (
        <Card elevation={0} variant='elevation' square classes={{ root: classes.card }}>
            {avatarUri ? <Avatar sx={{ width: 50, height: 50 }} src={avatarUri} /> 
            : 
            <Blockies
            seed={Math.random().toString()}
            size={15}
            scale={3}
            className={classes.blockie}
          />}

            <Typography component='div' px={2}>
            <Box sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                        color: "#212121"
                      }}>
                        @happytowork
                      </Box>

                      <Box
                        sx={{
                          fontSize: 10,
                          color: 'rgb(94, 94, 94)'
                        }}>
                        0x4E3b49aDEf1487A08c73d47536f41Fe1c7c62137
                      </Box>
                    </Typography>
     
        </Card>
    )
}

export default SmallConnectionCard