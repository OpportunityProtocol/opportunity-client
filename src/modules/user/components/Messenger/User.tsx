import React, { useEffect, useState } from "react";

import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../../../../firebase";
import { Avatar, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";

const User = ({ user1, user, selectUser, chat }) => {
  const user2 = user?.uid;
  const [data, setData] = useState("");

  useEffect(() => {
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
      setData(doc?.data());
    });
    return () => unsub();
  }, []);

  return (
    <>
      <Grid
        sx={{
          bgcolor: "",
          marginBottom: "10px",
          padding: "10px",
          cursor: "pointer",
          display: "flex",
          flexDirection: "row",
          textOverflow: "ellipsis",
          overflow: "hidden",
          maxWidth: "287px",
        }}
        className={`user_wrapper ${chat.name === user.name && "selected_user"}`}
        onClick={() => selectUser(user)}
      >
        <Grid
          sx={{
            bgcolor: "",
            display: "flex",
            alignItems: "center",
            maxWidth: "277px",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          <Avatar
            sx={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              marginLeft: "5px",
            }}
            src={user?.picture?.original?.url}
            alt={user?.name}
          />

          <Grid
            sx={{
              display: "flex",
              alignItems: "start",
              display: "flex",
              flexDirection: "column",
              maxWidth: "277px",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            <Box ml={1}>
            <Typography>
              Elijah Hampton
            </Typography>
            <Typography
            fontSize={12}
              sx={{
                fontWeight: "medium",
              
               // color: "#49A882",
              }}
            >
              {user.handle}
            </Typography>
            </Box>
            {data?.from !== user1 && data?.unread && (
              <Typography
                variant="h6"
                sx={{
                  marginLeft: "10px",
                  background: "#ddd",
                  color: "white",
                  padding: "2px 4px",
                  borderRadius: "10px",
                }}
              >
                New
              </Typography>
            )}

            {data?.from !== user1 && data?.unread && (
              <Typography
                sx={{
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  width: "90%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {data.text}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid
        sx={{ bgcolor: "" }}
        onClick={() => selectUser(user)}
        className={`sm_container ${chat.name === user.name && "selected_user"}`}
      ></Grid>
    </>
  );
};

export default User;
