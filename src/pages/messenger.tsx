
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
import { IMessageProp, ProposalMessage, RegularMessage } from "../modules/user/components/Messenger/Message";
import {
  useAccount,
} from "wagmi";
import { NextPage } from "next";

enum MessageType {
  ContractProposal,
  Regular
}

const Messenger: NextPage<any> = () => {
  const [users, setUsers] = useState<Array<any>>([]);
  const [chat, setChat] = useState<any>({});
  const [text, setText] = useState<string>("");
  const [img, setImg] = useState<string>("");
  const [msgs, setMsgs] = useState<Array<any>>([]);

  const { address, connector } = useAccount();
  const user1 = String(address).toLowerCase();

  useEffect(() => {
    const usersRef = collection(db, "users", user1, "selectedUser");
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

  const renderMessage = (idx: number, msg: IMessageProp) => {
    switch (msg?.type) {
      case MessageType.Regular:
        return <RegularMessage key={idx} msg={msg} user1={user1} />
      case MessageType.ContractProposal:
        return <ProposalMessage key={idx} msg={msg} user1={user1} />
      default:
        return <RegularMessage key={idx} msg={msg} user1={user1} />
    }
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        height: "100vh",
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
        <Grid sx={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr  3fr', overflow: 'hidden', maxHeight: '100%', width: '100%' }} >
          <Grid sx={{ borderRight: '1px solid #ddd', overflowY: 'auto', overflow: 'hidden' }}>
            <Grid
              container
              direction='column'
              alignItems="center"
              alignContent="center"
              justifyContent='space-between'
              sx={{ bgcolor: "", marginLeft: "0px", padding: '15px', marginTop: '20px', borderBottom: '1px solid #ddd', height: '25%' }}
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
              <Typography sx={{ fontSize: "20px", marginBottom: '20px' }}>Elijah Hampton</Typography>
            </Grid>
            <Grid sx={{ overflow: 'scroll', maxHeight: '473px', marginTop: '10px' }}>

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
          <Grid sx={{ position: 'relative', width: '100%' }}>
            {chat ? (
              <>
                <Box display="flex" justifyContent="space-between" alignItems='space-between' sx={{ padding: '15px', borderBottom: '1px solid #ddd' }} >
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

                <Grid sx={{ height: 'calc(100vh - 395px)', overflowY: 'auto', borderBottom: '1px solid #ddd', overflowX: 'hidden' }}>
                  {msgs.length
                    ? msgs.map((msg, idx) => renderMessage(idx, msg))
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
