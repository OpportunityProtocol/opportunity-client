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
} from "@mui/material";

import { AccessTime, KeyboardArrowDown } from "@mui/icons-material";
import { useRouter } from "next/router";
import { IJobDisplayProps } from "../../MarketInterface";
import { useGradientAvatarStyles } from "@mui-treasury/styles/avatar/gradient";
import VerifiedAvatar from "../../../user/components/VerifiedAvatar";
import { RelationshipStruct } from "../../../../typechain-types/IGigEarth";
import { useAccount, useContractRead } from "wagmi";
import { LENS_HUB_PROXY, NETWORK_MANAGER_ADDRESS } from "../../../../constant";
import { CHAIN_ID } from "../../../../constant/provider";
import { LensHubInterface, NetworkManagerInterface } from "../../../../abis";
import { Result } from "ethers/lib/utils";
import { hexToDecimal } from "../../../../common/helper";
import { create } from "ipfs-http-client";
import fleek from "../../../../fleek";

const JobDisplay: React.FunctionComponent<IJobDisplayProps> = ({
  id,
  data,
}) => {
  const classes = useStyles();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [contractOwnerData, setContractOwnerData] = useState({
    lensProfileId: -1,
  });
  const [contractData, setContractData] = useState<RelationshipStruct & any>(
    {}
  );
  const [contractMetadata, setContractMetadata] = useState({});

  const networkManager_getContractData = useContractRead(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "getContractData",
    {
      chainId: CHAIN_ID,
      enabled: true,
      watch: false,
      args: [id],
      onSuccess(data: Result) {
        setContractData(data);
      },
      onError(error) {
        console.log(error);
      },
      onSettled(data, error) {
        setLoading(false);
      },
    }
  );

  const accountData = useAccount();

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
          lensProfileId: hexToDecimal(data._hex),
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
      args: [contractOwnerData.lensProfileId],
      onSuccess: (data: Result) => {
        setContractData({
          //@ts-ignore
          ...contractOwnerData,
          data,
        });
      },
      onError: (error) => console.log(error),
    }
  );

  useEffect(() => {
    if (contractOwnerData.lensProfileId != -1) {
      lensHub_getProfile.refetch();
    }
  }, [contractOwnerData.lensProfileId]);

  useEffect(() => {
    if (data) {
      setContractData(data);
    } else {
      setLoading(true);
      networkManager_getContractData.refetch();
    }
  }, [id]);

  useEffect(() => {
    networkManager_getLensProfileIdFromAddress.refetch();
  }, [contractData.employer]);

  useEffect(() => {
    let retVal: any = {};

    async function getMetadata() {
      try {
        if (process.env.NEXT_PUBLIC_CHAIN_ENV === "development") {
          const ipfs = create({
            url: "/ip4/127.0.0.1/tcp/8080",
          });

          retVal = await ipfs
            .get(`/ipfs/${contractData.taskMetadataPtr}`)
            .next();
        } else {
          retVal = await fleek.getService(contractData?.metadataPtr);
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

          setContractData(parsedData);
        }
      } catch (error) {
        console.log(error);
      }
    }

    getMetadata();
  }, [contractData.taskMetadataPtr]);

  return (
    <Card
      square
      onClick={() => router.push("/contract/view/contract")}
      key={Math.random()}
      className={classes.card}
      variant="outlined"
    >
      <CardContent>
        <Grid
          pb={3}
          container
          alignItems="center"
          flexWrap="nowrap"
          direction="row"
        >
          <Grid item pr={2}>
            <VerifiedAvatar avatarSize={70} />
          </Grid>

          <Grid container item flexGrow={1}>
            <Grid container item direction="column" alignItems="flex-start">
              <Grid item>
                <Typography fontWeight="600">
                  {contractMetadata?.title}
                </Typography>
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

        <Box
          component={Typography}
          paragraph
          color="rgb(94, 94, 94)"
          fontSize={13}
          fontWeight="medium"
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            textOverflow: "ellipsis",
          }}
        >
          {contractMetadata.description}
        </Box>

        <Grid
          py={2}
          container
          direction="row"
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start"
        >
          {contractMetadata?.tags.map((tag) => {
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
          })}
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
                {contractMetadata?.budget} DAI Budget
              </Typography>
              <Typography color="text.secondary" fontSize={13}>
                August 1, 2022 - 1:59 PM
              </Typography>

              <Typography
                variant="caption"
                fontWeight="medium"
                color="text.secondary"
              >
                {contractMetadata.meta.duration}
              </Typography>
            </Stack>
          </Grid>

          <Grid item>
            <Stack direction="row" alignItems="center">
              <Button variant="text" size="large">
                Open contract
              </Button>

              <Button
                variant="text"
                size="large"
                disabled
                endIcon={<KeyboardArrowDown />}
              >
                See status
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default JobDisplay;
