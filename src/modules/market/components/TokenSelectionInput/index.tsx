import {
  Button,
  CardContent,
  Box,
  InputBase,
  Paper,
  Theme,
  Divider,
  Typography,
} from "@mui/material";
import { styled } from "@mui/styles";
import React, { FC } from "react";
import { FaChevronDown, FaEthereum } from "react-icons/fa";

const SmallTokenSelectionMenu = styled(Button)(
  ({ theme }: { theme?: Theme }) => ({
    "label + &": {
      marginTop: theme?.spacing(3),
    },
    "& 	.MuiButton-contained": {
      margin: "0px !important",
      backgroundColor: "transparent !important",
    //  border: "1px solid #eee !important",
      padding: "4px 12px !important",
      borderRadius: "5px !important",
      color: "#212121",
    },
    backgroundColor: "transparent !important",
  //  border: "1px solid #eee !important",
    padding: "4px 12px !important",
    height: "100%",
    borderRadius: "5px !important",
    color: "#212121",
  })
);

const TokenSelectInput: FC<any> = ({
  instruction,
  placeholder,
  onChange,
  value,
  tokenInfos=[],
  disabled=false,
  onKeyDownHandler = () => {}
}) => {
  return (
    <Paper
      elevation={0}
      sx={{ backgroundColor: "#fff", padding: 1 }}
    >
      <Box>
        <Typography pb={1.5} fontWeight="bold" fontSize={13}>
          {instruction}
        </Typography>

        <Paper
          elevation={0}
          component="form"
          sx={{
            border: "1px solid #ddd",
            borderRadius: 20,
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            width: 400,
          }}
        >
          <Box display='flex' alignItems='center'>
          <SmallTokenSelectionMenu
            disableRipple
            disableFocusRipple
            disableTouchRipple
            startIcon={<FaEthereum />}
            endIcon={<FaChevronDown size={12} color='#aaa' />}
          >
            DAI
          </SmallTokenSelectionMenu>
          <Divider sx={{ height: 30 }} orientation='vertical' />
          </Box>
          <InputBase
          disabled={disabled}
          onKeyDown={onKeyDownHandler}
            value={value}
            onChange={onChange}
            sx={{ ml: 1, flex: 1, p:0.5 }}
            placeholder={placeholder}
            inputProps={{ "aria-label": "search google maps" }}
          />
        </Paper>
      </Box>
    </Paper>
  );
};

export default TokenSelectInput;
