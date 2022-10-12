import { MoreHorizOutlined } from "@mui/icons-material";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Card,
  CardContent,
  Stack,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  alpha,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import fleek from "../../../../fleek";


const UserCard: FC = ({ freelancer }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [metadata, setMetadata] = useState<any>({})

  useEffect(() => {
    async function downloadMetadata() {
      if (freelancer?.metadata) {
        fleek.getUser(freelancer?.metadata?.slice(10)).then((data) => setMetadata(data))
      }
    }

    downloadMetadata().catch(error => console.log(error)).finally(() => setLoading(false))

  }, [freelancer?.metadata])

  return (
    <Grid item xs={4}>
      <Card onClick={() => { }} variant='outlined' sx={{ boxShadow: 'rgba(0, 0, 0, 0.1) -4px 9px 25px -6px', cursor: 'pointer', border: `1px solid #eee` }}>
        <CardContent>
          <Box py={1.5} display='flex' alignItems='flex-start' justifyContent='space-between'>
            <Stack spacing={2} direction='row' alignItems='center'>
              <Avatar src={freelancer?.imageURI} sx={{ width: 60, height: 60, border: `1px solid ${alpha("#b8e0d0", 0.5)}` }} />

              <Box >
                <Typography sx={{ height: 22, maxWidth: 75, textOverflow: 'ellipsis', overflow: 'hidden' }} fontWeight='bold' fontSize={12}>
                  {freelancer?.handle}
                </Typography>
                <Chip sx={{ py: 1, borderRadius: 1, color: '#757575', maxWidth: 100, fontSize: 12 }} size='small' variant='filled' label={freelancer?.address} />
              </Box>
            </Stack>

            <>
              <IconButton onClick={() => { }}>
                <MoreHorizOutlined sx={{ color: '#757575' }} />
              </IconButton>
              <Menu>
                <MenuItem>View Profile</MenuItem>
              </Menu>
            </>

          </Box>
          <Box>
            <Typography color='text.secondary' variant='body2' paragraph sx={{ height: 40 }} fontSize={12}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box display='flex' alignItems='center' justifyContent='space-between'>
            <Box>
              <Typography color='#757575' fontSize={12} fontWeight='600'>
                Worth
              </Typography>
              <Typography fontSize={10}>
                0.00
              </Typography>
            </Box>

            {/* Right side placeholder */}
            <Box />
          </Box>

        </CardContent>
      </Card>
    </Grid>
  );
};

export default UserCard
