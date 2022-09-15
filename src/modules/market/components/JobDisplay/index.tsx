/**
 * @title JobDisplay
 * @author Elijah Hampton
 */

import React, { useEffect, useState } from "react";
import {
  Box,
  Chip,
  TableCell,
  Card,
  CardContent,
  Typography,
  Alert,
  Grid,
  Stack,
  Divider,
  TableRow,
  Paper,
} from "@mui/material";
import { withStyles } from '@mui/styles'
import { NextRouter, useRouter } from "next/router";
import { IJobDisplayProps } from "../../MarketInterface";
import { useAccount, useContractRead } from "wagmi";
import {
  LENS_HUB_PROXY,
  NETWORK_MANAGER_ADDRESS,
  ZERO_ADDRESS,
} from "../../../../constant";
import { CHAIN_ID } from "../../../../constant/provider";
import { LensHubInterface, NetworkManagerInterface } from "../../../../abis";
import { Result } from "ethers/lib/utils";
import { hexToDecimal } from "../../../../common/helper";
import { getJSONFromIPFSPinata, getMetadata } from "../../../../common/ipfs-helper";
import moment from "moment";
import { useSelector } from "react-redux";
import { selectUserAddress } from "../../../user/userReduxSlice";

/**
 * @author Elijah Hampton
 * @param IJobDisplayProps See interface
 * @returns React Functional Component
 * @dev This component temporarily fetches contract data from the blockchain instead of graphql to obtain the contract
 * metadata due to issues with graphql returning a different encoded format
 */

 const TableBodyCell = withStyles((theme) => ({
  root: {
    color: "black",
    fontSize: "12px !important",
    padding: "10px !important",
  },
}))(TableCell);

const StatusChip = ({ status }: { status: string }) => {
  const bgcolor = () => {
    switch (status) {
      case "Reclaimed":
        return "rgba(255, 138, 0, .24)";
      case "Dispute":
        return "rgba(255, 0, 0, .19)";
      case "Unclaimed":
        return "rgba(36, 227, 32, 0.4)";
      case "Claimed":
      default:
    }
  };
  const formStatus = () => {
    switch (status) {
      case "Reclaimed":
        return "Pending Dispute";
      default:
        return status;
    }
  };

  return (
    <Chip
      label={formStatus()}
      sx={{
        display: "flex",
        borderRadius: 1,
        fontSize: 10,
        bgcolor: bgcolor(),
        width: "80px",
        height: "30px",
      }}
    />
  );
};

const JobDisplay: React.FC<IJobDisplayProps> = ({ data, table = false }) => {
  const router: NextRouter = useRouter();
  const accountData = useAccount();

  const [contractOwnerData, setContractOwnerData] = useState<any>({
    lensProfileId: -1,
  });
  const [contractMetadata, setContractMetadata] = useState({});
  const [metadataString, setMetadataString] = useState("");

  const networkManager_getContractData = useContractRead({
    addressOrName: NETWORK_MANAGER_ADDRESS,
    contractInterface: NetworkManagerInterface,
    functionName: "getContractData",
    enabled: false,
    watch: false,
    chainId: CHAIN_ID,
    args: [data?.id],
    onSuccess: (data: Result) => {
      setMetadataString(data.taskMetadataPtr);
    },
    onError: (error) => {
      setMetadataString("");
    },
  });

  const networkManager_getLensProfileIdFromAddress = useContractRead({
    addressOrName: NETWORK_MANAGER_ADDRESS,
    contractInterface: NetworkManagerInterface,
    functionName: "getLensProfileIdFromAddress",
    enabled: false,
    chainId: CHAIN_ID,
    args: [accountData?.address],
    onSuccess: (data: Result) => {
      setContractOwnerData({
        ...contractOwnerData,
        lensProfileId: hexToDecimal(data?._hex),
      });
    },
    onError: (error) => {},
  });

  const lensHub_getProfile = useContractRead({
    addressOrName: LENS_HUB_PROXY,
    contractInterface: LensHubInterface,
    functionName: "getProfile",
    enabled: false,
    watch: false,
    chainId: CHAIN_ID,
    args: [contractOwnerData?.lensProfileId],
    onSuccess: (data: Result) => {
      setContractOwnerData(data);
    },
  });

  useEffect(() => {
    if (data?.id) {
      networkManager_getContractData.refetch();
    }
  }, [data?.id]);

  useEffect(() => {
    if (contractOwnerData?.lensProfileId != -1) {
      lensHub_getProfile.refetch();
    }
  }, [contractOwnerData?.lensProfileId]);

  useEffect(() => {
    networkManager_getLensProfileIdFromAddress.refetch();
  }, [data?.employer]);

  useEffect(() => {
    async function loadMetadata() {
      const metadata = await getJSONFromIPFSPinata(metadataString)
      setContractMetadata(metadata);
    }

    if (metadataString) {
      loadMetadata();
    }
  }, [metadataString]);

  const userAddress = useSelector(selectUserAddress)

  return table ? (
    <>
    <TableRow
      onClick={
        userAddress
          ? () => router.push(`/view/contract/${data?.id}`)
          : () => {}
      }
      component={Paper}
      variant="outlined"
      sx={{
        border: 'none !important',
        position: 'relative',
        width: "100%",
        minWidth: "100% !important",
        display: "flex",
        height: 130,
        cursor: userAddress ? "pointer" : "auto",
      }}
    >
      <TableBodyCell sx={{ width: "100% !important" }}>
        <Box display="flex">
            
            <Box
         
              sx={{
                bgcolor: '#eee',
                border: 'none',
                marginRight: 2,
                borderRadius: 1,
                width: 120,
                height: 108,
              }}
            />

          <Box>
            <Typography fontWeight="medium" fontSize={14}>
              {contractMetadata?.contract_title
                ? contractMetadata?.contract_title
                : "Unable to title"}
            </Typography>
            <Typography paragraph fontSize={12}>
              {contractMetadata?.contract_description
                ? contractMetadata?.contract_description
                : "Unable to load description"}
            </Typography>
            <Typography fontSize={12}>
              {contractMetadata?.contract_definition_of_done
                ? contractMetadata?.contract_definition_of_done
                : "Unable to requirements"}
            </Typography>
            <Stack mt={0.5} direction="row" alignItems="center" spacing={1}>
          {contractMetadata?.tags &&
          contractMetadata?.tags?.length > 0 ? (
            contractMetadata?.tags?.map((tag) => {
              return (
                <Chip
                  variant="filled"
                  sx={{ fontSize: 12, width: 'auto', height: 20, backgroundColor: "#eee" }}
                  label={tag}
                  size="small"
                />
              );
            })
          ) : (
            <Typography color="text.secondary" variant="caption">
              Unable to load tags
            </Typography>
          )}
        </Stack>
          </Box>
        </Box>
       
      </TableBodyCell>
      <TableBodyCell sx={{ width: 150 }}>
        <Stack direction="row" spacing={0.5}>
          <img
            src="/assets/images/dai.svg"
            style={{ width: 18, height: 18 }}
          />
          <Typography variant="body2" fontSize={12}>
          {contractMetadata?.contract_budget}
          </Typography>
        </Stack>
      </TableBodyCell>
      <TableBodyCell sx={{ width: 150 }}>
        <StatusChip status="Unclaimed" />
      </TableBodyCell>
      <TableBodyCell sx={{ width: 150 }}>
        {moment().format("h:mm A")}
      </TableBodyCell>

      <Box component={Alert} sx={{borderTopLeftRadius: '10px !important', fontWeight: 'medium', borderRadius: 0, width: 200, height: 45, position: 'absolute', bottom: 0, right: 0}}>
            Check requirements
      </Box>
    </TableRow>

  </>
  ) : (
    <Card
      onClick={
        accountData.address
          ? () => router.push(`/view/contract/${data?.id}`)
          : () => {}
      }
      key={Math.random()}
      square
      variant="elevation"
      sx={{
        boxShadow: "0 19px 38px #eee, 0 15px 12px #eee",
        cursor: accountData.address ? "pointer" : "auto",
        width: "100%",
        height: 210,
        "&:hover": {
          color: (theme) => theme.palette.primary.main,
        },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-evenly",
        }}
      >
        {/* <Typography color="text.secondary" fontWeight="medium" fontSize={13}>
          August 1, 2022 - 1:59 PM
        </Typography> */}
        {contractMetadata?.contract_title ? (
          <Typography fontWeight="600">
            {contractMetadata?.contract_title}
          </Typography>
        ) : (
          <Typography fontWeight="600">
            Unable to load contract title
          </Typography>
        )}

        <Box
          component={Typography}
          paragraph
          color="rgb(90, 104,119)"
          fontSize={13}
          pt={1.5}
          fontWeight="medium"
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            textOverflow: "ellipsis",
          }}
        >
          {contractMetadata?.contract_description
            ? contractMetadata?.contract_description
            : "Unable to load description"}
          </Box> 

        <Grid
          pb={2}
          container
          direction="row"
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start"
        >
          {contractMetadata?.tags && contractMetadata?.tags?.length > 0 ? (
            contractMetadata?.tags?.map((tag) => {
              return (
                <Grid item mr={1} key={tag}>
                  <Chip
                    variant="filled"
                    sx={{ fontSize: 12, padding: 1, backgroundColor: "#eee" }}
                    label={tag}
                    size="small"
                  />
                </Grid>
              );
            })
          ) : (
            <Typography variant="caption">Unable to load tags</Typography>
          )}
        </Grid>

        <Grid
          sx={{ width: "100%" }}
          container
          item
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item>
            <Typography fontSize={13} fontWeight="medium">
              {contractMetadata?.contract_budget
                ? contractMetadata?.contract_budget
                : 0}{" "}
              DAI Budget
            </Typography>
          </Grid>
          <Grid item>
            <Chip
              variant="outlined"
              size="small"
              label={
                contractMetadata?.duration
                  ? contractMetadata?.duration
                  : "Undefined"
              }
            />
          </Grid>
        </Grid>
      </CardContent>

      {router.pathname.includes("/contract/view/contract") && (
        <>
          <Divider />
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Typography fontSize={13} color="text.secondary">
                Status:{" "}
                <Typography
                  fontSize={13}
                  fontWeight="medium"
                  component="span"
                  color="green"
                >
                  Resolved
                </Typography>
              </Typography>
            </Box>
          </CardContent>
        </>
      )}


    </Card>
  );
};

function areEqual(prevProps: IJobDisplayProps, nextProps: IJobDisplayProps) {
  return prevProps.data.id === nextProps.data.id;
}

export default React.memo(JobDisplay, areEqual);
