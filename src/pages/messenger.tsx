import {
  Grid,
  Container,
  Avatar,
  Paper,
  Divider,
  Button,
  IconButton,
} from "@mui/material";

import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import CircleIcon from "@mui/icons-material/Circle";
import { styled, alpha } from "@mui/material/styles";

import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { InputLabel, Input } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(2),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.mode === "light" ? "#fcfcfb" : "#2b2b2b",
    border: "1px solid #ced4da",
    fontSize: 16,
    width: "auto",
    padding: "10px 12px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

function TabPanel(props: { [x: string]: any; children: any; value: any; index: any; }) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

function Messenger() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        height: "calc(100vh - 64px)",
        padding: "100px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        sx={{
          bgcolor: "background.paper",
          display: "flex",
          width: "100%",
          height: "100%",
        }}
      >
        <Grid
          container
          direction="row"
          sx={{ flexWrap: "no-wrap", maxHeight: "100%" }}
        >
          <Grid
            item
            container
            pt={4}
            pb={2}
            xs={3.5}
            direction="column"
            justifyContent="space-around"
            alignItems="center"
            sx={{
              bgcolor: "",
              height: "100%",
              width: "100%",
              flexWrap: "no-wrap",
              borderRight: " 1px solid #ECEEF0",
            }}
          >
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg"
              sx={{
                width: 85,
                height: 85,
                justifyContent: "center",
                alignItems: "center",
              }}
            />

            <Typography>Elijah Hampton</Typography>

            <Search sx={{ marginRight: "15%" }}>
              <SearchIconWrapper sx={{ paddingLeft: "1px" }}>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>

            <Divider sx={{ width: "90%" }} />
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              visibleScrollbar={false}
              scrollButtons={false}
              sx={{
                maxHeight: "500px",
                overflow: "scroll",
                flexWrap: "no-wrap",
                width: "100%",
                paddingLeft: "15%",
              }}
            >
              <Tab
                icon={
                  <Avatar
                    alt="N"
                    src="/static/images/avatar/1.jpg"
                    sx={{ width: 35, height: 35 }}
                  />
                }
                iconPosition="start"
                label="Nathan Farley"
                {...a11yProps(0)}
                sx={{
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  fontSize: "16px",
                  borderBottom: " 3px solid #ECEEF0",
                }}
              />

              <Tab
                icon={
                  <Avatar
                    alt="K"
                    src="/static/images/avatar/1.jpg"
                    sx={{ width: 35, height: 35 }}
                  />
                }
                iconPosition="start"
                label="Kendra Gonzales"
                {...a11yProps(1)}
                sx={{
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  fontSize: "16px",
                }}
              />

              <Tab
                icon={
                  <Avatar
                    alt="J"
                    src="/static/images/avatar/1.jpg"
                    sx={{ width: 35, height: 35 }}
                  />
                }
                iconPosition="start"
                label="James Bond"
                {...a11yProps(2)}
                sx={{
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  fontSize: "16px",
                }}
              />

              <Tab
                icon={
                  <Avatar
                    alt="J"
                    src="/static/images/avatar/1.jpg"
                    sx={{ width: 35, height: 35 }}
                  />
                }
                iconPosition="start"
                label="Jason Statham"
                {...a11yProps(3)}
                sx={{
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  fontSize: "16px",
                }}
              />

              <Tab
                icon={
                  <Avatar
                    alt="S"
                    src="/static/images/avatar/1.jpg"
                    sx={{ width: 35, height: 35 }}
                  />
                }
                iconPosition="start"
                label="Shu Qi"
                {...a11yProps(4)}
                sx={{
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  fontSize: "16px",
                }}
              />

              <Tab
                icon={
                  <Avatar
                    alt="S"
                    src="/static/images/avatar/1.jpg"
                    sx={{ width: 35, height: 35 }}
                  />
                }
                iconPosition="start"
                label="Item Six"
                {...a11yProps(5)}
                sx={{
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  fontSize: "16px",
                }}
              />

              <Tab
                icon={
                  <Avatar
                    alt="I"
                    src="/static/images/avatar/1.jpg"
                    sx={{ width: 35, height: 35 }}
                  />
                }
                iconPosition="start"
                label="Item Seven"
                {...a11yProps(6)}
                sx={{
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  fontSize: "16px",
                }}
              />

              <Tab
                icon={
                  <Avatar
                    alt="E"
                    src="/static/images/avatar/1.jpg"
                    sx={{ width: 35, height: 35 }}
                  />
                }
                iconPosition="start"
                label="Item Eight"
                {...a11yProps(7)}
                sx={{
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  fontSize: "16px",
                }}
              />
            </Tabs>
          </Grid>

          <Grid item xs={8.5} sx={{ height: "100%" }}>
            <TabPanel value={value} index={0}>
              <Grid
                container
                sx={{ bgcolor: "", maxHeight: "100%" }}
                justifyContent="space-between"
              >
                <Grid
                  item
                  xs
                  container
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-start"
                  alignContent="center"
                  spacing={1}
                  sx={{ bgcolor: "", marginLeft: "0px" }}
                >
                  <Avatar
                    alt="N"
                    src="/static/images/avatar/1.jpg"
                    sx={{
                      width: 35,
                      height: 35,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: "5px",
                    }}
                  />
                  <Typography>Nathan Farley</Typography>
                </Grid>
                <Grid item sx={{ bgcolor: "" }}>
                  <Button>View Profile</Button>
                </Grid>
                <Divider sx={{ marginTop: "10px" }} />
                <Grid
                  item
                  xs={12}
                  sx={{ bgcolor: "", height: "650px", overflow: "scroll" }}
                ></Grid>
                <Divider />
                <Grid item xs={12} sx={{ bgcolor: "", maxHeight: "44px" }}>
                  <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    sx={{
                      maxHeight: "44px",
                      p: "2px 4px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="Write a message"
                      inputProps={{ "aria-label": "Write a message" }}
                    />
                    <IconButton
                      type="submit"
                      sx={{ p: "10px" }}
                      aria-label="search"
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>              
            </TabPanel>
            <TabPanel value={value} index={2}>
              Item Three
            </TabPanel>
            <TabPanel value={value} index={3}>
              Item Four
            </TabPanel>
            <TabPanel value={value} index={4}>
              Item Five
            </TabPanel>
            <TabPanel value={value} index={5}>
              Item Six
            </TabPanel>
            <TabPanel value={value} index={6}>
              Item Seven
            </TabPanel>
            <TabPanel value={value} index={7}>
              Item Eight
            </TabPanel>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default Messenger;
