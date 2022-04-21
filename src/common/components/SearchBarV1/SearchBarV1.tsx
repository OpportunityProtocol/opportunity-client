import React, { FunctionComponent } from 'react'

import {
    Paper,
    InputBase,
    Button
} from '@mui/material'
import { Search } from '@mui/icons-material'

const SearchBarV1: FunctionComponent = () => {
    return (
        <Paper
              elevation={0}
              component="form"
              sx={{
                display: 'flex',
                height: 40,
                alignItems: 'center',
                width: 350,
                border: '1px solid #eee',
                borderRadius: 0,
              }}
            >
              <InputBase
                startAdornment={<Search sx={{ color: '#aaa' }} />}
                sx={{
                  borderRadius: '0px !important',
                  ml: 1,
                  flex: 1,
                  flexGrow: 1,
                  height: 30,
                  fontSize: 14,
                }}
                placeholder="Find gigs, anytime"
                inputProps={{
                  'aria-label': 'search google maps',
                  style: { padding: '0px 10px' },
                }}
              />
              <Button
                sx={{ borderRadius: '0px !important', color: '#fff', height: 40 }}
                disableElevation
                color="secondary"
                variant="contained"
              >
                Search
              </Button>
            </Paper>
    )
}

export default SearchBarV1