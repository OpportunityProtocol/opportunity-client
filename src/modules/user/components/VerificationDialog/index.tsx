import React, { FC, useState, useEffect, ReactNode } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormControl,
  Typography,
  Divider,
  Avatar,
  Box,
  TextField,
  FormHelperText,
  Stack
} from "@mui/material";
import { Check } from "@material-ui/icons";
import { useGradientAvatarStyles } from "@mui-treasury/styles/avatar/gradient";
import { useContractRead, useContractWrite } from "wagmi";
import {
  LENS_HUB_PROXY,
  NETWORK_MANAGER_ADDRESS
} from "../../../../constant";
import { LensHubInterface, NetworkManagerInterface } from "../../../../abis";
import { ethers } from "ethers";
import { Result } from "ethers/lib/utils";
import { hexToDecimal } from "../../../../common/helper";
import { useDispatch, useSelector } from "react-redux";
import { selectUserAddress, userLensDataStored } from "../../userReduxSlice";
import { CHAIN_ID } from "../../../../constant/provider";
import { GradientAvatarClassKey } from "@mui-treasury/styles/avatar/gradient/gradientAvatar.styles";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";

interface IVerificationDialogProps {
  open: boolean;
  handleClose: () => void;
}

const VerificationDialog: FC<IVerificationDialogProps> = ({
  open = true,
  handleClose,
}) => {
  const [lensProfileId, setLensProfileId] = useState(0);
  const userAddress = useSelector(selectUserAddress);
  const dispatch = useDispatch();

  //getProfile
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
      args: [lensProfileId],
      onSuccess: (data) => {
        const {
          followModule,
          followNFT,
          followNFTURI,
          handle,
          imageURI,
          pubCount,
        } = data;

        dispatch(
          userLensDataStored({
            followModule,
            followNFT,
            followNFTURI,
            handle,
            imageURI,
            pubCount: hexToDecimal(Number(pubCount._hex)),
            profileId: Number(lensProfileId),
          })
        );
      },
      onError: (error) => console.log(error),
    }
  );

  useEffect(() => {
    if (lensProfileId !== 0) {
      lensHub_getProfile.refetch({
        throwOnError: true,
      });
    }
  }, [lensProfileId]);

  const networkManager_getLensProfileIdFromAddress = useContractRead(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "getLensProfileIdFromAddress",
    {
      enabled: false,
      chainId: CHAIN_ID,
      args: [userAddress],
      onSuccess: (data: Result) => {
        setLensProfileId(hexToDecimal(data._hex));
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const networkManager_registerWorker = useContractWrite(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: JSON.stringify(NetworkManagerInterface),
    },
    "registerWorker",
    {
      args: [
        {
          to: NETWORK_MANAGER_ADDRESS,
          handle: "babys2",
          imageURI:
            "https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
          followModule: "0x0000000000000000000000000000000000000000",
          followModuleInitData: [],
          followNFTURI:
            "https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan",
        },
      ],
      overrides: {
        gasLimit: ethers.BigNumber.from("2000000"),
        gasPrice: 90000000000,
      },
      onError: (error) => console.log(error),
      onSuccess: (data) => {
        networkManager_getLensProfileIdFromAddress.refetch();
        handleClose();
      },
    }
  );

  const handleOnVerify = async () => {
    await networkManager_registerWorker.writeAsync({
      args: [
        {
          to: NETWORK_MANAGER_ADDRESS,
          handle: "babys79",
          imageURI:
            "https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
          followModule: "0x0000000000000000000000000000000000000000",
          followModuleInitData: [],
          followNFTURI:
            "https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan",
        },
      ],
      overrides: {
        gasLimit: ethers.BigNumber.from("2000000"),
        gasPrice: 90000000000,
      },
    });
  };

  const styles: ClassNameMap<GradientAvatarClassKey> = useGradientAvatarStyles({
    size: 50,
    gap: 3,
    thickness: 3,
    gapColor: "#f4f7fa",
    color: "linear-gradient(to bottom right, #feac5e, #c779d0, #4bc0c8)",
  });

  return (
    <Dialog maxWidth="sm" open={open} onClose={handleClose} sx={{}}>
      <Divider sx={{ marginTop: 2, marginBottom: 4 }} />
          <Box
            textAlign="center"
            sx={{
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                marginBottom: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              className={styles.root}
            >
              <Avatar
                src="/assets/images/writing.jpeg"
                style={{ width: 100, height: 100 }}
              />
            </div>

            <DialogTitle
              sx={{ paddingTop: "0px !important", marginTop: "0px !important" }}
            >
              {" "}
              Become a verified freelancer on LensTalent
            </DialogTitle>
            <DialogContent>
              <DialogContentText fontWeight="bold" maxWidth={400}>
                Prioritize work based on customer needs and build a tighter
                feedback loop with your customers
              </DialogContentText>
            </DialogContent>

            <FormControl
              sx={{
                marginBottom: 3,
                marginTop: 3,
                width: "90%",
                display: "flex",
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <TextField size="small" fullWidth autoComplete={false} sx={{}} />
              <FormHelperText>
                Choose a unique handle to identify your profile
              </FormHelperText>
            </FormControl>
          </Box>

          <Divider variant="fullWidth" />
          <Box p={3}>
            <Typography fontWeight="medium" fontSize={15}>
              As a verified freelancer you would able to:
            </Typography>
            <Stack pt={1} pl={1} spacing={2}>
              <Stack direction="row" spacing={1.5}>
                <Check fontSize="small" />
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  color="text.secondary"
                >
                  Register a one time, unique and persistent identity.
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.5}>
                <Check fontSize="small" />
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  color="text.secondary"
                >
                  Access an immutable history of your completed jobs and
                  portfolio.
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.5}>
                <Check fontSize="small" />
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  color="text.secondary"
                >
                  Create services that can be monetized on any lens protocol
                  networking application.
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.5}>
                <Check fontSize="small" />
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  color="text.secondary"
                >
                  Receive referral based work from your network.
                </Typography>
              </Stack>
            </Stack>
          </Box>

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={handleOnVerify}>Verify on LensTalent</Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerificationDialog;
