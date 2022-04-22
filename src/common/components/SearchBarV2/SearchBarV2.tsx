import React, { FunctionComponent } from 'react';

import { Paper, InputBase, IconButton } from '@mui/material';

import FilterList from '@mui/icons-material/FilterList';
import { Search } from '@mui/icons-material';

import { useStyles } from './SearchBarV2Style';

interface ISearchBarV2Props {
  placeholder: string;
}

const SearchBarV2: FunctionComponent<ISearchBarV2Props> = ({ placeholder }) => {
  const classes = useStyles();
  return (
    <Paper elevation={0} component="form" className={classes.paper}>
      <InputBase
        startAdornment={<Search sx={{ mr: 2, color: '#9E9E9E' }} />}
        className={classes.inputBase}
        placeholder={placeholder}
        inputProps={{ 'aria-label': 'Search content' }}
      />
      <IconButton type="submit" className={classes.iconButton} aria-label="search">
        <FilterList />
      </IconButton>
    </Paper>
  );
};

export default SearchBarV2;
