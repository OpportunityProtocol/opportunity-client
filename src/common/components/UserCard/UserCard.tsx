import React from 'react'
import { IUserCardProps } from '../../interface'

import { 
    Card, 
    CardContent, 
    Avatar, 
    Button, 
    Box, 
    Stack, 
    Typography, 
    Divider,
    CardActions 
} from '@mui/material'
import { useStyles } from './UserCardStyles'

const UserCard : React.FunctionComponent<IUserCardProps> = ({ name, email, avatar, address }) => {
    const classes = useStyles()

    return (
        <Card variant='outlined'>
            <CardContent>
                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                    <Box>
                    <Typography fontSize={15} variant='subtitle2' className={classes.name}>
                        {name} (232 Connections) - <Typography variant='caption' color='#aaa'> Most active in Writing & Translation </Typography>
                    </Typography>
                    <Typography variant='body2' color='rgb(94, 94, 94)'>
                        {email}
                    </Typography>
                    </Box>

                    <Avatar src={avatar} />
                </Stack>
                <Typography paragraph color='rgb(94, 94, 94)' variant='body2' pt={2}>
                My name is Ann Smith. I am a senior in high school. Everyone can agree that I am a good student and that I like to study. My favorite subjects are chemistry and biology. I am going to enter the university because my goal is to study these subjects in future and to become a respected professional in one of the fields.
                </Typography>
            </CardContent>
            <Divider />
            <CardActions>
                <Button variant='text' color='secondary'>
                    See profile
                </Button>
            </CardActions>
        </Card>
    )
}

export default UserCard