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
  Skeleton,
  Grid,
  Stack,
  Divider,
  CardActions,
  Button,
  TableRow,
  Paper,
} from "@mui/material";
import { withStyles } from '@mui/styles'
import { NextRouter, useRouter } from "next/router";
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
import fleek from "../../../../fleek";

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

interface IJobDisplayProps {
  data: any;
  table?: boolean;
  showStatus: boolean;
}

const JobDisplay: React.FC<IJobDisplayProps> = ({ data, table = false, showStatus = false }) => {
  const router: NextRouter = useRouter();
  const accountData = useAccount();

  const [contractOwnerData, setContractOwnerData] = useState<any>({
    lensProfileId: -1,
  });
  const [contractMetadata, setContractMetadata] = useState({});
  const [metadataString, setMetadataString] = useState("");
  const [loading, setLoading] = useState(false)

  const userAddress = useSelector(selectUserAddress)

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
    onError: (error) => { },
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
      const metadata = await fleek.getContract(String(metadataString).slice(13))
      setContractMetadata(metadata);
    }

    if (metadataString) {
      setLoading(true)
      loadMetadata().finally(() => setLoading(false))
    }
  }, [metadataString]);


  return (
    <Grid xs={12} md={6} lg={4}>
      <Card
        onClick={() => router.push(`/view/contract/${data?.id}`)}
        key={Math.random()}

        square
        // variant="outlined"
        sx={{
          boxShadow: '10px 10px 5px 0px rgba(238,238,238,0.75)',
          WebkitBoxShadow: '10px 10px 5px 0px rgba(238,238,238,0.75)',
          MozBoxShadow: '10px 10px 5px 0px rgba(238,238,238,0.75)',
          cursor: "pointer",
          width: "100%",
          height: '200px',
          "&:hover": {
            color: (theme) => theme.palette.primary.main,
          },
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            height: 210,
            flexDirection: "column",
            justifyContent: "space-evenly",
          }}
        >
          {
            loading ? <Skeleton variant='text' component='h3' /> :


              contractMetadata?.contract_title ? (
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
            fontWeight="medium"
            sx={{
              height: 30,
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              textOverflow: "ellipsis",
            }}
          >
            {
              loading ? <Skeleton variant='text' component='h6' sx={{ height: 45 }} /> :

                contractMetadata?.contract_description
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
            {

              loading ?
                <Stack direction='row' alignItems='center' spacing={2}>
                  {[0, 1, 2].map((num) => <Skeleton sx={{ width: 48, height: 37, borderRadius: 3 }} />)}
                </Stack>
                :

                contractMetadata?.tags && contractMetadata?.tags?.length > 0 ? (
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
            <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography mr={0.5} component='span' fontSize={13} fontWeight='medium'>
                Budget: {" "}
              </Typography>

              <Stack direction='row' alignItems='center'>
                <Typography fontSize={13} fontWeight='medium'>
                  {loading ? <Skeleton variant='text' sx={{ width: 15, height: 20 }} />
                    :
                    contractMetadata?.contract_budget
                      ? contractMetadata?.contract_budget
                      : 0}{" "}
                </Typography>
                <img
                  src="/assets/images/dai.svg"
                  style={{ margin: '3px 3px', width: 15, height: 20 }}
                />
              </Stack>
            </Grid>
            <Grid item>
              <Stack direction='row' alignItems='center'>
                <Typography fontSize={12}>
                  Predicted Duration:
                </Typography>
                &nbsp;
                {
                  loading ? 
                  <Skeleton sx={{ width: 48, height: 37, borderRadius: 3 }} />
                  :
                  <Chip
                  variant="outlined"
                  size="small"
                  label={
                    contractMetadata?.duration
                      ? contractMetadata?.duration
                      : "Undefined"
                  }
                />
                }
              
              </Stack>

            </Grid>
          </Grid>
        </CardContent>

        {
          showStatus && (
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
          )
        }
      </Card>
    </Grid>
  );
};

function areEqual(prevProps: IJobDisplayProps, nextProps: IJobDisplayProps) {
  return prevProps.data.id === nextProps.data.id;
}

export default React.memo(JobDisplay, areEqual);
