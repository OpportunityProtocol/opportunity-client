import React, { useRef, useEffect } from "react";
import Moment from "react-moment";
import { Card, Grid, styled, Typography, Button} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  containerOwn: {
    marginTop: '5px',
    padding: '0px 15px',
    textAlign: 'right',
    overflowWrap: 'break-word',
   },
  containerFriend: {
    marginTop: '5px',
    padding: '0px 15px',
    overflowWrap: 'break-word'
   },

  MessageOwn: {
    background: '#b8e0d0',
    color: '#333',
  
    
   },
  MessageFriend: {
    background: '#333',
   }


});

const Message = ({ msg, user1 }) => {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);

const checkMsg = msg.from === user1;
 const classes = useStyles();
  return (
  
    <Grid 
      className={checkMsg ? classes.containerOwn : classes.containerFriend}
      ref={scrollRef}
    >
     
      <Typography sx={{ fontSize: "16px", padding: '15px', display: 'inline-block' , maxWidth: '300px', textAlign: 'left', borderRadius: '5px;', marginTop: '10px', marginBottom: '10px'  }}  
        className={checkMsg ? classes.MessageOwn : classes.MessageFriend}>
        {msg.proposalPayout ? <p><h4>Proposal Payout:</h4> {msg.proposalPayout}</p> : null}
        {msg.proposalMessage ? <p><h4>Proposal Message:</h4> {msg.proposalMessage}</p> : null}
        {msg.media ? <img src={msg.media} alt={msg.text} /> : null}
        {msg.text ? msg.text : null}
        {msg.Type ? <Grid sx={{display: 'flex', justifyContent: "center", marginTop: '50px' }}><Button size="large">Accept</Button></Grid> : null}
        <br />
        <Typography sx={{ fontSize: 'smaller', display: 'inline-block', marginTop: '15px', opacity: '0.8' }}>
          <Moment fromNow>{msg.createdAt.toDate()}</Moment>
        </Typography>
      </Typography>
     
    </Grid>
   
  );
};

export default Message;




