import React, { FunctionComponent } from 'react';

import { InputBase, styled } from '@mui/material';

const SearchBarV1StyledInputBase = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    borderRadius: 10,
    width: '100%',
    position: 'relative',
    backgroundColor: 'inherit',
    border: '1px solid #ddd',
    fontSize: 14,
    height: 40,
    padding: '10px 12px',
    marginLeft: 1,
    display: 'flex',
    flex: 1,
    color: '#212121',
    flexGrow: 1,
    '&:focus': {
      border: `2px solid ${theme.palette.primary.main}`
    },
  },
}));

const SearchBarV1: FunctionComponent = () => {
  return (
      <SearchBarV1StyledInputBase
       placeholder="Find gigs, anytime"
       inputProps={{
        'aria-label': 'search gigs',
        style: { padding: '0px 10px'},
      }}
      />
  );
};

export default SearchBarV1;
