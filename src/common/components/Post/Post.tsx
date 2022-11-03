import { Comment, CommentOutlined, PostAdd, PostAddOutlined } from "@mui/icons-material"
import { Avatar, Card, CardContent, Stack, Typography, Box, CardActions, IconButton } from "@mui/material"
import { FC } from "react"

const Post: FC<any> = ({ }) => {
    return (
        <Card variant='outlined' sx={{ border: 'none', cursor: 'pointer', width: '100%' }}>
            <CardContent>
                <Stack mb={2} direction='row' alignItems='center' sx={{ width: '100%' }}>
                <Stack spacing={1} direction='row' alignItems='center' sx={{ width: '100%' }}>
                    <Avatar />
                    <Box>
                        <Typography fontWeight='500' fontSize={14} variant='subtitle1'>
                           Elijah Hampton
                        </Typography>
                        <Typography color='primary' variant='subtitle2'>
                            @hardworker.lens
                        </Typography>
                    </Box>
                </Stack>

                <Typography variant='caption'>
                    5 minutes ago
                </Typography>
                </Stack>

                <Typography paragraph variant='body2'>
                    A very cool post on Lens Protocol!
                </Typography>
            </CardContent>
            <CardActions>
                <IconButton size='small'>
                    <PostAddOutlined fontSize='small' />
                </IconButton>

                <IconButton size='small'>
                    <CommentOutlined fontSize='small' />
                </IconButton>
            </CardActions>
        </Card>
    )
}

export default Post