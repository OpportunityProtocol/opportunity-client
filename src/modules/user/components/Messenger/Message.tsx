import React, { FC, useRef, useEffect, useState } from "react";
import Moment from "react-moment";
import { Card, Grid, styled, Typography, Box, List, ListItem, ListItemText, Button, Stack, DialogContentText, AvatarGroup, Avatar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useContractWrite } from "wagmi";
import { DAI_ADDRESS, NETWORK_MANAGER_ADDRESS, ZERO_ADDRESS } from "../../../../constant";
import { DaiInterface, NetworkManagerInterface } from "../../../../abis";
import { CHAIN_ID } from "../../../../constant/provider";
import { ConfirmationDialog } from "../../../../common/components/ConfirmationDialog";
import { BigNumber } from "ethers";
import { useSelector } from "react-redux";
import { selectUserAddress } from "../../userReduxSlice";
import { ApolloQueryResult, QueryResult, useQuery } from "@apollo/client";
import { GET_CONTRACT_BY_ID } from "../../../contract/ContractGQLQueries";

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
    background: 'rgb(241, 243, 244)',
    color: '#333',


  },
  MessageFriend: {
    background: '#eee',
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
  const [contractState, setContractState] = useState<number>(-1)
  const userAddress = useSelector(selectUserAddress)

  const checkMsg = msg.from === user1;

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);

  const contractQuery: QueryResult = useQuery(GET_CONTRACT_BY_ID, {
    variables: {
      contractId: msg.data?.contractId
    }
  })

  useEffect(() => {
    contractQuery.refetch().then((result: ApolloQueryResult<any>) => {
      const contract = result.data?.contract
      setContractState(contract?.ownership)
    })
  }, [msg.data?.contractId])

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
    },
    onError(error, variables, context) {
      setConfirmationDialogState({
        ...confirmationDialogState,
        loading: false,
        success: false,
        error: true
      })
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
  
    },
    onError(error, variables, context) {
      setConfirmationDialogState({
        ...confirmationDialogState,
        loading: false,
        success: false,
        error: true
      })
      
    },
  })

  const confirmationDialogContent = [
    <DialogContentText id="alert-dialog-description">
      <Typography fontSize={20} fontWeight="bold" py={1}>
        {" "}
        You are about to accept a contract proposal. This will involve:
      </Typography>

      <List>
        <ListItem>
          <ListItemText primary="Signing a transaction" secondary="Your wallet provider will instruct you to sign the transaction." />
        </ListItem>

        <ListItem>
          <ListItemText primary="Approving the funds" secondary="This will approve Lens Talent to move the appropriate funds out of your wallet and into an escrow." />
        </ListItem>

        <ListItem>
          <ListItemText primary="Executing the transaction" secondary="Finally, you will confirm your transaction. A message will appear in your wallet provider to confirm." />
        </ListItem>
      </List>

    </DialogContentText>,

    <DialogContentText id="alert-dialog-description">
      <Box py={2}>
        <Typography fontSize={20} fontWeight="bold" py={1}>
          Accept Proposal
        </Typography>
        <Typography variant="subtitle2">
          Once you accept the proposal your wallet provider will be ask you to confirm the transactions.
        </Typography>
      </Box>
    </DialogContentText>
  ];

  return (
    <Grid
      className={checkMsg ? classes.containerOwn : classes.containerFriend}
      ref={scrollRef}
    >
      
      <Box className={checkMsg ? classes.MessageOwn : classes.MessageFriend} sx={{ padding: '15px', display: 'inline-block', maxWidth: '300px', textAlign: 'left', borderRadius: '5px;', marginTop: '10px', marginBottom: '10px' }}>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
      <Typography  sx={{ fontSize: 'smaller', display: 'inline-block', marginTop: '15px', opacity: '0.8' }}>
          <Moment fromNow>{msg.createdAt.toDate()}</Moment>
        </Typography>
      </Box>

        <Typography variant='subtitle2' py={1}>
          {userAddress != msg?.from ? '🎉 New Contract Proposal from helloworld.lens' : null}
        </Typography>
        <Box>
          <Typography paragraph variant='body2' fontSize={15}>
            {msg.proposalMessage ? msg.proposalMessage : null}
          </Typography>
          <Typography fontWeight='medium' fontSize={14}>
            Proposed Payout: {msg.proposalPayout ? msg.proposalPayout : null}
          </Typography>
        </Box>

        {
          (
            String(userAddress).toLowerCase() === String(msg?.from).toLowerCase()
            || String(userAddress).toLowerCase() === String(ZERO_ADDRESS).toLowerCase())
            ? null
            :
            <Stack sx={{ my: 1 }} spacing={3} direction='row' alignItems='center' justifyContent='flex-start'>
              <Button disabled={confirmationDialogState.success || contractState >= 0 } variant='contained' size="large" onClick={() => setConfirmationDialogState({ ...confirmationDialogState, open: true })}>
                Accept
              </Button>
              <Button disabled={confirmationDialogState.success || contractState >= 0 }>
                Decline
              </Button>
            </Stack>
        }
      </Box>


      <ConfirmationDialog open={confirmationDialogState.open} onOpen={() => { }} onClose={() => { setConfirmationDialogState({ ...confirmationDialogState, open: false }) }} primaryAction={approveDaiTransfer} primaryActionTitle='Accept Proposal' hasSigningStep={false} content={confirmationDialogContent} success={confirmationDialogContent.success} loading={confirmationDialogContent.loading} />
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

export { ProposalMessage, RegularMessage, type IRegularMessageData, type IProposalMessageData, type IMessageProp, type IProposalMessageProps, type IRegularMessageProps }




