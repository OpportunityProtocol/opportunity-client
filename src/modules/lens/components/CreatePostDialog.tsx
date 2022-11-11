import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Avatar, DialogContent, Paper, TextField } from "@mui/material";
import { Box, Stack } from "@mui/system";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreatePostDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Create Post
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}

        // TransitionComponent={Transition}
      >
        <DialogContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={0}
            sx={{
                width: '500px',
             // border: "1px solid #ddd",
             boxShadow: 'none'
            }}
          >
            <Stack spacing={3} sx={{ width: '100%' }}>
                <Box component={Stack} direction='row'>
                <Avatar />
                    <Box>
                        <Typography fontSize={13}>
                            Elijah Hampton
                        </Typography>
                        <Typography fontSize={14}>
                            @hardhworker
                        </Typography>
                    </Box>
                </Box>
            
                <TextField variant='standard' placeholder='Write something to the world' />
            </Stack>
          </Paper>
        </DialogContent>
      </Dialog>
    </div>
  );
}
