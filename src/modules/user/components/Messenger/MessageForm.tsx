import React from "react";
import Attachment from './svg/Attachment';
import FormControl from '@mui/material/FormControl';
import InputBase from '@mui/material/InputBase';
import { Button, Stack, Box, Grid, Input, IconButton } from "@mui/material";

const MessageForm = ({ handleSubmit, text, setText, setImg }) => {
  return (

    <FormControl component='form' onSubmit={handleSubmit} sx={{
      position: 'fixed',
      bottom: 0,
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      height: 'auto',
      alignItems: 'center',
      padding: 1,
    }}>
     
      <Stack direction='row' alignItems='center' spacing={2} sx={{ width: '100%' }}>
        <Input
        
          fullWidth
          type="text"
          placeholder="Enter message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{
            backgroundColor: 'rgba(221, 221, 221, 0.21)',
            padding: '5px',
            borderRadius: '5px',
            outline: 'none',
            border: 'none'
          }}
        />
    
        <Button variant='contained'
          onClick={handleSubmit}>Send</Button>
      </Stack>
    </FormControl>

  );
};

export default MessageForm;