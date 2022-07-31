/**
 * @title JobDisplay
 * @author Elijah Hampton
 */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useStyles } from "./JobDisplayStyles";

import {
  Box,
  Avatar,
  Button,
  Chip,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  Divider,
} from "@mui/material";

import { AccessTime, KeyboardArrowDown } from "@mui/icons-material";
import { useRouter } from "next/router";
import { IJobDisplayProps } from "../../MarketInterface";
import { useGradientAvatarStyles } from "@mui-treasury/styles/avatar/gradient";
import VerifiedAvatar from "../../../user/components/VerifiedAvatar";
import { RelationshipStruct } from "../../../../typechain-types/IGigEarth";
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
import { create } from "ipfs-http-client";
import fleek from "../../../../fleek";

/**
 * @author Elijah Hampton
 * @param IJobDisplayProps See interface
 * @returns React Functional Component
 * @dev This component temporarily fetches contract data from the blockchain instead of graphql to obtain the contract
 * metadata due to issues with graphql returning a different encoded format
 */
const JobDisplay: React.FC<IJobDisplayProps> = ({ data }) => {
  const classes = useStyles();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [contractOwnerData, setContractOwnerData] = useState<any>({
    lensProfileId: -1,
  });
  const [contractMetadata, setContractMetadata] = useState({});
  const [metadataString, setMetadataString] = useState('')

  const accountData = useAccount();

  const networkManager_getContractData = useContractRead(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "getContractData",
    {
      enabled: false,
      chainId: CHAIN_ID,
      args: [data?.id],
      onSuccess: (data: Result) => {
        setMetadataString(data.taskMetadataPtr)
      },
      onError: (error) => {
        setMetadataString('')
      },
    }
  );

  const networkManager_getLensProfileIdFromAddress = useContractRead(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "getLensProfileIdFromAddress",
    {
      enabled: false,
      chainId: CHAIN_ID,
      args: [accountData?.data?.address],
      onSuccess: (data: Result) => {
        setContractOwnerData({
          ...contractOwnerData,
          lensProfileId: hexToDecimal(data?._hex),
        });
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const lensHub_getProfile = useContractRead(
    {
      addressOrName: LENS_HUB_PROXY,
      contractInterface: LensHubInterface,
    },
    "getProfile",
    {
      enabled: false,
      watch: false,
      chainId: CHAIN_ID,
      args: [contractOwnerData?.lensProfileId],
      onSuccess: (data: Result) => {
        setContractOwnerData(data);
      },
      onError: (error) => console.log(error),
    }
  );

  useEffect(() => {
    if (data?.id) {
      networkManager_getContractData.refetch()
    }
  }, [data?.id])

  useEffect(() => {
    if (contractOwnerData?.lensProfileId != -1) {
      lensHub_getProfile.refetch();
    }
  }, [contractOwnerData?.lensProfileId]);

  useEffect(() => {
    networkManager_getLensProfileIdFromAddress.refetch();
  }, [data?.employer]);

  useEffect(() => {
    let retVal: any = {};

    async function getMetadata() {
      try {

        if (process.env.NEXT_PUBLIC_CHAIN_ENV === "development") {
          const ipfs = create({
            url: "/ip4/127.0.0.1/tcp/8080",
          });

          retVal = await ipfs.get(`/ipfs/${metadataString}`).next();
        } else {
          retVal = await fleek.getService(metadataString);
        }

        if (!retVal) {
          throw new Error("Unable to retrieve service metadata data");
        } else {
          const jsonString = Buffer.from(retVal.value).toString("utf8");
          const parsedString = jsonString.slice(
            jsonString.indexOf("{"),
            jsonString.lastIndexOf("}") + 1
          );
          const parsedData = JSON.parse(parsedString);

          setContractMetadata(parsedData);
        }
      } catch (error) {
        
      }
    }

    if (metadataString) {
      getMetadata();
    }

  }, [metadataString]);

  return (
    <Card
      square
      onClick={() => router.push(`/view/contract/${data?.id}`)}
      key={Math.random()}
      variant="outlined"
      sx={{ "&:hover": { cursor: "pointer" } }}
    >
      <CardContent>
        <Typography color="text.secondary" fontWeight="medium" fontSize={13}>
          August 1, 2022 - 1:59 PM
        </Typography>
        {contractMetadata?.contract_title ? (
          <Typography fontWeight="600">{contractMetadata?.contract_title}</Typography>
        ) : (
          <Typography fontWeight="600">
            Unable to load contract title
          </Typography>
        )}

        <Box
          component={Typography}
          paragraph
          color="rgb(94, 94, 94)"
          fontSize={13}
          pt={1.5}
          fontWeight="medium"
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
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
          container
          item
          direction="row"
          alignItems="flex-end"
          justifyContent="space-between"
        >
          <Grid item>
            <Stack>
              <Typography fontSize={13} fontWeight="medium">
                {contractMetadata?.contract_budget ? contractMetadata?.contract_budget : 0} DAI
                Budget
              </Typography>

              <Typography
                variant="caption"
                fontWeight="medium"
                color="text.secondary"
              >
                {contractMetadata?.meta?.duration
                  ? contractMetadata?.meta?.duration
                  : "Undefined"}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      {router.pathname.includes("/contract/view/contract") && (
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
      )}
    </Card>
  );
};

export default JobDisplay;

/*

        <Grid
          pb={3}
          container
          alignItems="center"
          flexWrap="nowrap"
          direction="row"
        >
          <Grid item pr={2}>
            <VerifiedAvatar showHandle={false} showValue={false} avatarSize={70} />
          </Grid>

          <Grid container item flexGrow={1}>
            <Grid container item direction="column" alignItems="flex-start">
              <Grid item>


              </Grid>

              <Grid
                item
                fontWeight="medium"
                fontSize={15}
                color="text.secondary"
              >
                <Typography
                  py={1}
                  fontSize={13}
                  fontWeight="bold"
                  color={(theme) => theme.palette.primary.main}
                >
                  @janicecoleman007
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        */
