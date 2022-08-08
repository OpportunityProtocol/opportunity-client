import React, { FunctionComponent } from 'react';

import { alpha, InputBase, Paper, styled } from '@mui/material';
import { Search } from '@material-ui/icons';

const SearchBarV1StyledInputBase = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    borderRadius: 10,
    width: '100%',
    position: 'relative',

    backgroundColor: 'inherit',
    border: 'none',
    fontSize: 14,
    height: 40,
    padding: '10px 12px',
    marginLeft: 1,
    display: 'flex',
    flex: 1,
    flexGrow: 1,
  },
}));

const SearchBarV1: FunctionComponent<any> = ({ width }) => {
  return (
      <Paper elevation={0} sx={{ width: width ? width : 'auto', minWidth: '200px', backgroundColor: '#F2F4F8', borderRadius: 10 }}>
      <SearchBarV1StyledInputBase
      startAdornment={<Search style={{ color: '#9E9E9E', marginLeft: '12px', marginRight: '1px'}} />}
       placeholder="Find gigs, anytime"
       sx={{ color: (theme) => theme.palette.text.secondary, fontWeight: 'medium' }}
       inputProps={{
        'aria-label': 'search gigs',
        style: { padding: '8px 10px',},
      }}
      />
            </Paper>
  );
};

export default SearchBarV1;
