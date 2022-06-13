
import {
  Grid,
  Container,
  Avatar,
  Paper,
  Divider,
  Button,
  IconButton,
  Stack,
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
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { InputLabel, Input } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from '@mui/icons-material/Search';


import { useEffect, useState } from "react";
import { db, auth, storage } from "../../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import User from "../modules/user/components/Messenger/User";
import MessageForm from "../modules/user/components/Messenger/MessageForm";
import Message from "../modules/user/components/Messenger/Message";

const Messenger = () => {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState({});
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [msgs, setMsgs] = useState([]);

  const user1 = 0//0auth.currentUser.uid;

  useEffect(() => {
    const usersRef = collection(db, "users");
    // create query object
    const q = query(usersRef, where("uid", "not-in", [user1]));
    // execute query
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
    return () => unsub();
  }, []);

  const selectUser = async (user) => {
    setChat(user);

    const user2 = user.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    const msgsRef = collection(db, "messages", id, "chat");
    const q = query(msgsRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMsgs(msgs);
    });

    // get last message b/w logged in user and selected user
    const docSnap = await getDoc(doc(db, "lastMsg", id));
    // if last message exists and message is from selected user
    if (docSnap.data() && docSnap.data().from !== user1) {
      // update last message doc, set unread to false
      await updateDoc(doc(db, "lastMsg", id), { unread: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user2 = chat.uid;

    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    let url;
    if (img) {
      const imgRef = ref(
        storage,
        `images/${new Date().getTime()} - ${img.name}`
      );
      const snap = await uploadBytes(imgRef, img);
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = dlUrl;
    }

    await addDoc(collection(db, "messages", id, "chat"), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
    });

    await setDoc(doc(db, "lastMsg", id), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
      unread: true,
    });

    setText("");
    setImg("");
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
        <Grid sx={{  position: 'relative', display: 'grid', gridTemplateColumns: '1fr  3fr', overflow: 'hidden', maxHeight: '100%' , width: '100vw'}} >
         
        <Grid sx={{  borderRight: '1px solid #ddd', overflowY: 'auto', overflow: 'hidden'}}>
     
         
           <Grid
              
                
                  container
                  direction='column'
                  alignItems="center"
                  alignContent="center"
                  justifyContent='space-between'
                  sx={{ bgcolor: "", marginLeft: "0px" , padding: '15px', marginTop: '20px', borderBottom: '1px solid #ddd', height: '25%' }}
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

            <Typography sx={{ fontSize: "20px" , marginBottom: '20px'}}>Elijah Hampton</Typography>

        </Grid>

      
        <Grid sx={{  overflow: 'scroll', maxHeight: '473px' , marginTop: '10px'}}>
     
        {users.map((user) => (
          <User
            key={user.uid}
            user={user}
            selectUser={selectUser}
            user1={user1}
            chat={chat}
          />
        ))}
        </Grid>
      </Grid>
      <Grid sx={{ position: 'relative' , width: '100%' }}>
        {chat ? (
          <>
          <Box display="flex" justifyContent="space-between" alignItems='space-between' sx={{ padding: '15px', borderBottom: '1px solid #ddd'}} >
                        <Stack direction="row" alignItems='center'>
                        
                        <Avatar
                            alt=''
                            src="/static/images/avatar/1.jpg"
                            sx={{
                            width: 40,
                            height: 40,
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: "15px",
                            }}
                        />
                        <Typography display='flex' sx={{ fontSize: "20px" }}>
                              {chat.name}
                        </Typography>
                        </Stack>
                        <Button sx={{ fontSize: "14px" }} ><SearchIcon /></Button>
                  </Box>
                
            <Grid sx={{ height: 'calc(100vh - 395px)', overflowY: 'auto' , borderBottom: '1px solid #ddd', overflowX: 'hidden'}}>
              {msgs.length
                ? msgs.map((msg, i) => (
                    <Message key={i} msg={msg} user1={user1} />
                  ))
                : null}
            </Grid>
          
            <MessageForm
              handleSubmit={handleSubmit}
              text={text}
              setText={setText}
              setImg={setImg}
            />
          </>
        ) : (
          <Typography sx={{ fontSize: '20px', color: 'grey', textAlign: 'center' }}>Select a user to start conversation</Typography>
        )}
      </Grid>
    </Grid>

      </Paper>
    
    </Container>
  );
}

export default Messenger;


/* <Grid
container
sx={{ bgcolor: "red", height: "100%" }}
justifyContent="space-between"
>
<Grid
  item
  xs={12}
  container
  direction="row"
  alignItems="center"
  justifyContent="flex-start"
  spacing={1}
  sx={{ bgcolor: "yellow", marginLeft: "0px" }}
>
  <Avatar
    alt="N"
    src="/static/images/avatar/1.jpg"
    sx={{
      width: 35,
      height: 35,
      justifyContent: "center",
      alignItems: "center",
      marginRight: "10px",
    }}
  />
  <Typography sx={{ fontSize: "18px" }}>
    Nathan Farley
  </Typography>
</Grid>
<Grid item sx={{ bgcolor: "" }}>
  <Button>View Profile</Button>
</Grid>
<Divider sx={{ marginTop: "10px" }} />
<Grid
  item
  xs={12}
  sx={{
    bgcolor: "blue",
    display: "flex",
    flexGrow: 1,
    overflow: "scroll",
  }}
>
  H
</Grid>
<Divider />
<Grid
  item
  xs={12}
  sx={{
    bgcolor: "",
    maxHeight: "100%",
    height: "100%",
    alignSelf: "flex-end",
  }}
>
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


<Stack direction="column"  spacing={2} display='flex' justifyContent="space-between">
                  <Box display="flex" justifyContent="space-between" alignItems='space-between' >
                        <Stack direction="row" alignItems='center'>
                        <Avatar
                            alt="N"
                            src="/static/images/avatar/1.jpg"
                            sx={{
                            width: 40,
                            height: 40,
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: "10px",
                            }}
                        />
                        <Typography display='flex' sx={{ fontSize: "18px" }}>
                              Nathan Farley
                        </Typography>
                        </Stack>
                        <Button sx={{ fontSize: "14px" }} >View Profile</Button>
                  </Box>
                  <Divider />
                  <Stack  direction="row" alignItems="stretch" sx={{ flexGrow: 2 }} >
                  <Typography  alignItems="stretch"  sx={{ fontSize: "18px" }}>
                              Nathan Farley
                        </Typography>
                  </Stack>
                  <Divider />
                  
                  <Box
    component="form"
    noValidate
    autoComplete="off"
    sx={{
      maxHeight: "20px",
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
                  
              </Stack>
             

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
          sx={{ flexWrap: "no-wrap", maxheight: "100%" }}
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

            <Typography sx={{ fontSize: "20px" }}>Elijah Hampton</Typography>

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
                 />
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
          <Grid item xs={8.5} sx={{ minHeight: "100%" }}>
            <TabPanel value={value} index={0} maxHeight="379px" sx={{ minHeight: "100%", height:"100%", maxHeigh:"100%" }} height="739px">
                  <Grid  container  direction="column" justifyContent="space-between" sx={{ bgcolor: "red", height:"100%" }} spacing={1}>
                      <Grid item container direction='row' justifyContent='space-between' alignItems='center'  sx={{ bgcolor: "blue" }}>
                          <Grid item  direction="row" display="flex" alignItems='center'  sx={{ bgcolor: "green" }}> 
                              <Avatar
                                  alt="N"
                                  src="/static/images/avatar/1.jpg"
                                  sx={{
                                  width: 40,
                                  height: 40,
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginRight: "10px",
                                  }}
                              />
                              <Typography display='flex' sx={{ fontSize: "18px" }}>
                                    Nathan Farley
                              </Typography>
                          </Grid>
                              <Button sx={{ fontSize: "14px" }}>View Profile</Button>
                      </Grid>
                      <Grid item >
                      <Divider />
                      </Grid >
                      <Grid item sx={{ bgcolor: "yellow", maxHeight: '10%', height: '10%' , minHeight: "10%"}}> 

                      </Grid>
                      <Grid item >
                      <Divider />
                      </Grid >
                      
                      <Grid item justifyContent="center" sx={{ bgcolor: "pink", position: "absolute", width:'56%', top: '84%'}}>
                      <Divider sx={{ marginTop: "10px", marginBottom: "10px"}}/>
                      <Box
                      
    component="form"
    noValidate
    autoComplete="off"
    sx={{
      maxHeight: "20px",
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
              Item One
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


*/
