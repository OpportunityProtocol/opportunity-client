import React, { FC, useRef, useEffect, useState } from "react";
import Moment from "react-moment";
import { Card, Grid, styled, Typography, Box, Button, DialogContentText } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useContractWrite } from "wagmi";
import { DAI_ADDRESS, NETWORK_MANAGER_ADDRESS, ZERO_ADDRESS } from "../../../../constant";
import { DaiInterface, NetworkManagerInterface } from "../../../../abis";
import { CHAIN_ID } from "../../../../constant/provider";
import { ConfirmationDialog } from "../../../../common/components/ConfirmationDialog";
import { BigNumber } from "ethers";
import { useSelector } from "react-redux";
import { selectUserAddress } from "../../userReduxSlice";

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

interface IRegularMessageData { }
interface IProposalMessageData {
  proposalPayout: string;
  proposalMessage: string;
  proposedWorker: string;
  contractId: number;
}
interface IMessageProp {
  text: string;
  from: string;
  to: string;
  createdAt: Date;
  data: IProposalMessageData | IRegularMessageData;
  type: any;
}

interface IProposalMessageProps {
  msg: IMessageProp;
  user1: string;
}

interface IRegularMessageProps {
  msg: IMessageProp;
  user1: string;
}


const ProposalMessage: FC<IProposalMessageProps> = ({ msg, user1 }) => {
  const classes = useStyles();
  const scrollRef = useRef();
  const [confirmationDialogState, setConfirmationDialogState] = useState<any>({
    open: false,
    success: false,
    loading: false
  })
  const userAddress = useSelector(selectUserAddress)

  const checkMsg = msg.from === user1;

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);

  const { write: approveDaiTransfer, status: approveDaiTransferStatus } = useContractWrite({
    addressOrName: DAI_ADDRESS,
    contractInterface: DaiInterface,
    functionName: "approve",
    mode: "recklesslyUnprepared",
    chainId: CHAIN_ID,
    args: [NETWORK_MANAGER_ADDRESS, msg?.data?.proposalPayout],
    overrides: {
      gasLimit: BigNumber.from("2000000"),
      gasPrice: 90000000000,  
    },
    onSuccess(data, variables, context) {
      setConfirmationDialogState({
        ...confirmationDialogState,
        loading: true,
        error: false
      })
      acceptProposal()
      alert('Successful dai transfer!')
    },
    onError(error, variables, context) {
      setConfirmationDialogState({
        ...confirmationDialogState,
        loading: false,
        success: false,
        error: true
      })
        alert('Error dai transfer!')
    },
  })


  const { write: acceptProposal, status: acceptProposalStatus } = useContractWrite({
    addressOrName: NETWORK_MANAGER_ADDRESS,
    contractInterface: NetworkManagerInterface,
    functionName: "grantProposalRequest",
    chainId: CHAIN_ID,
    mode: "recklesslyUnprepared",
    args: [msg?.data?.contractId, msg?.data?.proposedWorker, msg?.data?.proposalPayout],
    overrides: {
      gasLimit: BigNumber.from("2000000"),
      gasPrice: 90000000000,  
    },
    onSuccess(data, variables, context) {
      setConfirmationDialogState({
        ...confirmationDialogState,
        loading: false,
        success: true,
        open: false,
        error: false
      })
      alert('Accept proposal success')
    },
    onError(error, variables, context) {
      setConfirmationDialogState({
        ...confirmationDialogState,
        loading: false,
        success: false,
        error: true
      })
        alert('Accept proposal error')
    },
  })

  const confirmationDialogContent = [
    <DialogContentText id="alert-dialog-description">
      <Typography fontSize={20} fontWeight="bold" py={1}>
        {" "}
        You are about to accept a contract proposal.
      </Typography>

      <ul>
        <li>
          {" "}
          <Typography>Signing a transaction</Typography>
        </li>
        <li>
          {" "}
          <Typography>Approving the funds</Typography>
        </li>
        <li>
          <Typography>Executing the transaction</Typography>
        </li>
      </ul>
    </DialogContentText>,

    <DialogContentText id="alert-dialog-description">
      <Box py={2}>
        <Typography fontSize={20} fontWeight="bold" py={1}>
          Accept Proposal
        </Typography>
        <Typography variant="subtitle2">
          Your wallet will prompt you to approve dai and then confirm the transaction. Only accept
          transaction from addresses you trust.
        </Typography>
      </Box>
    </DialogContentText>,
  ];

  return (
    <Grid
      className={checkMsg ? classes.containerOwn : classes.containerFriend}
      ref={scrollRef}
    >
      <Typography sx={{ fontSize: "16px", padding: '15px', display: 'inline-block', maxWidth: '300px', textAlign: 'left', borderRadius: '5px;', marginTop: '10px', marginBottom: '10px' }}
        className={checkMsg ? classes.MessageOwn : classes.MessageFriend}>
        {msg.proposalPayout ? <p><h4>Proposal Payout:</h4> {msg.proposalPayout}</p> : null}
        {msg.proposalMessage ? <p><h4>Proposal Message:</h4> {msg.proposalMessage}</p> : null}
        {msg.media ? <img src={msg.media} alt={msg.text} /> : null}
        {msg.text ? msg.text : null}
        {(String(userAddress).toLowerCase() === String(msg?.from).toLowerCase() || String(userAddress).toLowerCase() === String(ZERO_ADDRESS).toLowerCase()) ? null :  <Grid sx={{ display: 'flex', justifyContent: "center", marginTop: '50px' }}><Button size="large" onClick={() => setConfirmationDialogState({ ...confirmationDialogState, open: true })}>Accept</Button></Grid> }
       
        <br />
        <Typography sx={{ fontSize: 'smaller', display: 'inline-block', marginTop: '15px', opacity: '0.8' }}>
          <Moment fromNow>{msg.createdAt.toDate()}</Moment>
        </Typography>
      </Typography>

      <ConfirmationDialog open={confirmationDialogState.open} onOpen={() => {}} onClose={() => { setConfirmationDialogState({ ...confirmationDialogState, open: false })}} primaryAction={approveDaiTransfer} primaryActionTitle='Accept Proposal' hasSigningStep={false} content={confirmationDialogContent} success={confirmationDialogContent.success} loading={confirmationDialogContent.loading} />
    </Grid>
  )
}

const RegularMessage: FC<IRegularMessageProps> = ({ msg, user1 }) => {
  const classes = useStyles();
  const scrollRef = useRef();

  const checkMsg = msg.from === user1;

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);


  return (
    <Grid
      className={checkMsg ? classes.containerOwn : classes.containerFriend}
      ref={scrollRef}
    >
      <Typography sx={{ fontSize: "16px", padding: '15px', display: 'inline-block', maxWidth: '300px', textAlign: 'left', borderRadius: '5px;', marginTop: '10px', marginBottom: '10px' }}
        className={checkMsg ? classes.MessageOwn : classes.MessageFriend}>
        {msg.media ? <img src={msg.media} alt={msg.text} /> : null}
        {msg.text ? msg.text : null}
        <br />
        <Typography sx={{ fontSize: 'smaller', display: 'inline-block', marginTop: '15px', opacity: '0.8' }}>
          <Moment fromNow>{msg.createdAt.toDate()}</Moment>
        </Typography>
      </Typography>

    </Grid>
  )
}

export { ProposalMessage, RegularMessage, IRegularMessageData, IProposalMessageData, IMessageProp, IProposalMessageProps, IRegularMessageProps }




