import React, {
  FC
} from "react";

import {
  Box,
  Button,
  Typography,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

interface IAuthenticationDialogProps {
  modelopen: boolean;
  handlesClose: () => void;
  connectData: any;
}

const AuthenticationDialog: FC<IAuthenticationDialogProps>  = ({ modelopen, handlesClose, connectData }) => {
  return (
    <Dialog
    sx={{ width: "100%", maxWidth: "425" }}
    open={modelopen}
    onClose={handlesClose}
  >
    <DialogContent
      sx={{
        border: "1px solid #eee",
        bordeRadius: "0.5rem",
        padding: "48px 56px",
      }}
    >
      <CloseIcon
        fontSize="large"
        onClick={handlesClose}
        sx={{
          padding: "0px",
          height: "20px",
          position: "absolute",
          right: "17px",
          top: "17px",
          width: "20px",
          cursor: "pointer",
        }}
      />
      <Box my={2}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0px",
            fontSize: 25,
            fontWeight: "600",
          }}
        >
          Login
        </DialogTitle>
        <Typography variant="caption">
          New to Lens Talent? Start by connecting a wallet.
        </Typography>
      </Box>

      <div>
        {connectData.connectors.slice(-2, 1).map((connector) => (
          <Button
            variant="outlined"
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connectData.connect({ connector })}
            sx={{
              paddingLeft: "24px",
              paddingRight: "163px",
              paddingTop: "15px",
              border: "1px solid #ddd",
              paddingBottom: "15px",
              borderRadius: "0.1875rem",
            }}
          >
            <img
              src="/assets/images/metamaskconnect.png"
              alt="metamaskwalletlogo"
              style={{ width: 28, height: 28 }}
            />
            <Typography
              sx={{
                fontFamily: "sans-serif",
                fontStyle: "normal",

                lineHeight: "normal",
                fontSize: "0.875rem",
                fontWeight: "700",
                color: "#000000",
                marginLeft: "1.3125rem",
              }}
            >
              Login with {connector.name}
              {connectData.status === "loading" &&
                connector.id === connectData.pendingConnector?.id &&
                " (connecting)"}
            </Typography>
          </Button>
        ))}

        <Divider>
          <Typography
            sx={{
              fontFamily: "sans-serif",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "normal",
              fontSize: "0.75rem",
              alignItems: "center",
              justifyContent: "center",
              margin: "2rem 0;",
            }}
          >
            OR
          </Typography>
        </Divider>
        {connectData.connectors.slice(1).map((connector) => (
          <Button
            variant="outlined"
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connectData.connect({ connector })}
            sx={{
              paddingLeft: "24px",
              paddingRight: "122px",
              border: "1px solid #ddd",
              paddingTop: "12px",
              paddingBottom: "12px",
              borderRadius: "0.1875rem",
            }}
          >
            <img
              src="/assets/images/coinbaseconnect.png"
              alt="coinbasewalletlogo"
              style={{ width: 28, height: 28 }}
            />

            <Typography
              sx={{
                fontFamily: "sans-serif",
                fontStyle: "normal",

                lineHeight: "normal",
                fontSize: "0.875rem",
                fontWeight: "700",
                color: "#000000",
                marginLeft: "1.3125rem",
              }}
            >
              Login with {connector.name}
              {!connector.ready && " (unsupported)"}
              {connectData.status === "loading" &&
                connector.id === connectData.pendingConnector?.id &&
                " (connecting)"}
            </Typography>
          </Button>
        ))}
        {connectData.error && <div>{connectData.error.message}</div>}
      </div>
      <Box mt={2}>
        <Typography variant="caption">
          Want to learn more about Lens Talent?{" "}
          <Typography
            component="span"
            variant="caption"
            color="primary"
            sx={{ cursor: "pointer" }}
          >
            {" "}
            Read our guide{" "}
          </Typography>
        </Typography>
      </Box>
    </DialogContent>
  </Dialog>
  )
}

export default AuthenticationDialog