import React, { FC, useState, ReactNode } from "react";
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
  Stack,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import TextInput from "../../../../common/components/BootstrapInput/BootstrapInput";
import { Check } from "@material-ui/icons";
import Image from "next/image";
import { useGradientAvatarStyles } from "@mui-treasury/styles/avatar/gradient";
import { useContractWrite } from "wagmi";
import { NETWORK_MANAGER_ADDRESS, ZERO_ADDRESS } from "../../../../constant";
import { NetworkManagerInterface } from "../../../../abis";
import { TransactionResponse } from "@ethersproject/abstract-provider";

const steps = [
  "Select campaign settings",
  "Create an ad group",
  "Create an ad",
];

interface IVerificationDialogProps {
  open: boolean;
  handleClose: () => void;
  address: string;
}

const VerificationDialog: FC<IVerificationDialogProps> = ({
  open = false,
  handleClose,
  address
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());

  const networkManager_registerWorker = useContractWrite(
      {
          addressOrName: NETWORK_MANAGER_ADDRESS,
          contractInterface: JSON.stringify(NetworkManagerInterface),
      },
      'registerWorker',
      {
        args: [{
          to: NETWORK_MANAGER_ADDRESS,
        handle: 'coolnameman',
        imageURI: 'sdfsdjfopisdjfosdj;foasdijfsodij',
        followModule: '0xf2ccc94C945C4CC7669d681fE740f1eF13ac0603',
        followModuleInitData: [],
        followNFTURI: 'dsoifajsdfjsdoifsdf'
        }],
        onError: error => console.log(error),
        onSuccess: data => console.log(data)
      }
  )

  const handleOnVerify = async () => {
    await networkManager_registerWorker.writeAsync({
      args: [{
        to: NETWORK_MANAGER_ADDRESS,
      handle: 'coolnameman',
      imageURI: 'sdfsdjfopisdjfosdj;foasdijfsodij',
      followModule: '0xf2ccc94C945C4CC7669d681fE740f1eF13ac0603',
      followModuleInitData: [],
      followNFTURI: 'dsoifajsdfjsdoifsdf'
      }],
      overrides: {
        gasLimit: 50000
      }
    })
  } 

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
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
      <Stepper
        sx={{ marginTop: 2, paddingLeft: 2, paddingRight: 2 }}
        activeStep={activeStep}
      >
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: ReactNode;
          } = {};
          if (isStepOptional(index)) {
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>
                <Typography fontSize={14}>{label}</Typography>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Divider sx={{ marginTop: 2, marginBottom: 4 }} />
      {activeStep === 0 ? (
        <React.Fragment>
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
        </React.Fragment>
      ) : null}

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        {activeStep === 0 ? (
          <Button onClick={() => setActiveStep(prevState => prevState + 1)}>Next</Button>
        ) : (
          <Button onClick={handleOnVerify}>Verify on LensTalent</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default VerificationDialog;
