import React, { ChangeEvent, FunctionComponent } from "react";

import { Paper, Button, InputBase, IconButton, styled } from "@mui/material";

import FilterList from "@mui/icons-material/FilterList";
import { Search } from "@mui/icons-material";

import { useStyles } from "./SearchBarV2Style";

interface ISearchBarV2Props {
  isFilterable?: boolean;
  onClickPrimaryButton: (e) => {};
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  value: string;
}

const SearchBarV2StyledInputBase = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    flex: 1,
  },
}));

const SearchBarV2: FunctionComponent<ISearchBarV2Props> = ({
  onClickPrimaryButton,
  isFilterable = false,
  ...textInputProps
}) => {
  const classes = useStyles();
  return (
    <Paper variant="elevation" elevation={3} component="form" className={classes.paper}>
      <SearchBarV2StyledInputBase
        fullWidth
        startAdornment={<Search sx={{ mx: 1, color: "#9E9E9E" }} />}
        inputProps={{
          "aria-label": "search jobs",
          style: { padding: "4px 10px" },
        }}
        
        {...textInputProps}
      />
      <Button variant="contained" sx={{ mr: 1 }} onClick={onClickPrimaryButton}>
        Search
      </Button>
    </Paper>
  );
};

export default SearchBarV2;
