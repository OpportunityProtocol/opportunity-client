import React from "react";
import Attachment from './svg/Attachment';
import FormControl from '@mui/material/FormControl';
import InputBase from '@mui/material/InputBase';
import { Button, Grid, Input, IconButton } from "@mui/material";

const MessageForm = ({ handleSubmit, text, setText, setImg }) => {
  return (

    <FormControl component='form' onSubmit={handleSubmit} sx={{ width: '100%', display: 'flex', flexDirection: 'row', bottom: '0',
    
    height: '30px',
    alignItems: 'center',
    margin: '15px'}}>
      
      <IconButton fontSize='small' component='label' htmlFor="img">
        <Attachment fontSize='small'/>
      </IconButton>
    
      <Input  
        onChange={(e) => setImg(e.target.files[0])}
        type="file"
        id="img"
        accept="image/*"
        style={{ display: "none"}}
      
      />
      <Grid  sx={{ width: '83%'}}>
        <Input
          fullWidth
          type="text"
          placeholder="Enter message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ backgroundColor: 'rgba(221, 221, 221, 0.21)' , width: '680px', margin: '0px 10px 0px 15px' ,
          padding: '5px',
          borderRadius: '5px',
          outline: 'none',
          border: 'none'}}
        />
      </Grid>
      <Grid>
        <Button variant='contained'
        onClick={handleSubmit}>Send</Button>
      </Grid>
    </FormControl>
    
  );
};

export default MessageForm;


/*
<form className="message_form" onSubmit={handleSubmit}>
      <label htmlFor="img">
        <Attachment />
      </label>
      <input
        onChange={(e) => setImg(e.target.files[0])}
        type="file"
        id="img"
        accept="image/*"
        style={{ display: "none" }}
      />
      <div>
        <input
          type="text"
          placeholder="Enter message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div>
        <button className="btn">Send</button>
      </div>
    </form>




    <form onSubmit={handleSubmit} sx={{ width: '100%', display: 'flex', flexDirection: 'row', bottom: '0',
    left: '20%',
    height: '30px',
    alignItems: 'center',
    margin: '15px'}}>
      
      <label htmlFor="img">
        <Attachment />
      </label>
    
      <input component='input'
        onChange={(e) => setImg(e.target.files[0])}
        type="file"
        id="img"
        accept="image/*"
        style={{ display: "none"}}
      
      />
      <Grid>
        <input component='input'
          type="text"
          placeholder="Enter message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ backgroundColor: (theme) => theme.palette.primary.light , width: '25vw', margin: '0px 10px 0px 18px' ,
          padding: '5px',
          borderRadius: '5px',
          outline: 'none',
          border: 'none'}}
        />
      </Grid>
      <Grid>
        <Button component='button'>Send</Button>
      </Grid>
    </form>



  */