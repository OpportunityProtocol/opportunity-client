/**
 * @title JobDisplay
 * @author Elijah Hampton
 */

import React, { useEffect, useState } from "react";
import {
  Box,
  Chip,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  Divider,
} from "@mui/material";

import { useRouter } from "next/router";
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
import { getMetadata } from "../../../../common/ipfs-helper";

/**
 * @author Elijah Hampton
 * @param IJobDisplayProps See interface
 * @returns React Functional Component
 * @dev This component temporarily fetches contract data from the blockchain instead of graphql to obtain the contract
 * metadata due to issues with graphql returning a different encoded format
 */
const JobDisplay: React.FC<IJobDisplayProps> = ({ data }) => {
  const router = useRouter();
  const accountData = useAccount();

  const [contractOwnerData, setContractOwnerData] = useState<any>({
    lensProfileId: -1,
  });
  const [contractMetadata, setContractMetadata] = useState({});
  const [metadataString, setMetadataString] = useState("");

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
        setMetadataString(data.taskMetadataPtr);
      },
      onError: (error) => {
        setMetadataString("");
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
      onError: (error) => {},
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
    }
  );

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
      const metadata = await getMetadata(metadataString);
      setContractMetadata(metadata);
    }

    if (metadataString) {
      loadMetadata();
    }
  }, [metadataString]);

  return (
    <Card
      onClick={
        accountData?.data?.address
          ? () => router.push(`/view/contract/${data?.id}`)
          : () => {}
      }
      key={Math.random()}
      variant="outlined"
      sx={{
        cursor: accountData?.data?.address ? "pointer" : "auto",
        width: "100%",
        height: 210,
        '&:hover': {
          color: (theme) => theme.palette.primary.main
        }
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
            <Chip variant='outlined' size='small' label={contractMetadata?.meta?.duration
                ? contractMetadata?.meta?.duration
                : "Undefined"} />
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
