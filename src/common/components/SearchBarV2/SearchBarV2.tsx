import React, { FunctionComponent } from 'react';

import { Paper, InputBase, IconButton, styled } from '@mui/material';

import FilterList from '@mui/icons-material/FilterList';
import { Search } from '@mui/icons-material';

import { useStyles } from './SearchBarV2Style';

interface ISearchBarV2Props {
  placeholder: string;
  isFilterable?: boolean;
}

const SearchBarV2StyledInputBase = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    flex: 1,
    backgroundColor: 'transparent',
    borderBottom: '1px solid #eee',
  },
}));

const SearchBarV2: FunctionComponent<ISearchBarV2Props> = ({ placeholder, isFilterable=false }) => {
  const classes = useStyles();
  return (
    <Paper elevation={0} component="form" className={classes.paper}>
      <SearchBarV2StyledInputBase 
      fullWidth
        startAdornment={<Search sx={{mr: 1, color: '#9E9E9E' }} />}
        placeholder={placeholder}
        inputProps={{ 'aria-label': 'search' }}
      />
      {isFilterable && (
        <IconButton type="submit" className={classes.iconButton} aria-label="search">
          <FilterList />
        </IconButton>
      )}
    </Paper>
  );
};

export default SearchBarV2;
