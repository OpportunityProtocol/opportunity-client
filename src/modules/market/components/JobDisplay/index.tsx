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
  Skeleton,
  Grid,
  Stack,
  Divider,
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
import { useSelector } from "react-redux";
import { selectUserAddress } from "../../../user/userReduxSlice";
import fleek from "../../../../fleek";
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
    if (contractOwnerData?.lensProfileId != -1) {
      lensHub_getProfile.refetch();
    }
  }, [contractOwnerData?.lensProfileId]);

  useEffect(() => {
    networkManager_getLensProfileIdFromAddress.refetch();
  }, [data?.employer]);

  return (
    <Grid xs={12} md={6} lg={4}>
      <Card
      key={data?.id}
        onClick={() => router.push(`/view/contract/${data?.id}`)}

        square
         variant="outlined"
        sx={{
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
              data?.contract_title ? (
                <Typography fontWeight="600">
                  {data?.contract_title}
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

                data?.contract_description
                  ? data?.contract_description
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

               data?.tags && data?.tags?.length > 0 ? (
                  data?.tags?.map((tag) => {
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
                  {
                    data?.contract_budget
                      ? data?.contract_budget
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
                  <Chip
                  variant="outlined"
                  size="small"
                  label={
                    data?.duration
                      ? data?.duration
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
