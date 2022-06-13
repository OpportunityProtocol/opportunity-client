import React, { useEffect, useState } from "react";
import Img from "../../../../../image1.jpg";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../../../../firebase";
import { Avatar, Grid, Typography } from "@mui/material";


const User = ({ user1, user, selectUser, chat }) => {
  const user2 = user?.uid;
  const [data, setData] = useState("");

  useEffect(() => {
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
      setData(doc.data());
    });
    return () => unsub();
  }, []);

  return (
    <>
      <Grid sx={{bgcolor: '', marginBottom: '10px',  padding: '10px', cursor: 'pointer', display: 'flex', flexDirection: 'row', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '287px' }}
        className={`user_wrapper ${chat.name === user.name && "selected_user"}`}
        onClick={() => selectUser(user)}
      >
        <Grid sx={{bgcolor: '', display: 'flex'  , alignItems: 'center', maxWidth: '277px', textOverflow: 'ellipsis', overflow: 'hidden'}}>
          
            <Avatar sx={{ width: '40px', height: '40px', borderRadius: '50%', marginLeft: '5px' }} 
            src={user.avatar || Img} alt={user.name}  />

          <Grid sx={{bgcolor: '', display: 'flex' , alignItems: 'start', display: 'flex' , flexDirection: 'column', maxWidth: '277px', textOverflow: 'ellipsis', overflow: 'hidden'}}>
           
           
            <Typography  sx={{ fontSize: '16px', fontWeight: 'bold'  , marginLeft: '10px', color: '#49A882'}}>{user.name}</Typography>
            {data?.from !== user1 && data?.unread && (
              <Typography variant="h6" sx={{ marginLeft: '10px', background: '#ddd', color: 'white', padding: '2px 4px' , borderRadius: '10px'}}>
                  New
              </Typography>
            )}

            {data?.from !== user1 && data?.unread && (
          <Typography  sx={{  fontSize: '12px', whiteSpace: 'nowrap', width: '90%' , overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', flexDirection: 'row' , alignItems: 'center' }} >
            {data.text}
          </Typography>
        )}
            
          </Grid>
          
        </Grid>
       
      </Grid>
      <Grid sx={{bgcolor: ''}}
        onClick={() => selectUser(user)}
        className={`sm_container ${chat.name === user.name && "selected_user"}`}
      >
        <img 
          src={user.avatar || Img}
          alt="avatar"
          className="avatar sm_screen"
        />
      </Grid>
    </>
  );
};

export default User;