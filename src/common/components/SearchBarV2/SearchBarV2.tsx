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
    marginLeft: theme.spacing(1),
    flex: 1,
    backgroundColor: 'transparent',
    borderBottom: '1px solid #ddd',
    maxWidth: 500
  },
}));

const SearchBarV2: FunctionComponent<ISearchBarV2Props> = ({ placeholder, isFilterable=false }) => {
  const classes = useStyles();
  return (
    <Paper elevation={0} component="form" className={classes.paper}>
      <SearchBarV2StyledInputBase 
        startAdornment={<Search sx={{ mr: 2, color: '#9E9E9E' }} />}
        placeholder={placeholder}
        inputProps={{ 'aria-label': 'search gigs' }}
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
