import React, { ChangeEvent, FunctionComponent } from "react";

import { alpha, InputBase, Paper, styled } from "@mui/material";
import { Search } from "@material-ui/icons";

const SearchBarV1StyledInputBase = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    borderRadius: 10,
    minWidth: "100% !important",
    width: "100%",
    border: "none",
    fontSize: 14,
    height: 40,
    padding: "10px 12px",
    marginLeft: 1,
    display: "flex",
    flex: 1,
    flexGrow: 1,
  },
}));

interface SearchBarV1 {
  width: string | number;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  value: string;
}

const SearchBarV1: FunctionComponent<any> = ({ width, ...inputProps }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        width: width ? width : "auto",
        border: "1px solid #ddd",
        minWidth: "200px",
        backgroundColor: "rgb(247, 247, 250)",
        borderRadius: 2,
      }} 
    >
      <SearchBarV1StyledInputBase
        startAdornment={
          <Search
            style={{ color: "#9E9E9E", marginLeft: "12px", marginRight: "1px" }}
          />
        }
        sx={{
          color: (theme) => theme.palette.text.secondary,
          fontWeight: "medium",
          width: "100%",
        }}
        inputProps={{
          "aria-label": "search jobs",
          style: { padding: "4px 10px" },
        }}
        {...inputProps}
      />
    </Paper>
  );
};

export default SearchBarV1;
